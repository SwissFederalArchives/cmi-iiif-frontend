import Cache from '../lib/Cache';
import IManifestData, {
    IAuthService, IHomepage, IManifestReference, IPresentationApiImage, IPresentationApiItemsType,
    IPresentationApiManifestation, IPresentationApiResource, ISearchService, ISeeAlso
} from '../interface/IManifestData';
import ManifestData from '../entity/ManifestData';
import ManifestDataThumnail from '../entity/ManifestDataThumbnail';
import ISequence from '../interface/ISequence';
import UrlValidation from '../lib/UrlValidation';
import Config from '../lib/Config';
import * as manifesto from 'manifesto.js';
import { ServiceProfile } from "@iiif/vocabulary/dist-commonjs";
import Token from "../lib/Token";
import {IIIFResource, PropertyValue} from "manifesto.js";
import ITranscription from "../interface/ITranscription";
import i18n from "i18next";
import * as DOMPurify from 'dompurify';
import { sanitizeRulesSet } from '../lib/ManifestHelpers';

declare let global: {
    config: Config;
};

class Manifest {

    static lang: string = 'en';

    static cache: {[key: string]: IManifestData} = {};
    static cacheSkipAuthentication: {[key: string]: IManifestData} = {};


    static get(url?: string, skipAuthentication?: boolean): Promise<IManifestData> {

        return new Promise((resolve, reject) => {
            if (url === undefined || url === '') {
                reject({
                    title: 'Error',
                    body: 'Url is empty or undefined!\n\n'
                })
                return;
            }

            const data = this.fetchFromCache(url, skipAuthentication);
            if (data) {
                resolve(data);
                return;
            }

            this.fetchFromUrl(url, skipAuthentication).then(d => resolve(d)).catch(r => reject(r));
        });
    }

