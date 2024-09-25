import React, { useContext } from 'react';
import TabButton from './TabButton';
import { faDownload, faInfoCircle, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Config from '../lib/Config';
import { AppContext } from '../AppContext';

declare let global: {
  config: Config;
};

export default function TabButtons() {
  const { currentManifest, tab, setTab, searchResult } = useContext(AppContext);

  if (!currentManifest) {
    return <></>;
  }

  const buttons = [];

  buttons.push(
    <TabButton key="search" icon={faMagnifyingGlass} name="search" active={tab === 'search'} setTab={setTab} badge={!!searchResult} />
  );
  buttons.push(
    <TabButton key="metadata" icon={faInfoCircle} name="metadata" active={tab === 'metadata'} setTab={setTab} />
  );

  if (!global.config.getDisableDownload()) {
    buttons.push(
      <TabButton key="download" icon={faDownload} name={'download'} active={tab === 'download'} setTab={setTab} />
    );
  }

  return <div className={'aiiif-button-bar'}>{buttons}</div>;
}
