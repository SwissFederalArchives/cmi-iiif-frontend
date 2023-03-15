import React, { useContext, useEffect } from 'react';
import TreeViewItem from './TreeViewItem';
import './treeview.css';
import PresentationApi from "../fetch/PresentationApi";
import { AppContext } from "../AppContext";
import ViewerSpinner from "../viewer/ViewerSpinner";
import NavBarIcon from '@mui/icons-material/VerticalSplit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { t }  from 'i18next';

export default function TreeView() {

    const { treeDate, treeExpanded, setTreeExpanded } = useContext(AppContext);
    const rootId = PresentationApi.getRootId();

    // reload if tree was loaded
    useEffect(() => { }, [treeDate])

    if (!rootId) {
        return <div className="aiiif-treeview">
            <ViewerSpinner show={true} center={false} />
        </div>;
    }

    const rootManifest = PresentationApi.fetchFromCache(rootId);
    if (!rootManifest) {
        return <></>;
    }

    return (
        <>
          <button className={`aiiif-treeview-trigger ${treeExpanded ? 'is-expanded' : ''}`} type="button" onClick={() => setTreeExpanded(!treeExpanded)}>
            <FontAwesomeIcon icon={faAngleLeft} />
            <span className="aiiif-treeview-trigger-text" ><>{t('closeTree')}</></span>
            <span className="aiiif-treeview-trigger-icon" title={treeExpanded ? t('closeTree') : t('openTree')}><NavBarIcon /></span>
          </button>

            <div className="aiiif-treeview">
                <TreeViewItem
                    key={Math.random()}
                    id={rootManifest.id}
                    label={rootManifest.label}
                    children={rootManifest.collections ?? []}
                    level={1}
                />
            </div>
        </>
    );
}
