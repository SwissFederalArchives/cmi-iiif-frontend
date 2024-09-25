import { useContext, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppContext from '../../AppContext';
import PresentationApi from '../../fetch/PresentationApi';

const SearchForm = () => {
  const {
    q,
    setQ,
    searchResult,
    searchError,
    searchLoading,
    currentFolder,
    setCurrentSearchFolder,
    searchContext,
    setSearchContext,
    setLastSearchDate,
  } = useContext(AppContext);
  const id = useId();
  const { t } = useTranslation();
  const rootManifest = PresentationApi.getRootManifest();
  const [inputValue, setInputValue] = useState(q);

  const handleFormSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (searchContext === 'selected') {
      setCurrentSearchFolder(currentFolder);
    } else {
      setCurrentSearchFolder(rootManifest);
    }
    setQ(inputValue);
    setLastSearchDate(Date.now());
  };

  const handleFormReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputValue('');
    setQ('');
    setLastSearchDate(Date.now());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleContextChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchContext(e.target.value as 'all' | 'selected');
    handleFormSubmit();
  };

  return (
    <div className="aiiif-search-form">
      <form
        className="form-horizontal form-search"
        style={{ width: '100%' }}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
      >
        <h2 className="sr-only">{t('search')}</h2>
        <label htmlFor={`search-input_${id}`} className="sr-only">
          {t('search')}:
        </label>
        <input
          id={`search-input_${id}`}
          className={`form-control search-input${searchError ? ' is-invalid' : ''}`}
          name="q"
          type="text"
          placeholder={t('searchInputLabel')}
          style={{ width: '100%' }}
          value={inputValue}
          disabled={searchLoading}
          onChange={handleInputChange}
        />
        <button className="icon icon--search icon--after search-submit" role="button" type="submit" aria-label={t('search')}>
          <span className="sr-only">{t('search')}</span>
        </button>
        <div className="search-context">
          <label htmlFor={`search-context_${id}`}>{t('searchContext')}</label>
          <select
            name="context"
            id={`search-context_${id}`}
            className="form-control"
            disabled={searchLoading}
            value={searchContext}
            onChange={handleContextChange}
          >
            <option value="all">{t('searchContextAll')}</option>
            <option value="selected">{t('searchContextSelected')}</option>
          </select>
        </div>
        {searchResult && (
          <div className="aiiif-search-form-info">
            {t(searchResult.items.length ? 'searchNumFound' : 'searchNotFound', {
              n: searchResult.items.length,
              total: searchResult.partOf.total,
            })}
            <button type="reset">{t('searchReset')}</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchForm;
