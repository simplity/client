import { Alert, AppController, Page, PageView, Values } from 'src/lib/types';
export declare class PageElement implements PageView {
    readonly ac: AppController;
    readonly page: Page;
    readonly inputs: Values;
    private readonly titleEle?;
    private readonly pc;
    private readonly fc;
    readonly root: HTMLElement;
    constructor(ac: AppController, page: Page, inputs: Values);
    pageLoaded(): void;
    showButtons(toShow: boolean): void;
    alert(alerts: Alert[]): void;
    dispose(): void;
}
