import React, { Suspense, useState, useEffect, useRef } from 'react';
import ManifestHistory from './lib/ManifestHistory';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import IConfigParameter from './interface/IConfigParameter';
import Config from './lib/Config';
import './css/App.css';
import Cache from './lib/Cache';
import IManifestData from './interface/IManifestData';
import PresentationApi from './fetch/PresentationApi';
import TreeBuilder from './treeView/TreeBuilder';
import ManifestData from './entity/ManifestData';
import { getLocalized, isSingleManifest } from './lib/ManifestHelpers';
import InitI18n from './lib/InitI18n';
import { AppContext } from './AppContext';
import Main from './layout/Main';
import { IAlertContent } from './Alert';
import EnvironmentConfig from './fetch/EnvironmentConfig';
import { ISearchApiFetchResponse, useSearchApi } from './fetch/SearchApi';
import { BrowserRouter } from 'react-router-dom';
import SearchUtility from './search/util';

interface IProps {
  config: IConfigParameter;
}

declare let global: {
  config: Config;
};

InitI18n();

// Defines the mobile breakpoint for the Mirador viewer
const MOBILE_BREAKPOINT = 768;

export default function App(props: IProps) {
  Cache.ee.setMaxListeners(100);
  global.config = new Config(props.config);

  const [currentManifest, setCurrentManifest] = useState<IManifestData | undefined>(undefined);
  const [currentFolder, setCurrentFolder] = useState<IManifestData | undefined>(undefined);
  const [treeDate, setTreeDate] = useState<number>(Date.now());
  const [authDate, setAuthDate] = useState<number>(0);
  let initialQ = PresentationApi.getGetParameter('q') ?? '';
  let initialTab = PresentationApi.getGetParameter('tab') ?? 'search';
  let initialViewerVisibility = PresentationApi.getGetParameter('viewer') === '0' ? false : true;
  const initialIsMobile: boolean = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
  const [isMobile, setIsMobile] = useState<boolean>(initialIsMobile);
  const [tab, setTab] = useState<string>(initialTab);
  const [q, setQ] = useState<string>(initialQ);
  const [viewerVisibility, setViewerVisibility] = useState<boolean>(initialViewerVisibility);
  const [page, setPage] = useState<number>(0);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchLoadingMore, setSearchLoadingMore] = useState<boolean>(false);
  const [searchLoadingMoreUrl, setSearchLoadingMoreUrl] = useState<string>('');
  const [searchError, setSearchError] = useState<Error | undefined>(undefined);
  const [searchResult, setSearchResult] = useState<ISearchApiFetchResponse | undefined>(undefined);
  const [currentSearchFolder, setCurrentSearchFolder] = useState<IManifestData | undefined>(undefined);
  const [searchContext, setSearchContext] = useState<'all' | 'selected'>('all');
  const [lastSearchDate, setLastSearchDate] = useState<number>(0);
  const [alert, setAlert] = useState<IAlertContent | undefined>(undefined);
  const [lastItemActivationDate, setLastItemActivationDate] = useState<number>(0);
  const [treeExpanded, setTreeExpanded] = useState<boolean>(!initialIsMobile);
  const [envConfigLoaded, setEnvConfigLoaded] = useState<boolean>(false);
  const isMobileHandler = (event: any) => setIsMobile(event.matches);

  const rootManifest = PresentationApi.getRootManifest();

  const { performSearch, loadMore, resetSearch } = useSearchApi({
    searchResult,
    setSearchResult,
    setSearchLoading,
    setSearchLoadingMore,
    setSearchError,
  });

  const setCurrentManifest0 = (id?: string): Promise<IManifestData> => {
    return new Promise((resolve, reject) => {
      if (!id) {
        id = PresentationApi.getIdFromCurrentUrl();
      }
      if (!id) {
        reject('No ID provided');
        return;
      }
      const url = id;

      PresentationApi.get(url)
        .then((currentManifest: IManifestData) => {
          ManifestHistory.pageChanged(
            currentManifest.request ?? currentManifest.id,
            getLocalized(currentManifest.label)
          );

          if (currentManifest.type === 'Collection') {
            const currentFolder = currentManifest;
            setPage(0);
            setCurrentManifest(currentManifest);
            setCurrentFolder(currentFolder);
            if (!currentManifest.restricted) {
              TreeBuilder.buildCache(currentFolder.id, () => {
                setTreeDate(Date.now());
                resolve(currentManifest);
              });
            } else {
              resolve(currentManifest);
            }
          } else if (!isSingleManifest(currentManifest)) {
            PresentationApi.get(currentManifest.parentId)
              .then((currentFolder: IManifestData) => {
                setPage(0);
                setCurrentManifest(currentManifest);
                setCurrentFolder(currentFolder);
                TreeBuilder.buildCache(currentFolder.id, () => {
                  setTreeDate(Date.now());
                  resolve(currentManifest);
                });
              })
              .catch((error) => {
                setAlert(error);
                reject(error);
              });
          } else {
            const currentFolder = new ManifestData();
            currentFolder.type = 'Manifest';
            setCurrentManifest(currentManifest);
            setCurrentFolder(currentFolder);
            resolve(currentManifest);
          }

          document.title = i18n.t('common:documentTitle');
        })
        .catch((error) => {
          setAlert(error);
          reject(error);
        });
    });
  };

  const setTab0 = (t: string) => {
    if (currentManifest) {
      ManifestHistory.pageChanged(
        currentManifest.request ?? currentManifest.id,
        getLocalized(currentManifest.label),
        undefined,
        t
      );
      setTab(t);
    }
  };

  const setQ0 = (q: string) => {
    if (currentManifest) {
      ManifestHistory.pageChanged(
        currentManifest.request ?? currentManifest.id,
        getLocalized(currentManifest.label),
        q
      );
      setQ(q);
    }
  };

  const setViewerVisibility0 = (v: boolean) => {
    if (currentManifest) {
      ManifestHistory.pageChanged(
        currentManifest.request ?? currentManifest.id,
        getLocalized(currentManifest.label),
        undefined,
        undefined,
        v ? '1' : '0'
      );
      setViewerVisibility(v);
    }
  };

  useEffect(() => {
    localStorage.setItem('allowedOrigins', JSON.stringify(global.config.getAllowedOrigins()));
    EnvironmentConfig.fetch().then(() => setEnvConfigLoaded(true));
  }, []);

  useEffect(() => {
    if (rootManifest && q && q !== '') {
      const newCurrentSearchFolder = searchContext === 'selected' ? currentFolder : rootManifest;
      if (newCurrentSearchFolder) {
        setCurrentSearchFolder(newCurrentSearchFolder);
        performSearch({ searchUrl: SearchUtility.getSearchUrl(newCurrentSearchFolder), q });
      }
    } else if (!q) {
      resetSearch();
      setCurrentSearchFolder(undefined);
    }
  }, [rootManifest?.id, lastSearchDate]);

  useEffect(() => {
    if (currentSearchFolder && searchResult && searchLoadingMoreUrl) {
      loadMore({ loadMoreUrl: searchLoadingMoreUrl });
    }
  }, [searchLoadingMoreUrl]);

  useEffect(() => {
    const tokenReceived = () => {
      setAuthDate(Date.now());
      setCurrentManifest0();
    };

    const refresh = () => {
      setCurrentManifest0();
    };

    Cache.ee.addListener('token-changed', tokenReceived);
    i18n.on('languageChanged', refresh);

    window.addEventListener('popstate', function (event) {
      const backId = ManifestHistory.goBack();
      if (backId) {
        setCurrentManifest0(backId);
      }
    });

    window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).addEventListener('change', isMobileHandler);

    setCurrentManifest0();

    return () => {
      Cache.ee.removeListener('token-changed', tokenReceived);
      window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).removeEventListener('change', isMobileHandler);
      i18n.off('languageChanged', refresh);
    };
  }, []);
  const withBookView = global?.config?.getBookViewShow();
  const appContextValue = {
    treeDate,
    tab,
    setTab: setTab0,
    page,
    setPage,
    currentManifest,
    setCurrentManifest: setCurrentManifest0,
    currentFolder,
    setCurrentFolder,
    authDate,
    setAuthDate,
    searchResult,
    setSearchResult,
    searchLoadingMoreUrl,
    setSearchLoadingMoreUrl,
    searchLoading,
    setSearchLoading,
    searchLoadingMore,
    setSearchLoadingMore,
    searchError,
    setSearchError,
    currentSearchFolder,
    setCurrentSearchFolder,
    searchContext,
    setSearchContext,
    lastSearchDate,
    setLastSearchDate,
    q,
    setQ: setQ0,
    viewerVisibility,
    setViewerVisibility: setViewerVisibility0,
    alert,
    setAlert,
    lastItemActivationDate,
    setLastItemActivationDate,
    treeExpanded,
    setTreeExpanded,
    isMobile,
    withBookView,
  };

  if (!envConfigLoaded) {
    return null;
  }

  return (
    <React.StrictMode>
      <Suspense fallback={null}>
        <BrowserRouter>
          <AppContext.Provider value={appContextValue}>
            <I18nextProvider i18n={i18n}>
              <Main />
            </I18nextProvider>
          </AppContext.Provider>
        </BrowserRouter>
      </Suspense>
    </React.StrictMode>
  );
}
