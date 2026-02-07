import { AppDesign } from '@simplity';
export type DevFolders = {
    json: string;
    ts: string;
    types: string;
};
export interface ProcessingError {
    type: 'error' | 'warning';
    componentType: 'alteration' | 'directLink' | 'function' | 'layout' | 'module' | 'page' | 'record' | 'service' | 'sql' | 'template' | 'valueFormatter' | 'valueSchema' | 'valueList' | 'other';
    componentName: string;
    message: string;
}
export declare function processComponents(appDesign: AppDesign, jsonFolder: string, tsFolder: string): void;
