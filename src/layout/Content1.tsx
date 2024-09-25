import * as React from 'react';
import Splitter from '../splitter/Splitter';
import Content2 from './Content2';
import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { isSingleManifest, isSingleRoot } from '../lib/ManifestHelpers';
import TreeView from '../treeView/TreeView';
import Content3 from './Content3';
import Config from '../lib/Config';
import InfoPanel from '../infoPanel/InfoPanel';

declare let global: {
  config: Config;
};

export default function Content1() {
  const { currentManifest, tab, currentFolder, treeExpanded, isMobile } = useContext(AppContext);

  if (!currentManifest || !currentFolder) {
    return <></>;
  }

  if (isSingleManifest(currentManifest) || (global.config.getHideUnbranchedTrees() && isSingleRoot(currentFolder))) {
    if (tab === '') {
      return (
        <>
          <div className="aiiif-infobar">
            <Content3 />
          </div>
        </>
      );
    }

    return (
      <Splitter
        id="main"
        a={
          <div className="aiiif-navigation">
            <div className="aiiif-infobar">
              <InfoPanel key={currentManifest.id} />
            </div>
          </div>
        }
        b={<Content2 />}
        direction="vertical"
      />
    );
  }

  return (
    <Splitter
      id="main"
      a={
        <div className="aiiif-navigation">
          <TreeView />
        </div>
      }
      b={<Content2 />}
      frozen={!treeExpanded || isMobile}
      aClass={treeExpanded ? 'aiiif-tree-expanded' : 'aiiif-tree-collapsed'}
      direction="vertical"
    />
  );
}
