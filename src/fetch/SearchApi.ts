import Config from '../lib/Config';
import SearchUtility from '../search/util';
import { PropertyValue } from 'manifesto.js';

declare let global: {
  config: Config;
};

export interface ISearchApiFetchPayload {
  searchUrl: string;
  q: string;
  rows?: number;
  start?: number;
}

export interface ISearchApiLoadMorePayload {
  loadMoreUrl: string;
  rows?: number;
  start?: number;
}

export interface ISearchApiFetchResponse {
  '@context': string;
  id: string;
  type: string;
  ignored: string[];
  partOf: {
    id: string;
    type: string;
    total: number;
    first: {
      id: string;
      type: string;
    };
    last: {
      id: string;
      type: string;
    };
  };
  prev?: {
    id: string;
    type: string;
  };
  next?: {
    id: string;
    type: string;
  };
  items: {
    id: string;
    type: string;
    motivation: string;
    body: {
      type: string;
      value: string;
      format: string;
    };
    target: {
      id: string;
      partOf: {
        id: string;
        type: string;
        label: PropertyValue;
      };
    };
  }[];
}
export interface IUseSearchApiProps {
  searchResult: ISearchApiFetchResponse | undefined;
  setSearchResult: (result: ISearchApiFetchResponse | undefined) => void;
  setSearchLoading: (loading: boolean) => void;
  setSearchLoadingMore: (loading: boolean) => void;
  setSearchError: (error: Error | undefined) => void;
}

export const useSearchApi = (props: IUseSearchApiProps) => {
  const { searchResult, setSearchResult, setSearchLoading, setSearchError, setSearchLoadingMore } = props;

  const performSearch = (payload: ISearchApiFetchPayload) => {
    const rows = global.config.getSearchApiRows();
    const { searchUrl, ...params } = payload;
    if (!searchUrl) {
      throw new Error('No searchUrl given');
    }
    if (rows > 0) {
      params.rows = rows;
    }
    const paramsString = new URLSearchParams(params as any).toString();
    const url = `${searchUrl}?${paramsString}`;

    SearchUtility.clearCache();
    setSearchResult(undefined);
    setSearchLoading(true);
    fetch(url)
      .then((response) => {
        if (response.status !== 401 && response.status >= 400) {
          return Promise.reject(new Error('Could not perform search! URL: ' + url));
        }
        return response.json();
      })
      .then((data: ISearchApiFetchResponse) => {
        setSearchResult(data);
        setSearchError(undefined);
        setSearchLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setSearchError(new Error('Failed to load data from API. URL: ' + url));
        setSearchLoading(false);
      });
  };

  const loadMore = (payload: ISearchApiLoadMorePayload) => {
    const rows = global.config.getSearchApiRows();
    const { loadMoreUrl, ...params } = payload;
    if (!loadMoreUrl) {
      throw new Error('No loadMoreUrl given');
    }
    if (rows > 0) {
      params.rows = rows;
    }

    const paramsString = new URLSearchParams(params as any).toString();
    const url = `${loadMoreUrl}&${paramsString}`;

    setSearchLoadingMore(true);

    fetch(url)
      .then((response) => {
        if (response.status !== 401 && response.status >= 400) {
          return Promise.reject(new Error('Could not perform search! URL: ' + loadMoreUrl));
        }
        return response.json();
      })
      .then((data: ISearchApiFetchResponse) => {
        if (data && searchResult) {
          data.items = [...searchResult.items, ...data.items];
        }
        setSearchResult(data);
        setSearchLoadingMore(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const resetSearch = () => {
    setSearchResult(undefined);
    setSearchLoading(false);
    setSearchError(undefined);

    return undefined;
  };

  return { performSearch, loadMore, resetSearch };
};

export default useSearchApi;
