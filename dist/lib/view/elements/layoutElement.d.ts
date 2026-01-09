import { AppController, Layout, NavigationOptions, StringMap } from '@simplity';
/**
 * Used exclusively by AppElement to manage non-page related view componnets in a layout
 *
 */
export declare class LayoutElement {
    readonly ac: AppController;
    readonly layout: Layout;
    readonly root: HTMLElement;
    private readonly menuBarEle?;
    /**
     * html elements for any context-value being rendered in the layout
     */
    private readonly contextEles;
    private currentModule;
    private currentModuleEle?;
    /**
     * module names mapped to their indexes in the modules[] array
     */
    private readonly moduleMap;
    private readonly moduleElements;
    constructor(ac: AppController, layout: Layout);
    private initColorTheme;
    private setColorTheme;
    renderModule(options: NavigationOptions): string;
    displayMenuBar(toShow: boolean): void;
    showModule(module: string): void;
    /**
     * to be called if the page was opened after retaining the earlier page
     */
    renderContextValues(values: StringMap<string>): void;
    dispose(): void;
    private getInitialModule;
    private getInitialMenu;
    private renderMenuBar;
    private reportError;
}
