import * as React from 'react';
import Viewer from '../viewer/Viewer';
import Splitter from '../splitter/Splitter';
import { isSingleManifest, isSingleRoot } from '../lib/ManifestHelpers';
import Content3 from './Content3';
import { useContext } from 'react';
import { AppContext } from '../AppContext';
import Config from '../lib/Config';
import InfoPanel from '../infoPanel/InfoPanel';

declare let global: {
  config: Config;
};

export default function Content2() {
  const { tab, currentManifest, currentFolder, isMobile } = useContext(AppContext);

  if (!currentManifest || !currentFolder) {
    return <></>;
  }

  if (isSingleManifest(currentManifest)) {
    return <Viewer />;
  }

  if (global.config.getHideUnbranchedTrees() && isSingleRoot(currentFolder)) {
    return <Content3 />;
  }

  if (tab === '') {
    return (
      <>
        <Content3 />
      </>
    );
  }

  return (
    <>
      <Splitter
        id="content0"
        a={<Content3 />}
        b={<InfoPanel />}
        aSize={isMobile ? 60 : 80}
        frozen={isMobile}
        direction={isMobile ? 'horizontal' : 'vertical'}
      />
    </>
  );
}
