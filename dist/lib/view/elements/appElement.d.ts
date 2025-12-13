import { Alert, AppController, AppView, NavigationOptions, StringMap, Vo } from '@/types';
export declare class AppElement implements AppView {
    ac: AppController;
    /**
     * app-root element that hosts the application
     */
    readonly root: HTMLElement;
    private pageEle;
    /**
     * pointer to the current layout view
     */
    private layoutEle;
    /**
     * html fragments that are to be rendered on a need basis.
     * these are appended to the document body in hidden state
     */
    private readonly spinnerEle?;
    private spinnerTextEle?;
    private readonly messageEle?;
    private readonly messageTextEle?;
    private readonly modalEle?;
    private readonly modalPageEle?;
    /**
     * keeps track of active pages. Current one is on the top.
     */
    private readonly pageStack;
    /**
     * is the last opened page modal?
     */
    private modalOpened;
    /**
     *
     * @param runtime
     * @param appEle container element to which the app-view is to be appended to
     */
    constructor(appEle: HTMLElement, htmls?: StringMap<string>);
    /**
     * Renders the application view. Must be called once after the constructor
     * @param ac app controller
     * @param startinglayout layout to be rendered
     * @param startingModule module to be rendered
     */
    render(ac: AppController, startinglayout: string, startingModule: string): void;
    navigate(options: NavigationOptions): void;
    closePage(): void;
    renderContextValues(values: StringMap<string>): void;
    renderPageTitle(title: string): void;
    hideAlerts(): void;
    showAlerts(alerts: Alert[]): void;
    getUserChoice(text: string, choices: string[]): Promise<number>;
    navigateOut(url: string): void;
    disableUx(displayText?: string): void;
    enableUx(): void;
    download(data: Vo, fileName: string): void;
    private purgeStack;
    private renderLayout;
    private renderPage;
}
