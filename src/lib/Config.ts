import TouchDetection from './TouchDetection';
import IConfigParameter from '../interface/IConfigParameter';
import EnvironmentConfig from '../fetch/EnvironmentConfig';
import { forEachResolvedProjectReference } from 'ts-loader/dist/instances';

class Config {
  private readonly id: string = '';

  private readonly defaultNavBarWidth: number = 300;

  private minimalNavBarWidth: number = 120;

  private readonly language: string;

  private readonly disableSharing: boolean;

  private readonly disableDownload: boolean;

  private readonly disableLanguageSelection: boolean;

  private readonly lazyTree: boolean;

  private readonly hideUnbranchedTrees: boolean;

  private readonly externalSearchUrl?: string;

  private readonly manifest: string;

  private readonly fallbackLanguage: string = 'de';

  private readonly allowedOrigins: string[] = ['*'];

  private readonly htmlViewer: boolean;

  private readonly supportedLanguages: string[] = ['*'];
  private readonly translations: { [key: string]: string } = {
    de: 'Deutsch',
    fr: 'Français',
    it: 'Italiano',
    en: 'English',
  };
  private readonly hasBreadcrumbs: boolean;

  constructor(config: IConfigParameter) {
    const envConfig = EnvironmentConfig.get();
    this.id = config.id;
    this.language = config.language ? config.language : window.navigator.language;
    this.manifest = config.manifest ? config.manifest : '';
    this.allowedOrigins = envConfig?.ALLOWED_ORIGINS ? envConfig?.ALLOWED_ORIGINS?.split(',').map((o:string) => o.trim()) : ['*'];
    this.supportedLanguages = envConfig?.SupportedLanguages ? envConfig?.SupportedLanguages?.split(',').map((o:string) => o.trim()) : ['DE'];
    this.hasBreadcrumbs = envConfig?.HasBreadcrumbs ?  envConfig?.HasBreadcrumbs.toLowerCase() === 'true' : true;
    this.disableSharing = config.disableSharing ? config.disableSharing : false;
    this.disableDownload = config.disableDownload ? config.disableDownload : false;
    this.disableLanguageSelection = config.disableLanguageSelection ? config.disableLanguageSelection : false;
    this.lazyTree = config.lazyTree ? config.lazyTree : false;
    this.hideUnbranchedTrees = config.hideUnbranchedTrees ? config.hideUnbranchedTrees : false;
    this.externalSearchUrl = config.externalSearchUrl;
    this.htmlViewer = config.htmlViewer ?? false;
}

  getSplitterWidth(folded: boolean) {
    if (TouchDetection.isTouchDevice()) {
      if (folded) {
        return 0;
      }

      return 16;
    }

    return 8;
  }

  getDefaultNavBarWith() {
    return this.defaultNavBarWidth;
  }

  getMinimalNavBarWidth() {
    return this.minimalNavBarWidth;
  }

  getLanguage() {
    if (Object.keys(this.translations).includes(this.language)) {
      return this.language;
    }

    if (Object.keys(this.translations).includes(this.language.substr(0, 2))) {
      return this.language.substr(0, 2);
    }

    return this.fallbackLanguage;
  }

  getFallbackLanguage() {
    return this.fallbackLanguage;
  }

  getTranslations() {
    return this.translations;
  }

  getSupportedLanguages() {
    return this.supportedLanguages;
  }


  getManifest() {
    return this.manifest;
  }

  getDisableSharing() {
    return this.disableSharing;
  }

  getBreadcrumbsShow() {
    return this.hasBreadcrumbs.valueOf();
  }

  getDisableDownload() {
    return this.disableDownload;
  }

  getDisableLanguageSelection() {
    return this.disableLanguageSelection;
  }

  getLazyTree() {
    return this.lazyTree;
  }

  getHideUnbranchedTrees() {
    return this.hideUnbranchedTrees;
  }

  getExternalSearchUrl() {
    return this.externalSearchUrl;
  }

  isAllowedOrigin(href: string): boolean {
    const { origin } = new URL(href);

    if (this.allowedOrigins.includes('*')) {
      return true;
    }

    for (const allowedOrigin of this.allowedOrigins) {
      if (allowedOrigin.includes(origin)) {
        return true;
      }
    }

    return false;
  }

  getAllowedOrigins() {
    return this.allowedOrigins;
  }

  getID() {
    return this.id;
  }

  getHtmlViewer() {
    return this.htmlViewer;
  }

}

export default Config;
