declare module '*.svg' {
  const content: any;
  export default content;
}
declare module 'mirador' {
  export function viewer(config: any, pluginsOrStruct?: any): any;
  export function addWindow(options: any): any;
  export function updateWindow(id: string, payload: any): any;
  export function updateConfig(config: any): any;
  export function setWindowThumbnailPosition(windowId: string, position: string): any;
  const mirador: { viewer: typeof viewer; [key: string]: any };
  export default mirador;
}
