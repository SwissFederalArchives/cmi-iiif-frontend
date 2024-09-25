import React, { useContext } from 'react';
import { getLocalized, sanitizeRulesSet } from '../../lib/ManifestHelpers';
import './download.css';
import { AppContext } from '../../AppContext';
import * as DOMPurify from 'dompurify';

export default function Download() {
  const { currentManifest } = useContext(AppContext);
  if (!currentManifest) {
    return <></>;
  }

  const output: JSX.Element[] = [];

  let manifestations = [];
  const rawManifestations = currentManifest.manifestations;
  const resource = currentManifest.resource;
  if (rawManifestations.length > 0) {
    manifestations = rawManifestations;
  } else if (resource && resource.manifestations) {
    manifestations = resource.manifestations;
  }

  for (const i in manifestations) {
    if (manifestations.hasOwnProperty(i)) {
      const manifestation = manifestations[i];
      output.push(
        <a key={i} href={DOMPurify.sanitize(manifestation.url, sanitizeRulesSet)} className="aiiif-download" target="_blank" rel="noopener noreferrer">
          {DOMPurify.sanitize(getLocalized(manifestation.label), sanitizeRulesSet)}
        </a>
      );
    }
  }

  if (currentManifest.seeAlso) {
    for (const i of currentManifest.seeAlso) {
      output.push(
        <a key={i.id} href={DOMPurify.sanitize(i.id, sanitizeRulesSet)} className="aiiif-download" target="_blank" rel="noopener noreferrer">
          {DOMPurify.sanitize(getLocalized(i.label), sanitizeRulesSet)}
        </a>
      );
    }
  }

  return <>{output}</>;
}
