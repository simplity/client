import {
  AppRuntime,
  AppController,
  Form,
  FunctionImpl,
  Layout,
  ListSource,
  MenuItem,
  Page,
  StringMap,
  FieldValidationFn,
  ValueValidationResult,
  Values,
  Vo,
  AppView,
  Module,
  ServiceResponse,
  SimpleList,
  KeyedList,
  ValueType,
  FunctionType,
  ValueSchema,
  NavigationOptions,
  Alert,
  Value,
  ValueFormatter,
  FormatterFunction,
  FormattedValue,
  BooleanFormatter,
  CustomFormatter,
  PageController,
  PageView,
  ServiceAgent,
} from 'src/lib/types';
import { utils } from './utils';
import { parseValue, validateValue } from './validation';
import { logger } from '../logger';
import { conventions } from '../conventions';
import { PC } from './pageController';
import { internalFunctions } from '../function';
import { internalResources } from '../../internalResources';
import { elementFactory } from '..';

const USER = '_user';
const REGEXP = /\$(\{\d+\})/g;

/**
 * this is used to simulate Session storage in non-browser environment
 */
let simulatedStorage: StringMap<string> = {};
const simulatedSession: Session = {
  setItem: (name, item) => {
    simulatedStorage[name] = item;
  },
  getItem: (name: string) => {
    const item = simulatedStorage[name];
    if (item === undefined) {
      return null;
    }
    return item;
  },
  removeItem: (name: string) => {
    delete simulatedStorage[name];
  },
  clear: () => {
    simulatedStorage = {};
  },
};

export class AC implements AppController {
  // app components
  private readonly listSources: StringMap<ListSource>;
  private readonly allForms: StringMap<Form>;
  private readonly allPages: StringMap<Page>;
  private readonly functionImpls: StringMap<FunctionImpl>;
  private readonly allLayouts: StringMap<Layout>;
  private readonly allModules: StringMap<Module>;
  private readonly allMenuItems: StringMap<StringMap<MenuItem>>;
  private readonly allMessages: StringMap<string>;
  private readonly allValueSchemas: StringMap<ValueSchema>;
  private readonly allFormatters: StringMap<ValueFormatter>;

  // app level parameters
  private readonly loginServiceName;
  private readonly logoutServiceName;
  private readonly defaultPageSize?: number;
  /*
   * context for the logged-in user
   */
  private sessionId?: string;
  private readonly context: Session;

  /**
   * access control related
   */
  private validPagesArray: string[] = [];
  private allowAllMenus: boolean = false;
  /**
   * module.menuItem -> true
   */
  private allowedMenus: StringMap<StringMap<true>> = {};

  /**
   * fragile design to manage multiple requests to disable/enable UX involving async calls
   * TODO: What happens when a function throws error after disabling!!!
   */
  private disableUxCount = 0;

  /**
   * @param runtime meta-data components for this apps
   * @param appView  This is the root html element for this app.
   */
  public constructor(
    runtime: AppRuntime,
    private readonly agent: ServiceAgent,
    private readonly appView: AppView
  ) {
    //issue in node environment. sessionStorage is just a boolean!!!
    if (
      globalThis.sessionStorage &&
      (globalThis.sessionStorage as Session).getItem
    ) {
      this.context = globalThis.sessionStorage;
    } else {
      this.context = simulatedSession;
    }

    this.loginServiceName = runtime.loginServiceName || '';
    this.logoutServiceName = runtime.logoutServiceName || '';

    let fns = internalFunctions;
    if (runtime.functionImpls) {
      fns = { ...fns, ...runtime.functionImpls };
    }
    this.functionImpls = fns;

    this.allMessages = {
      ...internalResources.messages,
      ...(runtime.messages || {}),
    };
    this.listSources = runtime.listSources || {};
    this.allPages = runtime.pages || {};
    this.allForms = runtime.forms || {};

    this.allLayouts = runtime.layouts || {};
    this.allModules = runtime.modules || {};
    this.allMenuItems = this.createMenuItemMap(this.allModules);

    //prepare valid pages array
    this.allValueSchemas = {
      ...internalResources.valueSchemas,
      ...(runtime.valueSchemas || {}),
    };
    this.allFormatters = runtime.valueFormatters || {};

    this.defaultPageSize = runtime.defaultPageSize;
    if (runtime.viewComponentFactory) {
      elementFactory.setCustomFactory(runtime.viewComponentFactory);
    }
  }
  newPc(pageView: PageView): PageController {
    return new PC(this, pageView);
  }

