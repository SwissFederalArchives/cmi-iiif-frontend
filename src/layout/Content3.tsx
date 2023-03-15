import * as React from 'react';
import Viewer from '../viewer/Viewer';
import FolderView from '../folder/FolderView';
import { useContext } from 'react';
import { AppContext } from '../AppContext';

export default function Content3() {
  const { currentManifest } = useContext(AppContext);

  if (!currentManifest) {
    return <></>;
  }

  return (
    <>
      <Viewer />
      <FolderView />
    </>
  );
}