    static fetchFromUrl(url: string, skipAuthentication?: boolean, token?: string): Promise<IManifestData> {

        return new Promise((resolve, reject) => {
            if (!global.config.isAllowedOrigin(url)) {
                reject({
                    title: 'Error',
                    body: 'The manifest url is not an allowed origin: ' + url
                });
                return;
            }

            const t = this;
            const init: RequestInit = {};
            if (token) {
                const authHeader: Headers = new Headers();
                authHeader.set('Authorization', 'Bearer ' + token);
                init.headers = authHeader;
            }

            fetch(url, init).then((response) => {
                const statusCode = response.status;

                if (statusCode !== 401 && statusCode >= 400) {
                    reject({
                        title: 'Error',
                        body: 'Could not fetch manifest!\n\n' + url
                    });
                    return;
                }

                response.json().then((json) => {

                    let manifestoData;
                    manifestoData = manifesto.parseManifest(json);
                    if (!manifestoData) {
                        reject({
                            title: 'Error',
                            body: 'Manifest could not load!\n\n' + url
                        });
                        return;
                    }

                    const manifestData: IManifestData = new ManifestData();

                    manifestData.id = manifestoData.id;
                    manifestData.request = url !== response.url ? url : undefined;
                    const type = manifestoData.getProperty('type');
                    if (type === 'sc:Manifest' || type === 'Manifest') {
                        manifestData.type = 'Manifest';
                    } else if (type === 'sc:Collection' || type === 'Collection') {
                        manifestData.type = 'Collection';
                    }
                    manifestData.label = manifestoData.getLabel() ?? new PropertyValue();
                    const isV3 = this.isV3(manifestoData);
                    if (isV3) {
                        const partOf = manifestoData.getProperty('partOf');
                        if (partOf && partOf.length > 0) {
                            manifestData.parentId = partOf[0].id;
                        }
                        manifestData.transcription = this.getTranscription(manifestoData);
                    } else {
                        const within = manifestoData.getProperty('within');
                        if (typeof within === 'string') {
                            manifestData.parentId = within;
                        } else if (within && within.hasOwnProperty('@id')) {
                            manifestData.parentId = within['@id'];
                        }
                    }
                    manifestData.authService = this.getAuthService(manifestoData);

                    if (!manifestData.label || manifestData.label.length === 0) {
                        reject({
                            title: 'Error',
                            body: 'Manifest file does not contain a label!\n\n' + url
                        });
                        return;
                    }

                    if (!manifestData.id) {
                        return reject({
                            title: 'Error',
                            body: 'Manifest file does not contain an id!\n\n' + url
                        });
                    }

                    if (statusCode === 401 || (url !== response.url && manifestData.authService)) {

                        if (token) {
                            reject({
                                title: 'Login failed',
                                body: ''
                            });
                            return;
                        }
                        if (!manifestData.authService) {
                            reject({
                                title: 'Login failed',
                                body: 'Auth service is missing!'
                            });
                            return;
                        }
                        if (!manifestData.authService.token) {
                            reject({
                                title: 'Login failed',
                                body: 'Token service is missing!'
                            });
                            return;
                        }

                        const newToken = manifestData.authService.token;
                        if (Token.has(newToken)) {
                            this.fetchFromUrl(url,  false, Token.get(newToken)).then(d => resolve(d))
                                .catch(r => reject(r));
                            return;
                        }

                        if (manifestData.authService.profile === ServiceProfile.AUTH_1_EXTERNAL) {
                            this.loginInExternal(manifestData.authService, url).then(d => resolve(d))
                                .catch(r => reject(r));
                            return;
                        }

                        if (skipAuthentication === true) {
                            t.cacheSkipAuthentication[url] = manifestData;
                        } else {
                            Cache.ee.emit('show-login', manifestData.authService);
                            manifestData.collections = [];
                            manifestData.manifests = [];
                            manifestData.restricted = true;
                        }
                    } else {
                        const isV3 = this.isV3(manifestoData);
                        manifestData.metadata = manifestoData.getMetadata();
                        manifestData.description = manifestoData.getDescription();
                        manifestData.license = t.getLicense(manifestoData);
                        manifestData.logo = manifestoData.getLogo();
                        manifestData.attribution = manifestoData.getRequiredStatement();
                        manifestData.manifestations = t.getManifestations(manifestoData);
                        manifestData.seeAlso = t.getSeeAlso(manifestoData);
                        manifestData.homepage = t.getHomepage(manifestoData);
                        manifestData.services = manifestoData.getServices();
                        manifestData.restricted = false;
                        if (manifestData.type === 'Collection') {
                            manifestData.manifests = t.getManifests(manifestoData);
                            manifestData.collections = t.getCollections(manifestoData);
                        } else if (manifestData.type === 'Manifest') {
                            const {resource, images, type} = t.getResource(manifestoData, isV3);
                            manifestData.resource = resource;
                            manifestData.images = images;
                            manifestData.itemsType = type;
                        }
                        manifestData.search = t.getSearch(manifestoData);
                        manifestData.thumbnail = t.getThumbnail(manifestoData);
                        t.cache[manifestData.id] = manifestData;
                    }

                    resolve(manifestData);
                }).catch((err) => {
                    console.log(err, url);
                    reject({
                        title: 'Error',
                        body: 'Could not read manifest!\n\n' + url
                    });
                });
            });
        });
    }

    static loginInExternal(authService: IAuthService, url: string): Promise<IManifestData> {

        return new Promise((resolve, reject) => {
            if (!authService.token) {
                return false;
            }
            const tokenId = authService.token;

            fetch(tokenId).then((externalTokenResponse) => {
                const statusCode = externalTokenResponse.status;
                if (statusCode !== 200) {
                    reject({
                        title: authService.failureHeader,
                        body: authService.errorMessage
                    });
                    return;
                }

                externalTokenResponse.json()
                    .then((externalTokenJson: any) => {
                        Token.set(externalTokenJson, tokenId, authService.logout);
                        this.fetchFromUrl(url, false, Token.get(tokenId)).then(d => resolve(d))
                            .catch(r => reject(r));
                    });
            });

            return true;
        });
    }

