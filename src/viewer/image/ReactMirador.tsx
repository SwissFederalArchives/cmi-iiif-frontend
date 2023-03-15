import { useState, useRef, useEffect, useContext } from 'react';
import i18next from 'i18next';
import './mirador.css';

import Mirador from 'mirador';
import * as actions from 'mirador/dist/es/src/state/actions/index.js';

import { AppContext } from '../../AppContext';
import Config from '../../lib/Config';
import miradorTranslations from '../../lib/MiradorTranslations.json';

declare let global: {
  config: Config;
};

export default function ReactMirador() {
  const id = useRef<number>(Math.floor(Math.random() * 10000)).current.toString(10);
  const [viewerInstance, setViewerInstance] = useState<any>(null);
  const { currentManifest, isMobile } = useContext(AppContext);
  const availableLanguages = global.config.getTranslations();

  /**
   * This method is executed once, when the component is mounted
   */
  useEffect(() => {
    if (isMobile !== undefined) {
      // Initializing Mirador
      let config = {
        id: `mirador-${id}`,
        createGenerateClassNameOptions: {
          // Options passed directly to createGenerateClassName in Material-UI https://material-ui.com/styles/api/#creategenerateclassname-options-class-name-generator
          productionPrefix: `mirador-${id}`,
        },
        workspace: {
          allowNewWindows: false,
          isWorkspaceAddVisible: false,
        },
        window: {
          allowFullscreen: true,
          allowClose: false,
          textOverlay: {
            enabled: !isMobile,
            visible: !isMobile,
          },
          sideBarPanel: 'search',
          sideBarOpenByDefault: !isMobile,
          panels: {
            info: true,
            attribution: false,
            canvas: false,
            annotations: false,
            search: true,
            layers: false,
          },
        },
        windows: [],
        thumbnailNavigation: {
          defaultPosition: isMobile ? 'off' : 'far-right',
        },
        translations: miradorTranslations || {},
        language: i18next.language,
        availableLanguages: false, // Workaround: Needs to be 'false' on init, otherwise restrictions won't be applied...
        theme: {
          overrides: {
              MuiListItem: {
                  root: {
                      margin: 0,
                  }
              }
          }
      }
      };

      setViewerInstance(Mirador.viewer(config));

      // Register several event listeners
      i18next.on('languageChanged', changeLanguage);
    }

    /**
     * This method is executed when the component is unmounted (=destructor)
     */
    return () => {
      setViewerInstance(null);
      i18next.off('languageChanged', changeLanguage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * This method is executed when viewerInstance has been created
   */
  useEffect(() => {
    // As soon as the viewerInstance is available, we can apply the available languages
    if (viewerInstance) {
      const { store } = viewerInstance;
      const state = store.getState();

      if (!state.config.availableLanguages) {
        viewerInstance.store.dispatch(
          actions.updateConfig({
            availableLanguages,
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewerInstance]);

  /**
   * This method is executed when viewerInstance has been created and every time when the currentManifest changes
   */
  useEffect(() => {
    // Every time the currentManifest changes, we need to update the mirador windows to display the new manifest
    if (currentManifest && viewerInstance) {
      const windows = Object.values(viewerInstance.store.getState().windows);
      const firstWindow: any = windows.length > 0 ? windows[0] : null;
      if (!firstWindow) {
        viewerInstance.store.dispatch(actions.addWindow({ manifestId: currentManifest.id }));
      } else {
        viewerInstance.store.dispatch(actions.updateWindow(firstWindow.id, { manifestId: currentManifest.id }));
      }
    }
  }, [viewerInstance, currentManifest]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * This method is executed when the component is mounted and when the window size changes
   */
  useEffect(() => {
    // As we have less space on small screens, we need to adjust the mirador configuration to hide unnecessary elements
    if (viewerInstance) {
      const { store } = viewerInstance;

      store.dispatch(
        actions.updateWindow(Object.keys(store.getState().windows)[0], {
          sideBarOpen: !isMobile,
        })
      );
      store.dispatch(
        actions.setWindowThumbnailPosition(Object.keys(store.getState().windows)[0], isMobile ? 'off' : 'far-right')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  /**
   * This method is executed as a callback when the i18next language changes
   */
  const changeLanguage = () => {
    viewerInstance.store.dispatch(
      actions.updateConfig({
        language: i18next.language,
      })
    );
  };

  // We need to return an empty div, to define the container for the mirador viewer. The container is linked by its id.
  return <div id={`mirador-${id}`} className="aiiif-mirador" />;
}