  newWindow(url: string): void {
    logger.info(
      `Request to open a window for url:${url} received. This feature is not yet implemented`
    );
  }

  newError(msg: string): Error {
    logger.error(msg);
    return new Error(msg);
  }

  /**
   * user has selected a menu item (outside of page buttons etc.. like from a menu)
   * @param menu
   */
  menuSelected(module: string, menuItem: string): void {
    //TODO: check with pc before demolition!!
    const options: NavigationOptions = {
      module,
      menuItem,
      erasePagesOnTheStack: true,
    };

    this.navigate(options);
  }

  /**
   * request coming from the controller side to navigate to another page
   * @param options
   */
  navigate(options: NavigationOptions): void {
    this.appView.navigate(options);
  }

  closePage(): void {
    this.appView.closePage();
  }

  selectModule(name: string): void {
    this.appView.navigate({
      module: name,
    });
  }

  getUserChoice(text: string, choices: string[]) {
    return this.appView.getUserChoice(text, choices);
  }

  setPageTitle(title: string): void {
    this.appView.renderPageTitle(title);
  }

  disableUx(): void {
    if (this.disableUxCount === 0) {
      this.appView.disableUx();
    }
    this.disableUxCount++;
    console.info(`disableCount upped to ${this.disableUxCount}`);
  }

  enableUx(force?: boolean): void {
    console.info(`Request for enable when count is at ${this.disableUxCount}`);
    if (force) {
      console.info(`Enabling with force`);
      this.disableUxCount = 0;
      this.appView.enableUx();
      return;
    }

    this.disableUxCount--;
    if (this.disableUxCount === 0) {
      this.appView.enableUx();
      return;
    }
    if (this.disableUxCount < 0) {
      logger.error(
        `Request to enable the UX when it is already enabled. Possible internal error, or exception in some path`
      );
      this.disableUxCount = 0;
    }
  }

  showAlerts(alerts: Alert[]): void {
    this.appView.showAlerts(alerts);
  }

  isPageValid(page: string): boolean {
    logger.warn(
      `isPageValid() not yet implemented. Returning false for page ${page}.`
    );
    return false;
  }

  // getters for app components
  getLayout(nam: string): Layout {
    const obj = this.allLayouts[nam];
    this.shouldExist(obj, nam, 'layout');
    return obj;
  }

  getModule(nam: string): Module {
    const obj = this.allModules[nam];
    this.shouldExist(obj, nam, 'module');
    return obj;
  }

  getMenu(module: string, menu: string): MenuItem {
    const moduleObj = this.allMenuItems[module];
    this.shouldExist(moduleObj, module, 'module');
    const obj = moduleObj[menu];
    this.shouldExist(obj, menu, 'menu item');
    return obj;
  }

  getValueSchema(nam: string): ValueSchema {
    const obj = this.allValueSchemas[nam];
    this.shouldExist(obj, nam, 'Value Schema');
    return obj;
  }

  getValueFormatter(nam: string): ValueFormatter {
    const obj = this.allFormatters[nam];
    this.shouldExist(obj, nam, 'Value Schema');
    return obj;
  }

  getModuleIfAccessible(nam: string): Module | undefined {
    const module = this.getModule(nam);
    if (!module) {
      return undefined;
    }

    const hasAccess = this.allowAllMenus || this.allowedMenus[nam];
    if (hasAccess) {
      return module;
    }

    for (const menu of Object.values(module.menuItems)) {
      if (menu.guestAccess) {
        return module;
      }
    }
    logger.info(`logged in user has no access to the module '${nam}'`);
    return undefined;
  }

