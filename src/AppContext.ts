import React from 'react';
import IManifestData from "./interface/IManifestData";
import {AnnotationType, HitType} from "./fetch/SearchApi";
import {IAlertContent} from "./Alert";

interface IContext {
    treeDate: number;
    tab: string;
    setTab: (tab: string) => void;
    page: number;
    setPage: (currentPage: number) => void;
    currentManifest: IManifestData | undefined;
    setCurrentManifest: (id?: string) => void;
    currentFolder: IManifestData | undefined;
    setCurrentFolder: (manifest: IManifestData | undefined) => void;
    authDate: number;
    setAuthDate: (authDate: number) => void;
    currentAnnotation: AnnotationType | undefined;
    setCurrentAnnotation: (annotation: AnnotationType | undefined) => void;
    searchResult: HitType[];
    setSearchResult: (annotation: HitType[]) => void;
    q: string;
    setQ: (q: string) => void;
    viewerVisibility: boolean,
    setViewerVisibility: (v: boolean) => void;
    alert: IAlertContent | undefined;
    setAlert: (content: IAlertContent | undefined) => void;
    lastItemActivationDate: number;
    setLastItemActivationDate: (authDate: number) => void;
    treeExpanded: boolean;
    setTreeExpanded: (expanded: boolean) => void;
    isMobile: boolean;
}

export const AppContext = React.createContext<IContext>({
    treeDate: 0,
    tab: '',
    setTab: () => {},
    page: 0,
    setPage: () => {},
    currentManifest: undefined,
    setCurrentManifest: () => {},
    currentFolder: undefined,
    setCurrentFolder: () => {},
    authDate: 0,
    setAuthDate: () => {},
    currentAnnotation: undefined,
    setCurrentAnnotation: () => {},
    searchResult: [],
    setSearchResult: () => {},
    q: '',
    setQ: () => {},
    viewerVisibility: true,
    setViewerVisibility: () => {},
    alert: undefined,
    setAlert: () => {},
    lastItemActivationDate: 0,
    setLastItemActivationDate: () => {},
    treeExpanded: false,
    setTreeExpanded: () => {},
    isMobile: false,
});

export default AppContext;
