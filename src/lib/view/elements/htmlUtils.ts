import { BaseComponent, StringMap, Value } from '@/types';
import { logger } from '../../logger';
import { predefinedHtmls } from '../html';

const allHtmls: StringMap<string> = { ...predefinedHtmls };
const viewStateEnums: Record<string, readonly string[]> = {
  align: ['left', 'center', 'right'],
  vAlign: ['top', 'middle', 'bottom'],
  sorted: ['asc', 'desc'],
} as const;

/**
 * display states that are designed by simplity.
 * each view-state has a type associated with it, that is used for first-pevel of validation.
 * 'enum' is used to have a list of pre-defined values for that state, in which case the named enum is defined in the viewStateEnums constant.
 */
const viewStates = {
  /**
   * clickable: some action will be triggered on click-of this element
   */
  clickable: 'boolean',

  /**
   * a row can be "selected", may be an item can be "selected"
   */
  selectable: 'boolean',
  /**
   * true/false. Generally used for input fields.
   * However, we should be able to use it for wrapper elements that contain input fields
   */
  disabled: 'boolean',

  /**
   * used by the template to mark that the element would like to set its width to all it can
   */
  full: 'boolean',

  /**
   * generally meant for input field, but may be used for a wrapper that contain input fields
   */
  invalid: 'boolean',

  /**
   * index of the element within its parent array.
   * e.g. for a tr-element, this is the idx into the data-array that this tr is rendering from
   */
  idx: 'number',

  /**
   * true/false to show/hide an element
   */
  hidden: 'boolean',

  /**
   * width of this element as per column-width design for this app.
   * for example, in a standard grid-layout design, full-width is 12.
   *
   */
  width: 'number',

  /**
   * initialization function for this element
   */
  init: 'string',

  /**
   * change alignment at run time. like right-align for numbers in a table-column.
   * valid values are as per 'left', 'center', 'right'
   */
  align: 'string',

  /**
   * Height in number of rows of text. Generally not required, but may be useful for certain components like spacer, text etc..
   */
  //height: 'number',

  /**
   * change vertical alignment at run time. like middle-align for items in a nav-bar
   * valid values are as per 'top', 'middle', 'bottom'
   */
  vAlign: 'string',

  /**
   * how a column in a table is sorted.
   * 'asc' or 'desc'
   */
  sorted: 'string',

  /**
   * whether a select element is empty. Used for the label positioning
   */
  empty: 'boolean',

  /**
   * whether a menu/button is currently pressed
   */
  current: 'boolean',
} as const;
export type ViewState = keyof typeof viewStates;
/**
 * to be used only by design-time utilities to check if all the required templates are supplied or not
 */
export const predefinedHtmlTemplates = [
  'button',
  'button-panel',
  'check-box',
  'content',
  'chart',
  'date-field',
  'dialog',
  'disable-ux',
  'image-field',
  'image',
  'layout',
  'line',
  'list',
  'module',
  'menu-item',
  'message',
  'modal-panel',
  'nav-bar',
  'output',
  'page',
  'panel',
  'panel-flex',
  'panel-grid',
  'range-wrapper',
  'password',
  'popup',
  'select-output',
  'select',
  'snack-bar',
  'sortable-header',
  'tab',
  'table-editable',
  'table',
  'tabs',
  'text-area',
  'text-field',
] as const;

export type HtmlTemplateName = (typeof predefinedHtmlTemplates)[number];

export const childElementIds = [
  'add-button',
  'arrow-icon',
  'buttons',
  'chart',
  'close-button',
  'color-theme',
  'container',
  'data',
  'description',
  'field',
  'from-field',
  'full',
  'header',
  'label',
  'left',
  'list-config',
  'menu-bar',
  'menu-item',
  'message',
  'middle',
  'no-data',
  'page',
  'right',
  'row',
  'rows',
  'search',
  'table',
  'title',
  'to-field',
] as const;
/**
 * data-id values that are used within templates to identify child elements
 */
export type ChildElementId = (typeof childElementIds)[number];

/**
 * base path for all images. This is generally set by the app at initialization time
 */
let imageBasePath = './assets/images/';
/**
 * caching the elements that are created from html-templates
 */
const cachedElements: { [key: string]: HTMLElement } = {};

