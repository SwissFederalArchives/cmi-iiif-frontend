import React, { useContext, useEffect } from 'react';
import './InfoPanel.css';
import Tabs from './Tabs';
import { AppContext } from '../AppContext';
import TabButtons from './TabButtons';

export default function InfoPanel() {
  const { page, setPage, currentManifest, tab, setTab, viewerVisibility, lastItemActivationDate, q } = useContext(AppContext);
  useEffect(() => {
    document.addEventListener('keydown', keyDown, false);
    return () => {
      document.removeEventListener('keydown', keyDown, false);
    };
  });

  useEffect(() => {
    if (viewerVisibility && tab !== 'search' && q !== '') {
      setTab('search');
    } else if (!viewerVisibility && tab === 'search') {
      setTab('metadata');
    }
  }, [lastItemActivationDate]);

  if (!currentManifest) {
    return <></>;
  }

  const keyDown = function (event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' && page > 0) {
      setPage(page - 1);
      return;
    }

    if (event.key === 'ArrowRight' && page + 1 < currentManifest?.images.length) {
      setPage(page + 1);
      return;
    }

    if (currentManifest.search && (event.ctrlKey || event.metaKey) && event.key === 'f') {
      event.preventDefault();
      setTab('search');
      return;
    }
  };

  return (
    <div className="aiiif-infobar">
      <Tabs />
      <TabButtons />
    </div>
  );
}
