import { AppDesign } from '@simplity';
export type DevFolders = {
    json: string;
    ts: string;
    types: string;
};
export declare function processComponents(appDesign: AppDesign, jsonFolder: string, tsFolder: string): void;