export const htmlUtil = {
  /**
   * removes all children of an html element using child.remove() method
   */
  removeChildren,

  /**
   * create a new instance of this template html element
   * @param name template name
   */
  newHtmlElement,

  /**
   * templates are designed to have unique values for data-id within their innerHTML.
   * this function gets the element within the template with the specified id
   * for example in a text-field template, label element has data-id="label" while input element has data-id="input"
   * @param rootEle parent element
   * @param id to be returned
   * @returns element
   * @throws error in case the element is not found
   */
  getChildElement,
  /**
   * templates are designed to have unique values for data-id within their innerHTML.
   * this function gets the element within the template with the specified id
   * for example in a text-field template, label element has data-id="label" while input element has data-id="input"
   * @param rootEle parent element
   * @param id to be returned
   * @returns element, or undefined if it is not found
   */
  getOptionalElement,

  /**
   * append text to an html element
   * @param ele to which text is to be appended to
   * @param text text to be appended
   */
  appendText,

  /**
   *
   * @param ele to which the icon is to be appended
   * @param icon name of image file, or htmlName.html
   * @param alt alt text to be added if it is an image
   */
  appendIcon,

  /**
   * formats a field name as a label.
   * e.g. fieldName is converted as "Field Name"
   * @param fieldName field name to be formatted as a label
   */
  toLabel,

  /**
   * Set the View-state of this element to the desired value.
   *
   * @param ele
   * @param stateName  must be a valid name as per the design specification for the app
   *
   * @param value    value as per the design of this attribute.
   */
  setViewState,

  /**
   * get the value of a display state.
   * @returns undefined if the state is not set at all,
   *  true if the attribute is set, but with no value, or ="" or with the the name of the attribute itself
   * string otherwise
   */
  getViewState,

  /**
   * Adds image-urls to the map of available images.
   * @param name name of the image
   * @param src src of the image
   */
  setImgBasePath(basePath: string): void {
    imageBasePath = basePath;
  },

  /**
   * Adds multiple html templates to the map of available templates.
   * @param templates map of template-name to innerHTML
   */
  addTemplates(templates: StringMap<string>): void {
    Object.keys(templates).forEach((k) => {
      if (allHtmls[k]) {
        logger.warn(`html template '${k}' will overwrite the default one.`);
      }
      allHtmls[k] = templates[k];
    });
  },
};

function getOptionalElement(
  rootEle: HTMLElement,
  id: ChildElementId
): HTMLElement | undefined {
  const ele = rootEle.querySelector(`[data-id="${id}"]`) as HTMLElement;
  if (ele) {
    return ele;
  }

  const att = rootEle.getAttribute('data-id');
  if (id === att) {
    return rootEle;
  }
  return undefined;
}

function getChildElement(
  rootEle: HTMLElement,
  id: ChildElementId
): HTMLElement {
  const ele = getOptionalElement(rootEle, id as ChildElementId);
  if (ele) {
    return ele;
  }
  console.info(rootEle);
  throw new Error(
    `HTML Template does not contain a child element with data-id="${id}". This is required as a container to render a child component`
  );
}

function newHtmlElement(
  name: HtmlTemplateName,
  comp?: BaseComponent
): HTMLElement {
  let ele: HTMLElement | undefined;

  //template name specified in the component overrides the name passed here
  if (comp && comp.templateName) {
    ele = locateEle(comp.templateName);
  } else {
    ele = locateEle(name);
    if (!ele) {
      //try with simplity-provided prefix
      ele = locateEle('_' + name);
    }
  }

  if (!ele) {
    //template not found. create a dummy one
    const n = comp && comp.templateName ? comp.templateName : name;
    ele = createUndefinedEle(n);
    cachedElements[n] = ele;
  }

  return ele.cloneNode(true) as HTMLElement;
}

function locateEle(name: string): HTMLElement | undefined {
  let ele = cachedElements[name];
  if (ele) {
    return ele;
  }
  const internalName = '_' + name;
  ele = cachedElements[internalName];
  if (ele) {
    return ele;
  }

  let indexedName = name;
  let html = allHtmls[name];
  if (!html) {
    html = allHtmls[internalName];
    if (!html) {
      return undefined;
    }
    indexedName = internalName;
  }
  cachedElements[indexedName] = ele;
  return ele;
}

