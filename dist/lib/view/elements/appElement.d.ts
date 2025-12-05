import { Alert, AppController, AppView, NavigationOptions, PanelView, StringMap, Vo } from '@/types';
export declare class AppElement implements AppView {
    ac: AppController;
    readonly root: HTMLElement;
    private currentPopup?;
    private layoutEle?;
    private readonly pageStack;
    private readonly spinnerEle?;
    private readonly messageEle?;
    private readonly messageTextEle?;
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
    download(data: Vo, fileName: string): void;
    private renderLayout;
    closePage(): void;
    navigate(options: NavigationOptions): void;
    renderContextValues(values: StringMap<string>): void;
    renderPageTitle(title: string): void;
    showAlerts(alerts: Alert[]): void;
    getUserChoice(text: string, choices: string[]): Promise<number>;
    renderAsPopup(panel: PanelView): void;
    closePopup(): void;
    doNavigate(url: string): void;
    disableUx(): void;
    enableUx(): void;
}
