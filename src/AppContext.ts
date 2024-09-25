import React from 'react';
import IManifestData from './interface/IManifestData';
import { IAlertContent } from './Alert';
import Config from './lib/Config';
import { ISearchApiFetchResponse } from 'fetch/SearchApi';
declare let global: {
  config: Config;
};
interface IContext {
  treeDate: number;
  tab: string;
  setTab: (tab: string) => void;
  page: number;
  setPage: (currentPage: number) => void;
  currentManifest: IManifestData | undefined;
  setCurrentManifest: (id?: string) => Promise<IManifestData>;
  currentFolder: IManifestData | undefined;
  setCurrentFolder: (manifest: IManifestData | undefined) => void;
  authDate: number;
  setAuthDate: (authDate: number) => void;
  searchResult: ISearchApiFetchResponse | undefined;
  setSearchResult: (searchResult: ISearchApiFetchResponse | undefined) => void;
  searchLoadingMoreUrl: string;
  setSearchLoadingMoreUrl: (url: string) => void;
  searchLoading: boolean;
  setSearchLoading: (loading: boolean) => void;
  searchLoadingMore: boolean;
  setSearchLoadingMore: (loading: boolean) => void;
  searchError: Error | undefined;
  setSearchError: (error: Error | undefined) => void;
  currentSearchFolder: IManifestData | undefined;
  setCurrentSearchFolder: (manifest: IManifestData | undefined) => void;
  searchContext: 'all' | 'selected';
  setSearchContext: (context: 'all' | 'selected') => void;
  lastSearchDate: number;
  setLastSearchDate: (date: number) => void;
  q: string;
  setQ: (q: string) => void;
  viewerVisibility: boolean;
  setViewerVisibility: (v: boolean) => void;
  alert: IAlertContent | undefined;
  setAlert: (content: IAlertContent | undefined) => void;
  lastItemActivationDate: number;
  setLastItemActivationDate: (authDate: number) => void;
  treeExpanded: boolean;
  setTreeExpanded: (expanded: boolean) => void;
  isMobile: boolean;
  withBookView: boolean;
}

export const AppContext = React.createContext<IContext>({
  treeDate: 0,
  tab: '',
  setTab: () => {},
  page: 0,
  setPage: () => {},
  currentManifest: undefined,
  setCurrentManifest: () => Promise.resolve({} as IManifestData),
  currentFolder: undefined,
  setCurrentFolder: () => {},
  authDate: 0,
  setAuthDate: () => {},
  searchResult: undefined,
  setSearchResult: () => {},
  searchLoadingMoreUrl: '',
  setSearchLoadingMoreUrl: () => {},
  searchLoading: false,
  setSearchLoading: () => {},
  searchLoadingMore: false,
  setSearchLoadingMore: () => {},
  searchError: undefined,
  setSearchError: () => {},
  currentSearchFolder: undefined,
  setCurrentSearchFolder: () => {},
  searchContext: 'all',
  lastSearchDate: 0,
  setLastSearchDate: () => {},
  setSearchContext: () => {},
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
  withBookView: global?.config?.getBookViewShow(),
});

export default AppContext;