  getMenuIfAccessible(module: string, nam: string): MenuItem | undefined {
    const menu = this.getMenu(module, nam);
    const hasAccess =
      menu.guestAccess || this.allowAllMenus || this.allowedMenus[nam];
    if (hasAccess) {
      return menu;
    }

    logger.info(`user  has no access to menu ${nam}`);
    return undefined;
  }

  getPage(nam: string): Page {
    const obj = this.allPages[nam];
    this.shouldExist(obj, nam, 'page');
    return obj;
  }

  getForm(nam: string): Form {
    const obj = this.allForms[nam];
    this.shouldExist(obj, nam, 'form');
    return obj;
  }

  getFn(nam: string, type?: FunctionType): FunctionImpl {
    const obj = this.functionImpls[nam];
    this.shouldExist(obj, nam, 'function');
    if (type && obj.type !== type) {
      const msg = `${nam} is defined as a function of type "${obj.type}" but is being requested for type "${type}"`;
      logger.error(msg);
      throw new Error(msg);
    }
    return obj;
  }

  getMessage(id: string, params?: string[], fallbackText?: string): string {
    const msg = this.allMessages[id];
    if (msg === undefined) {
      return fallbackText || id || '';
    }
    const p = params || [];
    return msg.replace(REGEXP, (match, id: string) => {
      const txt = id.substring(1, id.length - 1);
      const idx = Number.parseInt(txt, 10);
      const ret = p[idx - 1];
      return ret === undefined ? match : ret;
    });
  }

  //context related functions
  getPermittedPages(): string[] {
    return this.validPagesArray;
  }

  setContextValue(key: string, value: unknown): void {
    if (value === undefined) {
      this.removeContextValue(key);
      return;
    }
    this.context.setItem(key, JSON.stringify(value));
  }

  removeContextValue(key: string): void {
    this.context.removeItem(key);
  }

  clearContext(): void {
    this.context.clear();
  }

  getContextValue(key: string) {
    const s = this.context.getItem(key);
    if (s === null || s === undefined) {
      return undefined;
    }
    try {
      return JSON.parse(s + '');
      /*
       * defensive code.
       *  setItem() is using JSON.stringify() hence we should never have exception.
       */
    } catch {
      return s;
    }
  }

  getUser(): Vo | undefined {
    return this.getContextValue(USER) as Vo;
  }

  async login(credentials: Values): Promise<boolean> {
    if (!this.loginServiceName) {
      logger.error(
        'loginServiceName is not set for this app, but a request is made for the same'
      );
      return false;
    }

    //remove existing user first
    this.removeContextValue(USER);
    this.grantAccess({});

    const data = await this.serve(this.loginServiceName, credentials);
    this.afterLogin(data);
    return !!data;
  }

  logout(): void {
    this.removeContextValue(USER);
    this.grantAccess({});
    this.serve(this.logoutServiceName).then();
  }

  grantAccessToAllMenus(): void {
    this.allowAllMenus = true;
  }

  grantAccess(menus: StringMap<StringMap<true>>): void {
    this.allowedMenus = menus;
    this.allowAllMenus = false;
  }

  //server-related
  async serve(serviceName: string, data?: Vo): Promise<ServiceResponse> {
    const resp = await this.agent.serve(serviceName, this.sessionId, data);
    if (resp.status === 'noSuchSession') {
      // TODO: handle server session timeout.
      logger.warn(
        'Server has reported that the current session is not valid anymore.'
      );
      this.sessionId = undefined;
      return resp;
    }
    if (resp.status === 'completed') {
      if (resp.sessionId) {
        this.sessionId = resp.sessionId;
        delete resp.sessionId;
      }

      if (serviceName === this.loginServiceName) {
        console.info('Detected call to login service');
        this.afterLogin(resp.data);
      }
    } else {
      const msgs = resp.messages;
      if (msgs && msgs.length) {
        //error message is sent by the server
      } else {
        resp.messages = [
          { id: resp.status, type: 'error', text: resp.description },
        ];
      }
    }

    return resp;
  }