function createUndefinedEle(name: string): HTMLElement {
  logger.error(
    `A component requires an html-template named "${name}". This template is not available at run time. A dummy HTML is used.`
  );
  const ele = toEle(`<div><!-- html source ${name} not found --></div>`);
  cachedElements[name] = ele;
  return ele;
}

function toEle(html: string): HTMLElement {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content.firstElementChild as HTMLElement;
}

function removeChildren(ele: HTMLElement): void {
  ele.innerHTML = '';
}

function appendText(ele: HTMLElement, text: string): void {
  ele.appendChild(document.createTextNode(text));
}

function appendIcon(ele: HTMLElement, icon: string, alt?: string): void {
  if (icon.endsWith('.html')) {
    const s = icon.substring(0, icon.length - 5);
    const html = allHtmls[s];

    if (html) {
      ele.appendChild(toEle(html));
      return;
    }
    logger.error(
      `an icon named ${icon} could not be created because no html is available with name = ${s}`
    );
    return;
  }

  const img = document.createElement('img');
  const src = getImageSrc(icon);
  if (src) {
    img.src = src;
    img.alt = alt || '';
  } else {
    img.alt = 'icon ' + icon + ' not found';
  }
  ele.appendChild(img);
}

function toLabel(name: string): string {
  if (!name) {
    return '';
  }
  const firstChar = name.charAt(0).toUpperCase();
  const n = name.length;
  if (n === 1) {
    return firstChar;
  }
  const text = firstChar + name.substring(1);
  let label = '';
  /**
   * we have ensure that the first character is upper case.
   * hence the loop will end after adding all the words when we come from the end
   */
  let lastAt = n;
  for (let i = n - 1; i >= 0; i--) {
    const c = text.charAt(i);
    if (c >= 'A' && c <= 'Z') {
      const part = text.substring(i, lastAt);
      if (label) {
        label = part + ' ' + label;
      } else {
        label = part;
      }
      lastAt = i;
    }
  }
  return label;
}

function getViewState(
  ele: HTMLElement,
  stateName: string
): string | boolean | undefined {
  const attr = 'data-' + stateName;
  const val = ele.getAttribute(attr);
  if (val === null) {
    return undefined;
  }
  //booleans could be set with no value, or to the name of the attribute itself!!
  if (val === '' || val === attr) {
    return true;
  }
  return val;
}

function setViewState(
  ele: HTMLElement,
  stateName: ViewState,
  stateValue: Value
): void {
  // we set the value after a warning if the value is not as per design
  validateViewState(stateName, stateValue);
  const vt = typeof stateValue;

  const attName = 'data-' + stateName;
  if (vt === 'boolean') {
    if (stateValue) {
      ele.setAttribute(attName, '');
    } else {
      ele.removeAttribute(attName);
    }
    return;
  }

  const val = '' + stateValue; //playing it safe
  if (val) {
    ele.setAttribute(attName, val);
  } else {
    ele.removeAttribute(attName);
  }
}

function validateViewState(stateName: ViewState, stateValue: Value): boolean {
  //is it an enum?
  const enumValues = viewStateEnums[stateName as string];
  if (enumValues) {
    //is the value one of these?
    if (enumValues.indexOf(stateValue + '') >= 0) {
      return true;
    }
    logger.warn(
      `'${stateValue}' is not a pre-defined value for the displayState '${stateName}'. Expected values are: ${enumValues.join(', ')}.`
    );
    return false;
  }

  const expectedType = viewStates[stateName as ViewState];
  if (!expectedType) {
    logger.warn(`displayState '${stateName}' is not a known display state.`);
    return true;
  }
  const receivedType = typeof stateValue;
  if (expectedType !== receivedType) {
    logger.warn(
      `displayState '${stateName}' takes a ${expectedType} value but a value of type '${receivedType}' is being set.`
    );
    return false;
  }
  return true;
}

function getImageSrc(imageName: string): string {
  const s = '' + imageName;
  if (s.length > 4) {
    const st = s.substring(0, 6).toLowerCase();
    if (st.startsWith('http:') || st.startsWith('https:')) {
      return imageName;
    }
  }
  return imageBasePath + imageName;
}
