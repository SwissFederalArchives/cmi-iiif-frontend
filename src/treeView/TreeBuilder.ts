import PresentationApi from '../fetch/PresentationApi';
import IManifestData from '../interface/IManifestData';
import Config from '../lib/Config';

interface ITreeStatus {
  [key: string]: {
    type: string;
    parent?: string;
    expanded?: boolean;
  };
}

declare let global: {
  config: Config;
};

export default class TreeBuilder {
  static cache: ITreeStatus = {};

  static async buildCache(url: string, done: () => void) {
    try {
      const manifestData: IManifestData = await PresentationApi.get(url);
      TreeBuilder.cache[manifestData.id] = {
        parent: manifestData.parentId || undefined,
        type: manifestData.type,
        expanded: true,
      };
      manifestData.manifests.map((manifest) => {
        TreeBuilder.cache[manifest.id] = {
          parent: manifestData.id,
          type: manifest.type,
        };
      });

      if (manifestData.parentId && !TreeBuilder.cache[manifestData.parentId]) {
        await TreeBuilder.buildCache(manifestData.parentId, done);
      }

      if (manifestData.collections && manifestData.collections.length > 0) {
        await Promise.all(
          manifestData.collections.map((child) => {
            if (!TreeBuilder.cache[child.id]) {
              return TreeBuilder.buildCache(child.id, done);
            }
          })
        );
      }

      if (done) {
        done();
      }
    } catch (error) {
      console.error('Failed to build cache: ', error);
    }
  }

  static isRoot(manifestId: string): boolean {
    if (!manifestId) {
      return false;
    }
    if (TreeBuilder.cache[manifestId] === undefined) {
      return false;
    }
    return TreeBuilder.cache[manifestId].parent === undefined;
  }

  static isInRootline(manifestId = '', rootlineId = ''): boolean {
    if (!manifestId) {
      return false;
    }
    if (manifestId === rootlineId) {
      return true;
    }

    if (TreeBuilder.cache[manifestId] === undefined) {
      return false;
    }

    return TreeBuilder.isInRootline(TreeBuilder.cache[manifestId].parent as string, rootlineId);
  }

  static getCollectionsByParentId(parentId: string): string[] {
    return Object.keys(TreeBuilder.cache).filter((key) => {
      return TreeBuilder.cache[key].parent === parentId && TreeBuilder.cache[key].type === 'Collection';
    });
  }
}
