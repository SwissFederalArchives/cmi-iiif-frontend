import React, { useMemo, useContext } from 'react';
import ReactMirador from './image/ReactMirador';
import PlainTextViewer from './plainText/PlainTextViewer';
import './viewer.css';
import PdfViewer from './pdf/PdfViewer';
import { AppContext } from '../AppContext';
import HtmlViewer from './html/HtmlViewer';
import ViewerModal from './ViewerModal';

export default function Viewer() {
  const { currentManifest, viewerVisibility } = useContext(AppContext);

  const viewerToRender = useMemo(() => {
    if (!currentManifest || !viewerVisibility) {
      return null;
    }

    if (currentManifest.images.length > 0) {
      return (
        <div className="aiiif-viewer">
          <ReactMirador />
        </div>
      );
    }

    if (currentManifest.itemsType === 'plain') {
      return (
        <div className="aiiif-viewer">
          <PlainTextViewer />
        </div>
      );
    }

    if (currentManifest.itemsType === 'pdf') {
      return <PdfViewer />;
    }

    if (currentManifest.itemsType === 'html') {
      return (
        <div className="aiiif-viewer">
          <HtmlViewer />
        </div>
      );
    }

    return null;
  }, [viewerVisibility, currentManifest]);

  return viewerToRender ? <ViewerModal>{viewerToRender}</ViewerModal> : null;
}
