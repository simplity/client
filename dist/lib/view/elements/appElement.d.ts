import { Alert, AppController, AppInitPartameters, AppView, NavigationOptions, StringMap, Vo } from '@simplity';
import { BaseElement } from './baseElement';
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
    private readonly modalPageEle;
    private readonly modalPageContainerEle?;
    /**
     * current page is the one that has currently the focus.
     * it is not in the stack. theoretically, it could be the one on the top of the stack.
     * but keeping it on its own, and not pushing it to the stack makes certain operations easier.
     */
    private currentPage?;
    /**
     * is the current page shown as a modal?
     */
    private modalOpened;
    /**
     * keeps track of active pages that are behind the current page.
     * Current one is on the stack.
     */
    private readonly pageStack;
    /**
     *  modal container elements for rendering a modal panel.
     * this should be able to be on top of modal pages as well
     */
    private readonly modalPanelEle;
    private readonly modalPanelContainerEle?;
    private readonly modalClosePanel?;
    private poppedupEle?;
    /**
     *
     * @param runtime
     * @param appEle container element to which the app-view is to be appended to
     */
    constructor(appEle: HTMLElement, htmls?: StringMap<string>);
    /**
     * Renders the application view. Must be called once after the constructor
     * @param ac app controller
     * @param options intialization parameters
     * @param startingModule module to be rendered
     */
    render(ac: AppController, options: AppInitPartameters): void;
    navigate(options: NavigationOptions, inputData?: Vo): void;
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
    showAsPopup(panel: BaseElement, closeMode?: 'manual' | 'managed'): void;
    closePopup(): void;
    private purgeStack;
    private renderLayout;
    private closeModalPanel;
    private renderPage;
}
