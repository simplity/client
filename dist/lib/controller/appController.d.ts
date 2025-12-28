import { AppRuntime, AppController, Form, FunctionImpl, Layout, MenuItem, Page, StringMap, ValueValidationResult, Values, Vo, AppView, Module, ServiceResponse, SimpleList, KeyedList, ValueType, FunctionType, ValueSchema, NavigationOptions, Alert, Value, ValueFormatter, FormattedValue, PageController, PageView, ServiceAgent } from '@/types';
export declare class AC implements AppController {
    private readonly agent;
    private readonly appView;
    private readonly listSources;
    private readonly allForms;
    private readonly allPages;
    private readonly functionImpls;
    private readonly allLayouts;
    private readonly allModules;
    private readonly allMenuItems;
    private readonly allMessages;
    private readonly allValueSchemas;
    private readonly allFormatters;
    private readonly loginServiceName;
    private readonly logoutServiceName;
    private readonly defaultPageSize?;
    private sessionId?;
    private readonly context;
    /**
     * access control related
     */
    private validPagesArray;
    private allowAllMenus;
    /**
     * module.menuItem -> true
     */
    private allowedMenus;
    /**
     * fragile design to manage multiple requests to disable/enable UX involving async calls
     * TODO: What happens when a function throws error after disabling!!!
     */
    private disableUxCount;
    /**
     * @param runtime meta-data components for this apps
     * @param appView  This is the root html element for this app.
     */
    constructor(runtime: AppRuntime, agent: ServiceAgent, appView: AppView);
    newPc(pageView: PageView): PageController;
    newWindow(url: string): void;
    newError(msg: string): Error;
    /**
     * use has selected a menu item (outside of page buttons etc.. like from a menu)
     * @param menu
     */
    menuSelected(module: string, menuItem: string): void;
    /**
     * request coming from the controller side to navigate to another page
     * @param options
     */
    navigate(options: NavigationOptions): void;
    closePage(): void;
    selectModule(name: string): void;
    getUserChoice(text: string, choices: string[]): Promise<number>;
    setPageTitle(title: string): void;
    disableUx(): void;
    enableUx(force?: boolean): void;
    showAlerts(alerts: Alert[]): void;
    isPageValid(page: string): boolean;
    getLayout(nam: string): Layout;
    getModule(nam: string): Module;
    getMenu(module: string, menu: string): MenuItem;
    getValueSchema(nam: string): ValueSchema;
    getValueFormatter(nam: string): ValueFormatter;
    getModuleIfAccessible(nam: string): Module | undefined;
    getMenuIfAccessible(module: string, nam: string): MenuItem | undefined;
    getPage(nam: string): Page;
    getForm(nam: string): Form;
    getFn(nam: string, type?: FunctionType): FunctionImpl;
    getMessage(id: string, params?: string[], fallbackText?: string): string;
    getPermittedPages(): string[];
    setContextValue(key: string, value: unknown): void;
    removeContextValue(key: string): void;
    clearContext(): void;
    getContextValue(key: string): any;
    getUser(): Vo | undefined;
    login(credentials: Values): Promise<boolean>;
    logout(): void;
    grantAccessToAllMenus(): void;
    grantAccess(menus: StringMap<StringMap<true>>): void;
    serve(serviceName: string, data?: Vo): Promise<ServiceResponse>;
    downloadServiceResponse(fileName: string, serviceName: string, data: Vo | undefined): Promise<boolean>;
    getList(listName: string, forceRefresh: boolean, key?: number | string): Promise<SimpleList>;
    getKeyedList(listName: string, forceRefresh: boolean): Promise<KeyedList>;
    formatValue(name: string, value: Value): FormattedValue;
    private createMenuItemMap;
    private formatBoolean;
    private formatUnknown;
    private formatCustom;
    validateValue(schemaName: string, value: string): ValueValidationResult;
    validateType(valueType: ValueType, textValue: string): ValueValidationResult;
    download(blob: Blob, fileName: string): void;
    getDefaultPageSize(): number;
    /**
     * method to be called after login, if that is done by another component.
     * it is better to call login() of this service instead.
     */
    private afterLogin;
    private shouldExist;
}
