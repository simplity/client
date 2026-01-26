import { FunctionType, StringMap, ValueFormatter, Values } from '../common';
import { Layout, Module, Page, Service, Sql, PageTemplate, ValueSchema, PageAlteration, ListSource, Record, ValueList, Form } from '.';
/**
 * All the metadata that captures the core design that are directly used at run time.
 * This is the output of the design layer, and input to the runtime layer
 */
export type AppDesign = {
    name: string;
    version: string;
    date: string;
    description: string;
    /**
     * simplity agent manages login process, if it is configured at the app level.
     * this service, if specified, has to conform to the login-specific API
     */
    loginServiceName?: string;
    /**
     * simplity agent invokes the logout service, but does not expect any response back.
     */
    logoutServiceName?: string;
    /**
     * default page size to be used for paginating tables that do not specify a table-specific page size
     * Works only if the app provides a plugin to render tables with pagination
     */
    defaultPageSize?: number;
    forms: StringMap<Form>;
    /**
     * all functions defined for this app. Note that the function name has to be unique across all pages.
     * an App may follow naming convention like pageName.functionName if the app is quite large
     */
    functions?: StringMap<FunctionType>;
    /**
     * html fragments that work with view-components to render the view-components in a browser.
     * Simplity provides the default htmls required. User apps can extend or override these.
     */
    htmls?: StringMap<string>;
    /**
     * page layouts. The way the page as the user views is laid out from its components
     */
    layouts?: StringMap<Layout>;
    /**
     * how to get list of valid values for a field
     */
    listSources: StringMap<ListSource>;
    /**
     * run-time messages
     */
    messages?: StringMap<string>;
    /**
     * modules of the app. It's a logical grouping of pages
     */
    modules?: StringMap<Module>;
    /**
     * all pages in the app, including hand-coded as well as generated ones
     */
    pages?: StringMap<Page>;
    /**
     * how the values are formatted for display
     */
    valueFormatters?: StringMap<ValueFormatter>;
    /**
     * how field values are validated
     */
    valueSchemas?: StringMap<ValueSchema>;
    /**
     * links that can be accessed by typing/clicking a URL that is encoded with all the information required to land on a specific page
     */
    directLinks?: StringMap<DirectLink>;
};
/**
 *   All the metadata that captures the core design that are directly used at design time to generate
 *   code and other artifacts.
 */
export type GeneratorInput = {
    name: string;
    /**
     * default max length to be used for a text-value-schema with no max specified
     */
    maxLengthForTextField: number;
    /**
     * if this app is an multi-tenant app.
     */
    tenantFieldName?: string;
    /**
     * column name in db tables for the tenant column
     */
    tenantNameInDb?: string;
    /**
     * server-side. Used for generating java classes
     */
    javaRootPackageName?: string;
    /**
     * small alteration to a designed or generated page.
     */
    alters?: StringMap<PageAlteration>;
    /**
     * all the messages that may be shown to the user
     */
    messages?: StringMap<string>;
    /**
     * pages that are hand-coded by the app-designer, without using any template
     */
    pages?: StringMap<Page>;
    records: StringMap<Record>;
    /**
     * API (input-output) specification for all the services that are exposed by the server-app for the client-app
     */
    services?: StringMap<Service>;
    /**
     * sqls are server-side components to interface with the database
     */
    sqls?: StringMap<Sql>;
    /**
     * page templates are short-cuts to generate a standard (predefined-format) page.
     */
    templates?: StringMap<PageTemplate>;
    /**
     * value lists are used to define a set of predefined values for a field
     */
    valueLists: StringMap<ValueList>;
    /**
     * how field values are validated
     */
    valueSchemas?: StringMap<ValueSchema>;
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
