import React, { useContext } from 'react';
import Metadata from './tabs/Metadata';
import Download from './tabs/Download';
import { AppContext } from '../AppContext';
import i18next from 'i18next';

export default function Tabs() {
  const { currentManifest, tab } = useContext(AppContext);
  if (!currentManifest || tab === '') {
    return <></>;
  }

  let content;
  let tab2 = tab;
  if (tab === 'download') {
    content = <Download />;
  } else {
    tab2 = 'metadata';
    content = <Metadata />;
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
