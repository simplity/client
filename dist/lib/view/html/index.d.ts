declare const htmls: {
    '_button-panel': string;
    _button: string;
    _calendar: string;
    _chart: string;
    _charts: string;
    '_check-box': string;
    _content: string;
    '_date-field': string;
    _dialog: string;
    '_disable-ux': string;
    _files: string;
    _grid: string;
    _home: string;
    _icon: string;
    '_image-field': string;
    _image: string;
    _index: string;
    _layout: string;
    _line: string;
    _logo: string;
    '_menu-item': string;
    _message: string;
    _module: string;
    _output: string;
    '_page-with-border': string;
    _page: string;
    '_panel-flex': string;
    '_panel-grid': string;
    '_panel-modal': string;
    '_panel-outline': string;
    _panel: string;
    _password: string;
    _reports: string;
    '_select-output': string;
    _select: string;
    _settings: string;
    _snackbar: string;
    '_sortable-header': string;
    '_tab-label': string;
    _tab: string;
    _table: string;
    _tabs: string;
    '_team-icom': string;
    '_text-area': string;
    '_text-field': string;
    '_user-icon': string;
};
/**
 * All the html fragments defined in the library
 **/
export type HtmlName = keyof typeof htmls;
/**
 * all the html fragments defined in the library
 */
export declare const allHtmls: {
    [key in HtmlName]: string;
};
/**
 * All CSS classes used in the HTML fragments
 */
export declare const allClasses: string[];
export {};
