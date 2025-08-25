import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
import { getLocalized, sanitizeRulesSet } from '../../lib/ManifestHelpers';
import AppContext from '../../AppContext';

const SearchResults = () => {
  const {
    searchResult,
    searchLoadingMore,
    searchError,
    searchLoadingMoreUrl,
    setSearchLoadingMoreUrl,
    setCurrentManifest,
    setLastItemActivationDate,
    setViewerVisibility,
    q,
  } = useContext(AppContext);
  const { t } = useTranslation();
  const [showLoadMore, setShowLoadMore] = useState<boolean | undefined>(undefined);
  const loaderRef = useRef(null);

  const onClick = useCallback(
    (manifestId: string) => {
      setViewerVisibility(true);
      setCurrentManifest(manifestId).then(() => {
        setLastItemActivationDate(Date.now());
      });
    },
    [setCurrentManifest]
  );

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (searchResult && target.isIntersecting && !searchLoadingMore && searchResult?.next?.id) {
        setSearchLoadingMoreUrl(searchResult.next.id);
      }
    },
    [searchLoadingMore, showLoadMore, searchLoadingMoreUrl]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    });

    const currentElement = loaderRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.disconnect();
      }
    };
  }, [handleObserver]);

  useEffect(() => {
    if (searchResult && searchResult?.next?.id) {
      setShowLoadMore(true);
    } else {
      setShowLoadMore(false);
    }
  }, [searchResult, searchLoadingMore]);

  if (searchError) return <div className="aiiif-searchresults">{t('searchError')}</div>;
  if (!searchResult) return null;

  return (
    <div className="aiiif-searchresults">
      {searchResult.items.map((doc) => {
        const manifestId = doc.target.partOf.id;
        const queryString = `manifest=${manifestId}&q=${q}`;
        const to = `${window.location.pathname}?${queryString}`;

        return (
          <Link to={to} className="aiiif-searchresults-item" key={doc.id} onClick={(ev) => onClick(manifestId)}>
            <h2>{getLocalized(doc.target.partOf.label)}</h2>
            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(doc.body.value ?? '', sanitizeRulesSet) }} />
          </Link>
        );
      })}
      {showLoadMore && (
        <div ref={loaderRef} style={{ height: '100px', margin: '10px 0' }}>
          {t('loading')}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
