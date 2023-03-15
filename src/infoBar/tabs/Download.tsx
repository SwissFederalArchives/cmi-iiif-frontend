import React, { useContext } from 'react';
import { getLocalized } from '../../lib/ManifestHelpers';
import './download.css';
import { AppContext } from '../../AppContext';

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
        <a key={i} href={manifestation.url} className="aiiif-download" target="_blank" rel="noopener noreferrer">
          {getLocalized(manifestation.label)}
        </a>
      );
    }
  }

  if (currentManifest.seeAlso) {
    for (const i of currentManifest.seeAlso) {
      output.push(
        <a key={i.id} href={i.id} className="aiiif-download" target="_blank" rel="noopener noreferrer">
          {getLocalized(i.label)}
        </a>
      );
    }
  }

  return <>{output}</>;
}
