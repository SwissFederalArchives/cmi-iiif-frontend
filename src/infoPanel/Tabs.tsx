import React, { useContext } from 'react';
import Metadata from './tabs/Metadata';
import Download from './tabs/Download';
import { AppContext } from '../AppContext';
import i18next from 'i18next';
import Search from '../search/search';

export default function Tabs() {
  const { currentManifest, tab, q } = useContext(AppContext);
  if (!currentManifest || tab === '') {
    return <></>;
  }

  let content;
  let tab2 = tab;
  if (tab === 'metadata') {
    tab2 = 'metadata';
    content = <Metadata key={currentManifest.id} />;
  } else if (tab === 'download') { 
    content = <Download key={currentManifest.id} />;
  } else {
    tab2 = 'search';
    content = <Search key={q} />
  }

  return (
    <>
      <div className="aiiif-tab-container">
        <h2>
          <>{i18next.t('common:' + tab2)}</>
        </h2>
        {content}
      </div>
    </>
  );
}
