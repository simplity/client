import { Alert, AppController, Page, PageView, Vo } from '@simplity';
export declare class PageElement implements PageView {
    readonly ac: AppController;
    readonly page: Page;
    readonly inputs: Vo;
    private readonly titleEle?;
    private readonly pc;
    private readonly fc;
    readonly root: HTMLElement;
    constructor(ac: AppController, page: Page, inputs: Vo);
    pageLoaded(): void;
    showButtons(toShow: boolean): void;
    alert(alerts: Alert[]): void;
    dispose(): void;
}
