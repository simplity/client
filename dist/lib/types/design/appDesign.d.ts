import { FunctionType, StringMap, ValueFormatter, Values } from '../common';
import { Layout, Module, Page, Service, Sql, PageTemplate, ValueSchema, PageAlteration, ListSource, Record, ValueList, Form } from '.';
/**
 * All the metadata that captures the core design of the App.
 * Some components are used at runtime as they are, while others may be transformed.
 * All the c=components that are relevant for the server side are transformed to relevant JSONs.
 * These JSONs are then used by the server-side generator to generate appropriate java classes.
 * We intend to shift the server-side generation also to TS for ease of maintenance.
 */
export type AppDesign = {
    name: string;
    version: string;
    date: string;
    description: string;
    /**
     * small alteration to a designed or generated page.
     */
    alters: StringMap<PageAlteration>;
    /**
     * links that can be accessed by typing/clicking a URL that is encoded with all the information required to land on a specific page
     */
    directLinks: StringMap<DirectLink>;
    /**
     * all functions defined for this app. Note that the function name has to be unique across all pages.
     * an App may follow naming convention like pageName.functionName if the app is quite large
     */
    functions: StringMap<FunctionType>;
    /**
     * all pages in the app, including hand-coded as well as generated ones
     */
    handCraftedPages: StringMap<Page>;
    /**
     * html fragments that work with view-components to render the view-components in a browser.
     * Simplity provides the default htmls required. User apps can extend or override these.
     */
    htmls: StringMap<string>;
    /**
     * page layouts. The way the page as the user views is laid out from its components
     */
    layouts: StringMap<Layout>;
    /**
     * run-time messages
     */
    messages: StringMap<string>;
    /**
     * modules of the app. It's a logical grouping of pages
     */
    modules: StringMap<Module>;
    /**
     * all the data-structures, including API input-outputs, tables, views etc.. used in the app
     */
    records: StringMap<Record>;
    /**
     * all services exposed by the app
     */
    services: StringMap<Service>;
    /**
     * sqls are server-side components to interface with the database
     */
    sqls: StringMap<Sql>;
    /**
     * page templates are short-cuts to generate a standard (predefined-format) page.
     */
    templates: StringMap<PageTemplate>;
    /**
     * how the values are formatted for display
     */
    valueFormatters: StringMap<ValueFormatter>;
    /**
     * value lists are used to define a set of predefined values for a field.
     * These are used in select/drop-down fields.
     */
    valueLists: StringMap<ValueList>;
    /**
     * how field values are validated
     */
    valueSchemas: StringMap<ValueSchema>;
};
/**
 * Design components that are relevant for the client-side app.
 * Some of these are generated from the core design components.
 * These are directly used at run-time by the client app
 */
export type ClientDesign = {
    loginServiceName?: string;
    logoutServiceName?: string;
    defaultPageSize: number;
    /**
     * links that can be accessed by typing/clicking a URL that is encoded with all the information required to land on a specific page
     */
    directLinks: StringMap<DirectLink>;
    /**
     * forms are generated from records that are relevant for the client-side.
     */
    forms: StringMap<Form>;
    /**
     * html fragments that work with view-components to render the view-components in a browser.
     * Simplity provides the default htmls required. User apps can extend or override these.
     */
    htmls: StringMap<string>;
    /**
     * page layouts. The way the page as the user views is laid out from its components
     */
    layouts: StringMap<Layout>;
    /**
     * run-time messages
     */
    messages: StringMap<string>;
    /**
     * modules of the app. It's a logical grouping of pages
     */
    modules: StringMap<Module>;
    /**
     * how to get list of valid values for a field.
     * These are generated from value-lists defined in the core design.
     */
    listSources: StringMap<ListSource>;
    /**
     * all pages, including hand-coded as well as generated ones
     */
    pages: StringMap<Page>;
    /**
     * how the values are formatted for display
     */
    valueFormatters: StringMap<ValueFormatter>;
    /**
     * how field values are validated
     */
    valueSchemas: StringMap<ValueSchema>;
};
/**
 * for operations like password reset, where a token is treated as authorization.
 */
type Authorized = {
    requiresToken: true;
    requiresLogin?: false;
};
/**
 * for operations that are not pre-authorized with a token, but may or may not require login.
 * This is the default case.
 */
type Bookmarked = {
    requiresToken?: false;
    requiresLogin?: boolean;
};
/**
 * links that can be accessed by typing/clicking a URL that is encoded with all the information required to land on a specific page
 * the link format is index.html?_d=name&_t=token (if token is required) followed by any number of page-specific parameters
 */
export type DirectLink = (Authorized | Bookmarked) & {
    name: string;
    layout: string;
    module: string;
    menuItem: string;
    pageParameters?: Values;
};
export {};