  async downloadServiceResponse(
    fileName: string,
    serviceName: string,
    data: Vo | undefined
  ): Promise<boolean> {
    const response = await this.agent.serve(serviceName, this.sessionId, data);
    if (response.status !== 'completed') {
      if (response.messages) {
        const msg = response.messages[0];
        logger.error(this.getMessage(msg.id, msg.params, msg.text));
      } else {
        logger.error(`Service ${serviceName} failed`);
      }
      return false;
    }

    data = response.data;
    if (!data) {
      logger.warn(
        `service ${serviceName} succeeded, but did not return any data. file ${fileName} would be empty`
      );
      data = {};
    }

    utils.download(data as Vo, fileName);
    return true;
  }

  async getList(
    listName: string,
    forceRefresh: boolean,
    key?: number | string
  ): Promise<SimpleList> {
    const hasKey = key !== undefined;
    let entry = this.listSources[listName];
    if (!entry) {
      entry = {
        name: listName,
        okToCache: false,
        isKeyed: hasKey,
        isRuntime: true,
      };
      this.listSources[listName] = entry;
    }

    if (entry.isKeyed) {
      //keyed list
      if (!hasKey) {
        logger.error(
          `List ${listName} requires a key field, but no key is specified for this field. empty options returned.`
        );
        return [];
      }

      if (entry.isRuntime) {
        if (entry.keyedList && !forceRefresh) {
          return entry.keyedList[key];
        }
      } else {
        const list = entry.keyedList ? entry.keyedList[key] : undefined;
        if (list) {
          return list;
        }

        logger.error(
          `List ${listName} is a design-time list, but no ready value-list is found`
        );
        return [];
      }
    } else {
      //simple list
      if (entry.isRuntime) {
        if (entry.list && !forceRefresh) {
          return entry.list;
        }
      } else {
        if (entry.list) {
          return entry.list;
        }
        logger.error(
          `List ${listName} is a design-time list, but no ready value-list is found`
        );
        return [];
      }
    }

    const serviceName = conventions.listServiceName;
    const data: Vo = key ? { list: listName, key } : { list: listName };
    //request the server
    const resp = await this.serve(serviceName, data);
    const list = resp.data?.list as SimpleList;

    if (!list) {
      if (resp.status !== 'completed') {
        logger.error(
          `Error while fetching list ${listName}: ${resp.description}\n empty list assumed`
        );
      }
      return [];
    }

    if (entry.okToCache) {
      if (entry.isKeyed) {
        if (!entry.keyedList) {
          entry.keyedList = {};
        }
        entry.keyedList![key!] = list;
      } else {
        entry.list = list;
      }
    }

    return list;
  }

  async getKeyedList(
    listName: string,
    forceRefresh: boolean
  ): Promise<KeyedList> {
    let entry = this.listSources[listName];
    if (!entry) {
      entry = {
        name: listName,
        okToCache: false,
        isKeyed: true,
        isRuntime: true,
      };
      this.listSources[listName] = entry;
    }

    if (!entry.isKeyed) {
      logger.error(
        `List ${listName} is a simple list, but a keyed list is requested for the same. empty object is returned`
      );
      return {};
    }

    if (forceRefresh === false && entry.keyedList) {
      return entry.keyedList;
    }

    const serviceName = conventions.listServiceName;
    const resp = await this.serve(serviceName, { listName });
    const list = resp.data?.list as KeyedList;

    if (!list) {
      if (resp.status !== 'completed') {
        logger.error(
          `Error while fetching list ${listName}: ${resp.description}\n empty list assumed`
        );
      }
      return {};
    }

    if (entry.okToCache) {
      entry.keyedList = list;
    }
    return list;
  }

  formatValue(name: string, value: Value): FormattedValue {
    const formatter = this.allFormatters[name];
    if (!formatter) {
      logger.error(`${name} is not a valid formatter. Value not formatted`);
      return { value: value === undefined ? '' : '' + value };
    }

    switch (formatter.type) {
      case 'boolean':
        return this.formatBoolean(value, formatter as BooleanFormatter);
      case 'custom':
        return this.formatCustom(value, formatter as CustomFormatter);
      default:
        return this.formatUnknown(value, formatter);
    }
  }

