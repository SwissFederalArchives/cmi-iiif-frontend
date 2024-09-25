import { useContext, useEffect, useRef } from 'react';
import SearchForm from './partials/form';
import SearchResults from './partials/results';

import './search.css';

const Search = () => {
  return (
    <div className="aiiif-search">
      <SearchForm />
      <SearchResults />
    </div>
  );
};

export default Search;
