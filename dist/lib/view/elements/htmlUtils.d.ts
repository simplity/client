import { BaseComponent, StringMap, Value, ViewState } from '@simplity';
/**
 * to be used only by design-time utilities to check if all the required templates are supplied or not
 */
export declare const predefinedHtmlTemplates: readonly ["button", "button-panel", "check-box", "chart", "date-field", "dialog", "disable-ux", "image-field", "image", "layout", "line", "list", "module", "menu-item", "message", "modal-panel", "modal-page", "nav-bar", "output", "page", "panel", "panel-flex", "panel-grid", "range-wrapper", "password", "popup", "select-output", "select", "snack-bar", "sortable-header", "static", "static-block", "tab", "table-editable", "table", "tabs", "text-area", "text-field"];
export type HtmlTemplateName = (typeof predefinedHtmlTemplates)[number];
export declare const childElementIds: readonly ["add-button", "arrow-icon", "buttons", "chart", "close-button", "close-panel", "color-theme", "container", "content", "data", "description", "field", "from-field", "full", "header", "label", "left", "list-config", "menu-bar", "menu-item", "message", "middle", "no-data", "page", "right", "row", "rows", "search", "table", "title", "to-field"];
/**
 * data-id values that are used within templates to identify child elements
 */
export type ChildElementId = (typeof childElementIds)[number];
export declare const htmlUtil: {
    /**
     * removes all children of an html element using child.remove() method
     */
    removeChildren: typeof removeChildren;
    /**
     * create a new instance of this template html element
     * @param name template name
     */
    newHtmlElement: typeof newHtmlElement;
    /**
     * templates are designed to have unique values for data-id within their innerHTML.
     * this function gets the element within the template with the specified id
     * for example in a text-field template, label element has data-id="label" while input element has data-id="input"
     * @param rootEle parent element
     * @param id to be returned
     * @returns element
     * @throws error in case the element is not found
     */
    getChildElement: typeof getChildElement;
    /**
     * templates are designed to have unique values for data-id within their innerHTML.
     * this function gets the element within the template with the specified id
     * for example in a text-field template, label element has data-id="label" while input element has data-id="input"
     * @param rootEle parent element
     * @param id to be returned
     * @returns element, or undefined if it is not found
     */
    getOptionalElement: typeof getOptionalElement;
    /**
     * append text to an html element
     * @param ele to which text is to be appended to
     * @param text text to be appended
     */
    appendText: typeof appendText;
    /**
     *
     * @param ele to which the icon is to be appended
     * @param icon name of image file, or htmlName.html
     * @param alt alt text to be added if it is an image
     */
    appendIcon: typeof appendIcon;
    /**
     * formats a field name as a label.
     * e.g. fieldName is converted as "Field Name"
     * @param fieldName field name to be formatted as a label
     */
    toLabel: typeof toLabel;
    /**
     * Set the View-state of this element to the desired value.
     *
     * @param ele
     * @param stateName  must be a valid name as per the design specification for the app
     *
     * @param value    value as per the design of this attribute.
     */
    setViewState: typeof setViewState;
    /**
     * get the value of a display state.
     * @returns undefined if the state is not set at all,
     *  true if the attribute is set, but with no value, or ="" or with the the name of the attribute itself
     * string otherwise
     */
    getViewState: typeof getViewState;
    /**
     * Adds image-urls to the map of available images.
     * @param name name of the image
     * @param src src of the image
     */
    setImgBasePath(basePath: string): void;
    /**
     * Adds multiple html templates to the map of available templates.
     * @param templates map of template-name to innerHTML
     */
    addTemplates(templates: StringMap<string>): void;
};
declare function getOptionalElement(rootEle: HTMLElement, id: ChildElementId): HTMLElement | undefined;
declare function getChildElement(rootEle: HTMLElement, id: ChildElementId): HTMLElement;
declare function newHtmlElement(templateName: HtmlTemplateName, comp?: BaseComponent): HTMLElement;
declare function removeChildren(ele: HTMLElement): void;
declare function appendText(ele: HTMLElement, text: string): void;
declare function appendIcon(ele: HTMLElement, icon: string, alt?: string): void;
declare function toLabel(name: string): string;
declare function getViewState(ele: HTMLElement, stateName: string): string | boolean | undefined;
declare function setViewState(ele: HTMLElement, stateName: ViewState, stateValue: Value): void;
export {};
