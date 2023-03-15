import * as React from 'react';
import Item from './Item';
import { Translation } from 'react-i18next';
import { getLocalized } from '../lib/ManifestHelpers';
import { useContext, useState } from 'react';
import { AppContext } from '../AppContext';
import removeDiacritics from '../lib/Diacritics';

export default function FolderView() {
  const { currentManifest, setCurrentManifest, setViewerVisibility, authDate, currentFolder, setLastItemActivationDate, isMobile } = useContext(
    AppContext
  );
  const [search] = useState<string>('');

  if (!currentManifest || !currentFolder) {
    return <></>;
  }

  if (currentFolder.restricted) {
    return <div className="aiiif-folder-view-container" />;
  }

  const files = currentFolder.manifests;
  const folders = currentFolder.collections;
  const content: JSX.Element[] = [];

  if (files.length === 0 && folders.length === 0) {
    content.push(
      <div className="aiiif-empty" key="empty">
        <Translation ns="common">{t => <p>{t('emptyFolder')}</p>}</Translation>
      </div>
    );
  } else {
    const s = removeDiacritics(search);
    for (const folder of folders) {
      if (search === '' || removeDiacritics(getLocalized(folder.label)).includes(s)) {
        content.push(
          <Item
            item={folder}
            selected={currentManifest}
            key={folder.id}
            setCurrentManifest={setCurrentManifest}
            setViewerVisibility={setViewerVisibility}
            authDate={authDate}
          />
        );
      }
    }
    for (const file of files) {
      if (search === '' || removeDiacritics(getLocalized(file.label)).includes(s)) {
        content.push(
          <Item
            item={file}
            selected={currentManifest}
            key={file.id}
            setCurrentManifest={setCurrentManifest}
            setViewerVisibility={setViewerVisibility}
            setLastItemActivationDate={setLastItemActivationDate}
            authDate={authDate}
          />
        );
      }
    }
  }

  return (
    <div className="aiiif-folder-view-container">
      <div>
        <h1>{getLocalized(currentFolder.label)}</h1>
        <div className={`aiiif-folder-view aiiif-${isMobile ? 'list' : 'icon'}-view`}>{content}</div>
      </div>
    </div>
  );
}