    static getAuthService(manifestoData: IIIFResource): IAuthService | undefined {

        const serviceProfiles = [
            ServiceProfile.AUTH_1_EXTERNAL,
            ServiceProfile.AUTH_1_KIOSK,
            ServiceProfile.AUTH_1_CLICK_THROUGH,
            ServiceProfile.AUTH_1_LOGIN
        ]

        let authService;
        let profile = '';
        let id = '';
        for (const serviceProfile of serviceProfiles) {
            authService = manifestoData.getService(serviceProfile);
            if (authService) {
                profile = serviceProfile;
                id = authService.id;
                break;
            }
        }
        if (!authService) {
            return undefined;
        }

        const tokenService = authService.getService(ServiceProfile.AUTH_1_TOKEN);

        const logoutService = authService.getService(ServiceProfile.AUTH_1_LOGOUT);

        return {
            token: tokenService ? tokenService.id : undefined,
            logout: logoutService ? logoutService.id : undefined,
            confirmLabel: authService.getConfirmLabel(),
            description: authService.getDescription(),
            errorMessage: authService.getFailureDescription(),
            header: authService.getHeader(),
            failureHeader: authService.getFailureHeader(),
            profile,
            id
        };
    }

    static getSearch(manifestoData: IIIFResource): ISearchService | undefined {
        let searchService = manifestoData.getService(ServiceProfile.SEARCH_0);
        if (searchService) {
            let autoCompleteService = searchService.getService(ServiceProfile.SEARCH_0_AUTO_COMPLETE);
            if (autoCompleteService) {
                return {
                    id: searchService.id,
                    autoCompleteId: autoCompleteService.id
                }
            }
            return {
                id: searchService.id
            }
        }
        searchService = manifestoData.getService(ServiceProfile.SEARCH_1);
        if (searchService) {

            let autoCompleteService = searchService.getService(ServiceProfile.SEARCH_1_AUTO_COMPLETE);
            if (autoCompleteService) {
                return {
                    id: searchService.id,
                    autoCompleteId: autoCompleteService.id
                }
            }

            return {
                id: searchService.id
            }
        }


        return undefined;
    }

    static getLicense(manifestoData: IIIFResource): string | null {
        let license: string | null;
        if (this.isV3(manifestoData)) {
            license = manifestoData.getProperty('rights');
        } else {
            license = manifestoData.getLicense();
        }

        if (!license || !UrlValidation.isURL(license)) {
            return null;
        }

        return license;
    }

    static getResource(manifestoData: any, isV3: boolean): {resource: IPresentationApiResource | undefined, images: IPresentationApiImage[], type: IPresentationApiItemsType} {


        if (typeof manifestoData.getSequenceByIndex !== 'function') {
            return {resource: undefined, images: [], type: 'file'};
        }

        const sequence0 = manifestoData.getSequenceByIndex(0);
        if (sequence0 === undefined) {
            return {resource: undefined, images: [], type: 'file'};
        }


        if (isV3) {
            return this.getIIF3Resource(sequence0);
        } else {
            const images = this.getImageResources(sequence0);
            if (images.length > 0) {
                return {resource: undefined, images, type: 'image'};
            }

            const audioVideoResource = this.getAudioVideoResource(sequence0);
            if (audioVideoResource) {
                return {resource: audioVideoResource,  images: [], type: 'audioVideo'};
            }

            const fileResource = this.getFileResource(sequence0);
            if (fileResource) {
                let type: IPresentationApiItemsType = 'file';
                if (fileResource.type === 'pdf' || fileResource.format === 'pdf/application') {
                    type = 'pdf';
                } else if (fileResource.format?.endsWith('/plain')) {
                    type = 'plain';
                }
                return {resource: fileResource, images: [], type};
            }
        }


        return {resource: undefined, images: [], type: 'file'};
    }

