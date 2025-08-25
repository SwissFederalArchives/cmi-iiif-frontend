import React, { useContext, useState } from 'react';
import './treeview.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { getLocalized } from '../lib/ManifestHelpers';
import PresentationApi from '../fetch/PresentationApi';
import IManifestData, { IManifestReference } from '../interface/IManifestData';
import { PropertyValue } from 'manifesto.js';
import TreeBuilder from './TreeBuilder';
import { AppContext } from '../AppContext';
import Config from '../lib/Config';
import { FolderIcon } from '../icons';
import SearchUtility, { SEARCH_ENTITY_DIRECTORY } from '../search/util';

interface IPros {
  id: string;
  children?: IManifestReference[];
  label: PropertyValue;
  level: number;
}

declare let global: {
  config: Config;
};

export default function TreeViewItem(props: IPros) {
  const { setCurrentManifest, currentFolder, setAlert, isMobile, setTreeExpanded, searchResult, currentSearchFolder } =
    useContext(AppContext);

  const [children, setChildren] = useState<IManifestReference[] | undefined>(props.children);
  const [isOpen, setIsOpen] = useState<boolean>(TreeBuilder.cache[props.id]?.expanded ?? false);

  const isSubTreeMissing = (): boolean => {
    if (!children) {
      return true;
    }
    if (global.config.getLazyTree() !== true) {
      for (const child of children) {
        if (!PresentationApi.fetchFromCache(child.id)) {
          return true;
        }
      }
    }

    return false;
  };

  const onClickItem = () => {
    setCurrentManifest(props.id);
    if (isMobile) {
      setTreeExpanded(false);
    }
  };

  const loadSubTree = () => {
    PresentationApi.get(props.id)
      .then(async (manifestData) => {
        if (global.config.getLazyTree()) {
          setChildren(manifestData.collections ?? []);
        } else {
          const children: IManifestData[] = [];
          for (const child of manifestData.collections) {
            children.push(await PresentationApi.get(child.id));
          }
          setChildren(children);
        }
        setIsOpen(true);
      })
      .catch((r) => {
        setAlert(r);
      });
  };

  const toggleCaret = () => {
    if (isOpen) {
      TreeBuilder.cache[props.id].expanded = false;
      setIsOpen(false);
    } else {
      TreeBuilder.cache[props.id].expanded = true;
      if (isSubTreeMissing()) {
        loadSubTree();
      } else {
        setIsOpen(true);
      }
    }
  };

  const style = { paddingLeft: (props.level - 1) * 22 };
  let className = 'aiiif-treeview-item level-' + props.level;
  let classNameCaret = 'aiiif-treeview-caret';
  const classNameFolderIcon = 'aiiif-treeview-folder-icon';
  let caret = <></>;
  const iconStyle = {
    color: '#333333',
    fontSize: 14,
  };

  const isRoot = TreeBuilder.isRoot(props.id);
  const isInSearchRootline = TreeBuilder.isInRootline(props.id, currentSearchFolder?.id);
  const childCollections = TreeBuilder.getCollectionsByParentId(props.id);
  const numSearchResults = SearchUtility.filterSearchResultsByManifestId(
    props.id,
    searchResult,
    SEARCH_ENTITY_DIRECTORY
  ).length;

  const numChildCollectionsSearchResults = childCollections.reduce((acc, child) => {
    return acc + SearchUtility.filterSearchResultsByManifestId(child, searchResult, SEARCH_ENTITY_DIRECTORY).length;
  }, 0);

  if (children?.length === 0) {
    classNameCaret += ' aiiif-no-caret';
  } else {
    caret = (
      <FontAwesomeIcon
        className={isOpen ? 'aiiif-caret-open' : 'aiiif-caret-closed'}
        icon={isOpen ? faCaretDown : faCaretRight}
        style={iconStyle}
      />
    );
  }
  if (currentFolder && props.id === currentFolder.id) {
    className += ' aiiif-current';
  }
  if (
    (numSearchResults > 0 ||
      numChildCollectionsSearchResults > 0 ||
      (isRoot && Number(searchResult?.items?.length) > 0)) &&
    isInSearchRootline
  ) {
    className += ' aiiif-has-search-results';
  }
  const label = getLocalized(props.label);
  const childrenElements: JSX.Element[] = [];

  if (isOpen && children) {
    const childrenLevel = props.level + 1;

    for (const child of children) {
      const c = PresentationApi.fetchFromCache(child.id);
      if (c === false) {
        childrenElements.push(
          <TreeViewItem level={childrenLevel} key={Math.random()} id={child.id} label={child.label} />
        );
      } else {
        childrenElements.push(
          <TreeViewItem
            level={childrenLevel}
            key={Math.random()}
            id={c.id}
            label={c.label}
            children={c.collections ?? []}
          />
        );
      }
    }
  }

  return (
    <div>
      <div className={className} style={style}>
        <div className={classNameCaret} onClick={() => toggleCaret()}>
          {caret}
        </div>
        <div className={classNameFolderIcon}>
          <FolderIcon />
        </div>
        <div className="aiiif-treeview-label" onClick={onClickItem}>
          {label}
        </div>
      </div>
      {childrenElements}
    </div>
  );
}
