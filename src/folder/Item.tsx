import * as React from 'react';
import Cache from '../lib/Cache';
import TouchDetection from '../lib/TouchDetection';
import IManifestData, { IManifestReference } from '../interface/IManifestData';
import './item.css';
import { getLocalized } from '../lib/ManifestHelpers';
import { styled } from '@mui/material/styles';
import { Tooltip, TooltipProps, tooltipClasses } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { FileIcon, FolderIcon, PdfIcon } from '../icons';

interface IProps {
  item: IManifestReference;
  selected: IManifestData;
  authDate: number;
  setCurrentManifest: (id?: string) => void;
  setViewerVisibility: (v: boolean) => void;
  setLastItemActivationDate?: (date: number) => void;
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#D3D3D3',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

const THUMB_HEIGHT = 72;
const THUMB_WIDTH = 72;
const TOOLTIP_MAGNIFICATION = 3.5;

export default function Item(props: IProps) {
  const itemType = props.item.type === 'Collection' ? 'folder' : 'file';
  const id = props.item.id;
  const isActive: boolean = id === props.selected.id;
  const { setViewerVisibility } = props;
  let className = 'aiiif-item ' + itemType;
  const label = getLocalized(props.item.label);
  if (isActive) {
    className += ' active';
  }

  function getThumbnail(props: IProps) {
    if (props.item.thumbnail === undefined || !props.item.thumbnail.hasOwnProperty('id')) {
      if (props.item.type === 'Collection') {
        return (
          <div className="aiiif-item-thumbnail">
            <FolderIcon />
          </div>
        );
      }

      return <div className="aiiif-item-thumbnail">{getFileIcon(props.item)}</div>;
    }

    let thumbnailUrl;
    let tooltipUrl;
    if (props.item.thumbnail.hasOwnProperty('service') && props.item.thumbnail.service) {
      const serviceUrl = props.item.thumbnail.service;
      thumbnailUrl =
        serviceUrl.replace('/info.json', '') + '/full/!' + THUMB_WIDTH + ',' + THUMB_HEIGHT + '/0/default.jpg';
      tooltipUrl =
        serviceUrl.replace('/info.json', '') +
        '/full/!' +
        TOOLTIP_MAGNIFICATION * THUMB_WIDTH +
        ',' +
        TOOLTIP_MAGNIFICATION * THUMB_HEIGHT +
        '/0/default.jpg';
    } else {
      thumbnailUrl = props.item.thumbnail.id;
      tooltipUrl = thumbnailUrl.replace(
        /\/full\/!(\d*),(\d*)\//,
        `/full/!${TOOLTIP_MAGNIFICATION * THUMB_WIDTH},${TOOLTIP_MAGNIFICATION * THUMB_HEIGHT}/`
      );
    }
    if (props.authDate > 0) {
      thumbnailUrl += '?t=' + props.authDate.toString();
      tooltipUrl += '?t=' + props.authDate.toString();
    }

    return (
      <HtmlTooltip
        placement="right"
        title={<div className="aiiif-item-thumbnail-tooltip" style={{ backgroundImage: 'url(' + tooltipUrl + ')' }} />}
        followCursor
        enterDelay={500}
        enterNextDelay={500}
        PopperProps={{
          popperOptions: {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 70],
                },
              },
            ],
          },
        }}
      >
        <div className="aiiif-item-thumbnail" style={{ backgroundImage: 'url(' + thumbnailUrl + ')' }} />
      </HtmlTooltip>
    );
  }

  function open(props: IProps) {
    if (props.item.type === 'Collection') {
      props.setCurrentManifest(props.item.id);
    } else {
      openFile(props);
    }
  }

  function activateItem(props: IProps) {
    props.setLastItemActivationDate && props.setLastItemActivationDate(Date.now());

    if (TouchDetection.isTouchDevice() && props.item.id === props.selected.id) {
      open(props);
    } else {
      props.setCurrentManifest(props.item.id);
    }
  }

  function openFile(props: IProps) {
    if (!props.selected.resource) {
      return;
    }

    if (props.selected.itemsType === 'audioVideo') {
      Cache.ee.emit('play-audio', props.selected.resource.id);
    } else if (props.selected.itemsType === 'file') {
      const win = window.open(props.selected.resource.id, '_target');
      if (win) {
        win.focus();
      }
    }
  }

  function getMetadataButton(props: IProps) {
    return (
      <button
        className="aiiif-item-metadata"
        type="button"
        onClick={ev => {
          ev.stopPropagation();
          setViewerVisibility(false);
          activateItem(props);
        }}
      >
        <FontAwesomeIcon className="aiiif-item-icon" size="lg" icon={isActive ? faCircleCheck : faCircle} />
      </button>
    );
  }

  function getFileIcon(item: IManifestReference) {
    let icon = <FileIcon />;
    const ext = item.id.match(/\.([^.]+)$/);
    if (ext && ext.length > 1 && ext[1] === 'pdf') {
      icon = <PdfIcon />;
    }
    return icon;
  }

  return (
    <div
      className={className}
      key={id}
      onClick={() => {
        setViewerVisibility(true);
        activateItem(props);
      }}
      onDoubleClick={() => open(props)}
    >
      <div className="aiiif-thumb-wrap">
        {itemType === 'file' && getMetadataButton(props)}
        {getThumbnail(props)}
      </div>
      <div className="aiiif-item-label">{label}</div>
    </div>
  );
}