    static getManifestations(manifestoData: IIIFResource): IPresentationApiManifestation[] {

        const manifestations = [];

        const renderings = manifestoData.getRenderings();
        for (const i in renderings) {
            if (renderings.hasOwnProperty(i)) {
                const rendering = renderings[i];
                const manifestation: IPresentationApiManifestation = {
                    label: rendering.getLabel(),
                    url: rendering.id,
                };
                manifestations.push(manifestation);
            }
        }

        return manifestations;
    }

    static getSeeAlso(manifestoData: IIIFResource): ISeeAlso[] | undefined {

        const seeAlso: ISeeAlso[] = [];

        const seeAlso0 = manifestoData.getSeeAlso();
        if (!seeAlso0) {
            return undefined;
        }
        for (const i of seeAlso0) {
            seeAlso.push({
                id: i.id,
                label: i.label
            });
        }

        return seeAlso.length > 1 ? seeAlso : undefined;
    }

    static getHomepage(manifestoData: IIIFResource): IHomepage | undefined {

        const homepage: any = this.getMainHomepage(manifestoData);
        if (!homepage) {
            return undefined;
        }
        if (!('id' in homepage)) {
            console.log('Homepage has no id!')
            return undefined;
        }
        if (!('type' in homepage)) {
            console.log('Homepage has no type!')
            return undefined;
        }
        if (!('label' in homepage)) {
            console.log('Homepage has no label!')
            return undefined;
        }

        const label = new PropertyValue();
        for (const [key, value] of Object.entries(homepage.label)) {
            label.setValue(value as string, key)
        }
        return {
            id: homepage.id,
            type: homepage.type,
            label,
            format: homepage.format,
        }
    }

    static getMainHomepage(manifestoData: IIIFResource): any {
        const homepages = manifestoData.getProperty("homepage");
        if (!homepages || !Array.isArray(homepages) || homepages.length === 0) {
            return undefined;
        }

        if (homepages.length === 1) {
            return homepages[0];
        }

        for (const h of homepages) {
            if ('language' in h && h.language.includes(i18n.language)) {
                return h;
            }
        }

        for (const h of homepages) {
            if ('language' in h && h.language.map((l: string) => l.slice(0, 2)).includes(i18n.language.slice(0,2))) {
                return h;
            }
        }

        return homepages[0];
    }

    static getAudioVideoResource(sequence0: ISequence): IPresentationApiResource | undefined {
        if (!sequence0.__jsonld) {
            return undefined;
        }

        const jsonld: any = sequence0.__jsonld;
        if (!jsonld.hasOwnProperty('elements')) {
            return undefined;
        }

        const element0: any = jsonld['elements'][0];
        if (element0 === undefined) {
            return undefined;
        }

        if (!element0.hasOwnProperty('format')) {
            return undefined;
        }

        const mime = element0.format;
        const mediaType = mime.slice(0, 5);
        if (mediaType !== 'audio' && mediaType !== 'video') {
            return undefined;
        }

        if (element0['@id'] === null) {
            return undefined;
        }

        return {
            id: element0['@id'],
            format: mime,
            type: mediaType
        };
    }