  private createMenuItemMap(
    modules: StringMap<Module>
  ): StringMap<StringMap<MenuItem>> {
    const menuItemMap: StringMap<StringMap<MenuItem>> = {};
    for (const [moduleName, module] of Object.entries(modules)) {
      const moduleMenuMap: StringMap<MenuItem> = {};
      for (const menuItem of Object.values(module.menuItems)) {
        moduleMenuMap[menuItem.name] = menuItem;
      }
      menuItemMap[moduleName] = moduleMenuMap;
    }
    return menuItemMap;
  }

  private formatBoolean(v: Value, formatter: BooleanFormatter): FormattedValue {
    let value = formatter.unknownValue;
    if (v !== undefined) {
      value = v ? formatter.trueValue : formatter.falseValue;
    }
    return { value };
  }

  private formatUnknown(v: Value, formatter: ValueFormatter): FormattedValue {
    console.error(
      `Formatting functionality not yet implemented for type=${formatter.type}. Hence formatter is just returning the input value as it is`
    );
    return { value: v.toString() };
  }

  private formatCustom(v: Value, formatter: CustomFormatter): FormattedValue {
    const fd = this.functionImpls[formatter.function];
    if (!fd) {
      console.error(
        `Custom formatter function ${formatter.function} not found`
      );
      return { value: v.toString() };
    }
    if (fd.type !== 'format') {
      console.error(
        `Function ${formatter.function} is is used as 'format' but it is of type '${fd.type}'. Hence the value is not formatted`
      );
      return { value: v.toString() };
    }
    return (fd.fn as FormatterFunction)(v);
  }

  validateValue(schemaName: string, value: string): ValueValidationResult {
    const schema = this.allValueSchemas[schemaName];
    if (!schema) {
      return {
        messages: [
          {
            messageId: conventions.messageIds.schemaIsMissing,
            alertType: 'error',
            params: [schemaName],
          },
        ],
      };
    }
    const result = validateValue(schema, value);
    if (result.messages || !schema.validationFn) {
      return result;
    }
    const fd = this.getFn(schema.validationFn, 'field');
    return (fd.fn as FieldValidationFn)({ value });
  }

  validateType(valueType: ValueType, textValue: string): ValueValidationResult {
    const value = parseValue(textValue, valueType);
    if (value !== undefined) {
      return { value };
    }
    return { messages: [{ alertType: 'error', messageId: 'invalidValue' }] };
  }

  download(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const doc = window.document;
    const a = doc.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  getDefaultPageSize(): number {
    return this.defaultPageSize || 0;
  }
  /**
   * method to be called after login, if that is done by another component.
   * it is better to call login() of this service instead.
   */
  private afterLogin(user?: Vo) {
    if (!user) {
      console.info('No user data returned after login');
      this.removeContextValue(USER);
      this.grantAccess({});
      return;
    }

    console.info('User context being created', user);
    this.setContextValue(USER, user);

    if (user[conventions.grantAllAccess]) {
      this.grantAccessToAllMenus();
      return;
    }

    const menus = user[conventions.accesibleMenus];
    if (menus && typeof menus === 'object') {
      this.grantAccess(menus as StringMap<StringMap<true>>);
      return;
    }

    console.info(
      'Login service has not returned access control info. No menu access granted'
    );
    this.grantAccess({});
    this.removeContextValue(USER);
  }

  private shouldExist(obj: unknown, nam: string, desc: string): void {
    if (!obj) {
      throw this.newError(`${nam} is not a valid ${desc}`);
    }
  }
}

/**
 * session is to be simulated in case we are not in the browser context
 */
interface Session {
  /**
   * name-value pair is saved in the session.
   * Any existing value with this name is replaced, without any warning
   * @param name
   * @param item
   */
  setItem(name: string, item: string): void;

  /**
   *
   * @param name
   * @returns value saved with this name. undefined if no vale was saved with this name
   */
  getItem(name: string): string | null;

  /**
   * name-value pair, if any, is removed.
   * @param name
   */
  removeItem(name: string): void;
  /**
   * All saved name-value pairs are removed
   */
  clear(): void;
}
