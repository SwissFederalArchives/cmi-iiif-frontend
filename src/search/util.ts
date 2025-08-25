import { ISearchApiFetchResponse } from 'fetch/SearchApi';
import TreeBuilder from '../treeView/TreeBuilder';
import EnvironmentConfig from '../fetch/EnvironmentConfig';
import IManifestData from '../interface/IManifestData';

export const SEARCH_ENTITY_DIRECTORY = -2;
export const SEARCH_ENTITY_FILE = -1;
export type SEARCH_ENTITY = typeof SEARCH_ENTITY_DIRECTORY | typeof SEARCH_ENTITY_FILE;

export default class SearchUtility {
  static cache: Record<string, string[]> = {};

  static clearCache() {
    this.cache = {};
  }

  static filterSearchResultsByManifestId(
    manifestId: string,
    searchResult: ISearchApiFetchResponse | undefined,
    searchEntity: SEARCH_ENTITY
  ) {
    if (!searchResult) {
      return [];
    }
    if (this.cache[manifestId]) {
      return this.cache[manifestId];
    }

    const relevantManifestId = manifestId.split('/').slice(0, -1).join('/');
    const relevantSearchResult = searchResult.items.filter((item) => {
      if (searchEntity === SEARCH_ENTITY_DIRECTORY) {
        return item.target.partOf.id.startsWith(relevantManifestId);
      }
      if (searchEntity === SEARCH_ENTITY_FILE) {
        return item.target.partOf.id.startsWith(relevantManifestId) && item.target.partOf.id !== relevantManifestId;
      }
    });
    if (relevantSearchResult.length > 0) {
      this.cache[manifestId] = relevantSearchResult.map((item) => item.target.partOf.id);
    }
    
    return relevantSearchResult;
  }

  static getManifestIdFromSearchResultId(searchResultId: string) {
    const relevantSearchResultId = searchResultId.split('/').slice(0, -1).join('/');
    return Object.keys(TreeBuilder.cache).find((key) => key.includes(relevantSearchResultId));
  }

  static getSearchUrl(manifest: IManifestData) {
    const envConfig = EnvironmentConfig.get();
    if (manifest.services?.[0]?.id) {
      return manifest.services?.[0]?.id;
    }
    // Fallback if no search service id is provided in the manifest
    const collectionId = manifest.id.split('/manifests/')[1].split('/').slice(0, -1).join('-');
    const searchUrl = `${envConfig?.SearchApiBaseUrl}${collectionId}`;
    return searchUrl;
  }
}