    static getIIF3Resource(sequence0: any): {resource: IPresentationApiResource | undefined, images: IPresentationApiImage[], type: IPresentationApiItemsType} {


        const images: IPresentationApiImage[] = [];
        for (const canvas of sequence0.getCanvases()) {
            try {

                const source = canvas.getContent()[0].getBody()[0];
                const type = (source.getType() ?? '').toLowerCase();
                let format = source.getFormat() ?? '';
                if (format === '') {
                    format = source.__jsonld?.value ?? '';
                }
                format = format.toLowerCase();

                if (type === 'video' || format.slice(0, 5) === 'video') {
                    return {
                        resource: {
                            format,
                            id: source.id,
                            type: 'video',
                            manifestations: this.getManifestations(canvas)
                        },
                        images,
                        type: 'audioVideo'
                    };
                }

                if (type === 'sound' || type === 'audio' || format.slice(0, 5) === 'audio') {
                    return {
                        resource: {
                            format: source.__jsonld?.value ?? '',
                            id: source.id,
                            type: 'audio',
                            manifestations: this.getManifestations(canvas)
                        },
                        images,
                        type: 'audioVideo'
                    };
                }
                if (format === 'application/pdf') {
                    return {
                        resource: {
                            format,
                            id: source.id,
                            type: 'pdf',
                            manifestations: this.getManifestations(canvas)
                        },
                        images,
                        type: 'pdf'
                    };
                }
                if (format === 'text/html') {
                    return {
                        resource: {
                            format,
                            id:  DOMPurify.sanitize(source.id, sanitizeRulesSet),
                            type: 'html',
                            manifestations: this.getManifestations(canvas)
                        },
                        images,
                        type: 'html'
                    };
                }
                if (format.startsWith('text/')) {
                    return {
                        resource: {
                            format,
                            id: source.id,
                            type: 'plainText',
                            manifestations: this.getManifestations(canvas)
                        },
                        images,
                        type: 'plain'
                    };
                }

                if (type === 'image') {
                    const profiles = [
                        'level2',
                        'level3',
                        'http://iiif.io/api/image/2/level2.json',
                        'http://iiif.io/api/image/2/level2.json'
                    ]
                    for(const profile of profiles) {
                        const service = source.getService(profile);
                        if (service) {
                            images.push({
                                id: service.id,
                                on: canvas.id,
                                width: canvas.getWidth(),
                                height: canvas.getHeight(),
                                format: canvas.getFormat(),
                            });
                            break;
                        }
                    }

                } else {
                    return {
                        resource: {
                            format,
                            id: source.id,
                            type: 'file',
                            manifestations: this.getManifestations(canvas)
                        },
                        images,
                        type: 'file'
                    };
                }

            } catch (e) {
                return {resource: undefined, images: [], type: 'file'};
            }
        }
        if (images.length > 0) {
            return {resource: undefined, images, type: 'image'};
        }

        return {resource: undefined, images, type: 'file'};
    }


    static getFileResource(sequence0: any) {
        try {
            const element = sequence0.getCanvasByIndex(0)
            const id = element.id;
            const format = element.__jsonld.format;
            if (format === 'application/pdf') {
                return {
                    id,
                    type: 'pdf',
                    format,
                    manifestations: this.getManifestations(element)
                };
            }
            if (format === 'text/plain') {
                return {
                    id,
                    type: 'plainText',
                    format
                };
            }
            return {
                id,
                type: 'file',
                format,
                manifestations: this.getManifestations(element)
            };
        } catch (e) {}

        return null;
    }


    static getImageResources(sequence0: any): IPresentationApiImage[] {

        const sources: IPresentationApiImage[] = [];
        for (const canvases of sequence0.getCanvases()) {

            let images = canvases.getImages();
            if (images === undefined || images.length === 0) {
                continue;
            }
            const image0 = images[0];


            let resource = image0.getResource();


            if (resource === undefined || !resource.id) {
                continue;
            }

            let service = resource.getService('http://iiif.io/api/image/2/level2.json');
            if (!service) {
                service = resource.getService('http://iiif.io/api/image/2/level1.json');
                if (!service) {
                    continue;
                }
            }

            if (service.hasOwnProperty('id') === undefined) {
                continue;
            }

            sources.push({
                id: service.id,
                on: image0.getOn(),
                format: canvases.getFormat(),
                width: canvases.getWidth(),
                height: canvases.getHeight()
            });
        }

        return sources;
    }

    static getTranscription(manifestoData: any): ITranscription[] {
        if (typeof manifestoData.getSequenceByIndex !== 'function') {
            return [];
        }

        const sequence0 = manifestoData.getSequenceByIndex(0);
        if (sequence0 === undefined) {
            return [];
        }

        const transcription: ITranscription[] = [];
        const annotations = sequence0.getCanvases()[0].getProperty('annotations')
        if (annotations === undefined) {
            return [];
        }

        const annotationsItems = annotations[0].items;
        for (const annotation of annotationsItems) {
            const timeCodes =  annotation.target.split('#t=').pop().split(',');
            transcription.push({
                content: annotation.body.value,
                start:  parseInt(timeCodes[0]),
                end:  timeCodes[1] ? parseInt(timeCodes[1]) : 0
            });
        }
        return transcription;
    }

    static getThumbnail(manifestoData: any) {

        const manifestoThumbnail = manifestoData.getThumbnail();
        if (manifestoThumbnail === undefined ||
            manifestoThumbnail === null ||
            !manifestoThumbnail.hasOwnProperty('id')) {
            return undefined;
        }

        const thumbnail = new ManifestDataThumnail();
        thumbnail.id = manifestoThumbnail.id;

        const services = [
            ServiceProfile.IMAGE_2_LEVEL_2,
            'level2'
        ];
        for (const service of services) {
            let thumbnailService = manifestoThumbnail.getService(service);
            if (thumbnailService !== null && thumbnailService.hasOwnProperty('id')) {
                thumbnail.service = thumbnailService.id;
                return thumbnail;
            }
        }

        return thumbnail;
    }

    static getManifests(manifestoData: any): IManifestReference[] {

        const manifestoManifests = manifestoData.getManifests();
        if (manifestoManifests.length === 0) {
            return [];
        }

        const manifests = [];
        for (const key in manifestoManifests) {
            if (manifestoManifests.hasOwnProperty(key)) {
                const manifestoManifest = manifestoManifests[key];
                manifests.push({
                    id: manifestoManifest.id,
                    label: manifestoManifest.getLabel(),
                    thumbnail: this.getThumbnail(manifestoManifest),
                    type: manifestoManifest.getProperty('type')
                });
            }
        }

        return manifests;
    }

    static getCollections(manifestoData: any): IManifestReference[] {
        const manifestoCollections = manifestoData.getCollections();
        if (manifestoCollections.length === 0) {
            return [];
        }

        const collections: IManifestReference[] = [];
        for (const key in manifestoCollections) {
            if (manifestoCollections.hasOwnProperty(key)) {
                const manifestoManifest = manifestoCollections[key];
                collections.push({
                    id: manifestoManifest.id,
                    label: manifestoManifest.getLabel(),
                    thumbnail: this.getThumbnail(manifestoManifest),
                    type: manifestoManifest.getProperty('type').replace('sc:', '')
                });
            }
        }

        return collections;
    }

    static fetchFromCache(url: string, skipAuthentication?: boolean): IManifestData | false {

        if (this.cache.hasOwnProperty(url)) {
            return this.cache[url];
        }

        if (skipAuthentication === true && this.cacheSkipAuthentication.hasOwnProperty(url)) {
            return this.cacheSkipAuthentication[url];
        }

        return false;
    }

    static getIdFromCurrentUrl() {
        let manifestUri = this.getGetParameter('manifest');

        if (!manifestUri || manifestUri === '') {
            manifestUri = global.config.getManifest();
        }

        if (!manifestUri || manifestUri === '') {
            return undefined;
        }

        return manifestUri;
    }

    static clearCache() {
        this.cache = {};
    }

    static getRootId() {
        for(const m of Object.values(this.cache)) {
            if (m.parentId === undefined && m.id) {
                return m.id;
            }
        }

        return undefined;
    }

    static getRootManifest() {
        const rootId = this.getRootId();
        if (rootId === undefined) {
            return undefined;
        }

        return this.cache[rootId];
    }

    static getGetParameter(name: string, defaultValue?: string): string | undefined {
        const urlObject = new URL(window.location.href);
        return urlObject.searchParams.get(name) ?? defaultValue;
    }

    static isV3(manifestoData: IIIFResource) {
        const context: any = manifestoData.context;

        if (typeof context === 'string') {
            return context === 'http://iiif.io/api/presentation/3/context.json';
        }

        if (context && typeof context.includes === 'function') {
            return context.includes('http://iiif.io/api/presentation/3/context.json');
        }

        return false;
    }


}

export default Manifest;
