/**
 * The visual aspect of the client-app is implemented with a hierarchy of visual components.
 * This hierarchy is similar to the Document Object Model (DOM) of an HTML file.
 * Layout is the top level component that houses everything else.
 * The child components may be either leaf-components, or containerComponents that contain child-components.
 *
 * Each component has its pre-defined set of attributes. In addition, a container component has pointers to its child component instances
 * This file defines the shape of this hierarchical model.
 * This is like the .html file that specifies all the attributes of the DOM.
 *
 */
import {
  OptionalOf,
  SortBy,
  StringMap,
  Value,
  Values,
  FilterCondition,
} from '../common';

import {
  FormOperation,
  RecordFieldAndDataField,
  ValueType,
  VisualWidth,
} from '.';
/**
 * basic attributes of a Page.
 * This type-alias is created to re-use the base attributes for PageAlterations
 */
export type PageAttributes = {
  name: string;
  /**
   * form that defines meta data for the data-model behind this page.
   * it is possible that the page has no form at all. In that case, no 'fields' are to be rendered.
   * if no form is specified, it is still possible to have child-forms (table-panels) in the page
   */
  formName?: string;
  /**
   * is this page designed to edit the data model?
   */
  isEditable?: boolean;
  /**
   * page may have title that may embed the value of a field.Hence we provide prefix, field and suffix.
   */
  titlePrefix?: string;
  /**
   * page may have title that may embed the value of a field.Hence we provide prefix, field and suffix.
   */
  titleField?: string;
  /**
   * page may have title that may embed the value of a field.Hence we provide prefix, field and suffix.
   */
  titleSuffix?: string;
  /**
   * edit page typically considers menu as a distraction
   */
  hideMenu?: boolean;
  /**
   * edit page typically considers modules options as a distraction
   */
  hideModules?: boolean;
  /**
   * input field names. boolean to indicate if it is required/mandatory
   * for example:
   * {
   *  field1: true,
   *  field2: false
   * }
   */
  inputs?: StringMap<boolean>;
  /**
   * if the page is common for create and update, then indicate so with this attribute
   * Page will fetch the row on load, if the key is provided. And the
   */
  inputIsForUpdate?: boolean;
  /**
   * can this page be offered if the user has not logged-in?
   */
  serveGuests?: boolean;
  /**
   * actions to be taken after loading this page.
   * If specified, each action must have been defined in the actions collection
   */
  onLoadActions?: string[];
  /**
   * action to be taken before the page is closed
   * If specified, it must be defined as an action in this.actions
   */
  onCloseAction?: string;
  /**
   * various actions (response to events) defined in this page.
   * This is the definition of the actions. Individual components would use the name of a defined action
   */
  actions?: StringMap<Action>;
  /**
   * if any action is to be triggered at the page level when any field is changed/changing etc...
   * this would be in addition to any triggers that are specified at the form/field level
   */
  triggers?: EventAction[];
  /**
   * functions that are used in this page. They are typically used in function-actions.
   * But they may also be use in other functions
   * boolean represents whether the function is pageScoped. If true, the function is of type PageFunction.
   * if false, this function is a FormFunction
   */
  /**
   * buttons to be rendered at the left of the button panel
   */
  leftButtons?: Button[];
  /**
   * buttons to be rendered at the middle/center
   */
  middleButtons?: Button[];
  /**
   * buttons to be rendered on the right
   */
  rightButtons?: Button[];
  /**
   * by default, buttons are rendered at the bottom.
   * However, like in a list-page, it may make more sense to render them at the top
   */
  renderButtonsBeforeData?: boolean;
};
/**
 * A Page renders data from one or more forms, inside of a layout.
 */
export type Page = PageAttributes & {
  /**
   * panel where the page renders the data that is bound to.
   */
  dataPanel: Panel;
};

export type EventName = 'change' | 'changing' | 'click';
/**
 * specify event handlers for fields/columns
 */
export type EventAction = {
  eventName: EventName;
  /**
   * name of table if this field is a column.
   * omitted if this is for a field in the main form
   */
  tableName?: string;
  controlName: string;
  actionName: string;
};
/**
 * Common properties of any component. In a class-sense, this is the base class
 */
type BaseComponent = {
  name: string;
  compType: ComponentType;
  /**
   * variant may be used to choose a pre-defined variant of the component.
   * e.g. for a button, variant may be 'primary', 'secondary' etc...
   * for a panel, variant may be 'outline', 'flex' etc...
   * Each component defines its own set of variants.
   */
  variant?: string;
  /**
   * parent may use this to assign appropriate style based on this width
   */
  width?: VisualWidth;
  /**
   * label may have different meaning for different elements
   */
  label?: string;
  /**
   * any action to be taken onClick for this node?
   *
   */
  onClick?: string;
  /**
   * a specific component may be designed completely differently from the standard ones.
   * however, the html must still follow the naming conventions for data-attributes and any other requirement for that component.
   * this is the name of the html template that provides the html fragment to be used instead of the standard template
   */
  templateName?: string;
  /**
   * initial display state. e.g. {hidden: true}
   */
  displayStates?: StringMap<Value>;

  /**
   * an app may have app-specific view implementation. Actual parameters are left to the app implementation.
   */
  pluginOptions?: StringMap<any>;
};

export type ComponentType =
  | 'button'
  | 'buttonPanel'
  | 'chart'
  | 'field'
  | 'multi-report'
  | 'panel'
  | 'range'
  | 'referred'
  | 'static'
  | 'tabs'
  | 'table';
/**
 * a visual component of a page
 */
export type PageComponent =
  | Button
  | ButtonPanel
  | Chart
  | DataField
  | MultiReportPanel
  | Panel
  | RangePanel
  | ReferredField
  | StaticComp
  | TableViewer
  | TableEditor
  | Tabs
  | Tab;

/**
 * subset of page visual components that just act as containers for their child components
 */
export type ContainerComponent = MultiReportPanel | Panel | Tabs | Tab;

export type LeafComponent =
  | DataField
  | Button
  | StaticComp
  | ReferredField
  | RangePanel;

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'navigation'
  | 'custom'
  | 'submit';
/**
 * meta data for a button
 */
export type Button = BaseComponent & {
  compType: 'button';
  variant: ButtonVariant;
  label?: string;
  icon?: string;
  tooltip?: string;
  /**
   * should this button be enabled only when the form switches certain state?
   */
  enableWhen?: 'error' | 'valid' | 'rowsSelected' | 'dirty';
  /**
   * additional parameters specific to this button
   */
  buttonOptions?: StringMap<unknown>;
};

type FieldAttributes = RecordFieldAndDataField & {
  isRequired: boolean;
};
/**
 * Simplest way to render a field based on the field defined in the associated record.
 * Rendering details are taken or inferred from the record.
 * Feel free to override any of the attributes by explicitly specifying them here.
 */
export type ReferredField = BaseComponent & {
  compType: 'referred';
} & OptionalOf<FieldAttributes>;

/**
 * pre-defined panel variants. App-specific variants can be added using templateType instead of panelVariant
 * outline and flex are for different type of rendering
 */
export type PanelVariant = 'outline' | 'flex';
/**
 * Field is a component that is bound to a data-element at run time.
 */
export type DataField = BaseComponent & {
  compType: 'field';
} & FieldAttributes;

/**
 * Primarily designed to render date-range fields
 *
 */
export type RangePanel = BaseComponent & {
  compType: 'range';
  fromField: DataField | ReferredField;
  toField: DataField | ReferredField;
};

export type MultiReportPanel = BaseComponent & {
  compType: 'multi-report';
  /**
   * each child must be a tableViewer. At least two children expected
   */
  children: TableViewer[];
};

export type Panel = BaseComponent & {
  compType: 'panel';

  /**
   * default panel is a wrapper of items. It will in turn render the child items, as if they were directly under the parent.
   * Choose a panel-type variant that is pre-defined. To use an app-specific panel, skip this and use templateName
   */
  variant?: PanelVariant;
  /**
   * optional name of the form that defines the data fields in this panel.
   * This feature allows the form at the page level to have sun-forms. And, he heirarchy can continue to any arbitrary levels.
   * Important to note that the name of the panel is the name with which ths sub-form is known to the parent-form, and NOT the name of the sub-form itself.
   * This is to allow different sub-forms to inherit the same form-structure, but attched to different panels.
   * if this is provided, all the data-bound components inside this panel are controlled by a new form-controller than the this panel is part of.
   * This is how we can map the data in the page to be mapped to panels
   */
  formName?: string;
  /**
   * contents of this panel. Either this is specified, or fieldNames is specified
   */
  children?: PageComponent[];
  /**
   * render these fields from the relevant form. This is an alternative to specify fields as children.
   * 'all' is a short cut to use the field names as in the form, in that order.
   */
  fieldNames?: 'all' | string[];
};

/**
 * any leaf component that is not bound to any data.
 */
export type StaticComp = BaseComponent & {
  compType: 'static';
  /**
   * use this for one of the known static elements.
   * skip this and specify templateName to use an app-specific element
   * NOTE: if both (staticType and templateName) are missing, then an empty div is added
   */
  variant?: StaticVariant;
  /**
   * Design time content to be rendered. This is not meant to be dynamic.
   * If you want to render dynamic content, use a field instead
   * NOTE: if variant="image", then this is the alt-text for the image
   */
  content?: string;
  imageName?: string;
  elementOptions?: StringMap<unknown>;
};
export type StaticVariant = 'image' | 'content' | 'line';
/**
 * Data table that renders tabular data (rows and columns) in readonly mode
 * There may be a feature to select rows, but the data itself is not editable
 * there are three ways to specify how the columns are to rendered.
 * 1. default is "dynamic". The table is rendered based on run-time tabular data.
 *  columns are decided based on the name-value pairs in the first row of the data.
 * column header is formatted based on the names. Numeric column is right justified.
 *
 * 2. using columnsToRender. Several features are available to format the text as well as specify markups for rendering.
 * Column values are essentially rendered as text, but with simple css-based markups
 *
 * 3. using columnComponents. These are regular pre-defined view components.
 * They are rendered inside the cells without the labels.
 * For example a boolean value can be rendered as a check-box.
 * All editable fields are disabled (essentially  readonly)
 *
 */
export type TableViewer = BaseComponent & {
  compType: 'table';
  /**
   * table variants are defined as separate types.
   */
  variant?: never;
  /**
   * Table view is designed to be read-only
   */
  editable: false;

  /**
   * can the user do a quick-search on the rendered rows on the client?
   * if set to true, renders rows are filtered to show only the ones that contain the text being searched on in any of their columns
   */
  searchable?: boolean;

  /**
   * if set to true, user can click on the header of any of the column to sort the rows by that column.
   * rows are sorted in ascending order first. A click on the same column would result in sort in descending order.
   * note that the rows can be sorted on only on columns. multi-column sort facility is not designed yet
   */
  sortable?: boolean;
  /**
   * can the end-user choose columns to render, filter conditions and sort orders?
   * if set to true, a configuration panel is rendered at run time.
   * Table rows are rendered based in these selection criterion set by the user.
   */
  configurable?: boolean;
  /**
   * If this panel is designed to show a pre-designed dynamic report.
   * Saved report configurations are fetched on-load.
   * Also, the default layout for the logged-in user is fetched automatically.
   * Relevant only if configurable=true
   */
  reportName?: string;
  /**
   * a form-based table comes with several other features.
   * strongly recommended that the table be based on a form.
   * But there are certainly situations where a form may not be required
   */
  formName?: string;
  /**
   * can the user select rows?
   * Name of the boolean-valued-field that represents the selection status
   */
  selectFieldName?: string;
  /**
   * relevant if rows can be selected
   */
  minRows?: number;
  /**
   * relevant if rows can be selected
   */
  maxRows?: number;
  /**
   * if min/max rows selection is violated, this is the errorId to be used to flash a message
   */
  errorId?: string;
  /**
   * action to be invoked when user clicks on a row.
   * Should be used if and only if no cells have meaning on click.
   */
  onRowClick?: string;
  /**
   * leaf elements can serve as columns. Not panels and tables.
   * Note that the selectField, if specified, should not be defined as a column.
   * Value of that field is automatically linked to the selection status of the rows
   * NOTE: the components are rendered in the usual field-view mode.
   * Chose this member only if that is what is needed. Consider using columnsToRender instead.
   * It is an error to specify both children and columns
   */
  children?: LeafComponent[];
  /**
   * since the columns are meant for read/view, it is more appropriate to specify how the column values are to be rendered.
   * It is an error to specify both children and columns
   */
  columns?: ColumnDetails[];
  /**
   * action buttons. May be for the selected rows or independent of the rows
   */
  actionButtons?: Button[];
  /**
   * action: label maps for dynamic action menu for each row
   */
  rowActions?: StringMap<string>;

  /**
   * all rows are rendered if this is not specified.
   * 'default' means stick to the default page-size set at the app level.
   */
  pageSize?: 'default' | number;

  /**
   * if true, user is provided options to export the data to csv/xlsx etc.. based on the app-specific plugin
   */
  exportable?: boolean;
  /**
   * Panel that provides the configuration parameters for fetching rows for this table.
   * relevant only if configurable="true".
   * If this panel is not provided, a default panel is rendered.
   */
  configurationPanel?: Panel;
};
/**
 * Data table that renders from tabular data (rows and columns) in read-nly mode
 * There may be a feature to select rows, but the data itself is not editable
 */
export type TableEditor = BaseComponent & {
  compType: 'table';
  /**
   * table variants are defined as separate types.
   */
  variant?: never;
  /**
   * Table view is designed to be read-only
   */
  editable: true;
  /**
   * default is to use all the fields in the form as children.
   * leaf elements can serve as columns. Not panels and tables.
   * Note that the selectField, if specified, should not be defined as a column.
   * Value of that field is automatically linked to the selection status of the rows
   */
  children?: LeafComponent[];
  /**
   * a form-based table comes with several other features.
   * strongly recommended that the table be based on a form, but there are certainly situations where a form may not be required
   */
  formName?: string;
  /**
   * relevant if rows can be selected
   */
  minRows?: number;
  /**
   * relevant if rows can be selected
   */
  maxRows?: number;
  /**
   * if min/max rows selection is violated, this is the errorId to be used to flash a message
   */
  errorId?: string;
  /**
   * can the end-user add a row?.
   */
  rowsCanBeAdded?: boolean;
};

export type ButtonPanel = BaseComponent & {
  compType: 'buttonPanel';
  /**
   * variants are not defined yet.
   */
  variant?: never;
  leftButtons?: Button[];
  middleButtons?: Button[];
  rightButtons?: Button[];
};

export type Tabs = BaseComponent & {
  compType: 'tabs';
  /**
   * variants are not defined yet.
   */
  variant?: never;
  /**
   * if the tabs have editable fields,then we may want to
   * render the tab to indicate whether any fields within that is in error
   */
  trackErrorStatus?: boolean;
  children: Tab[];
};
/**
 * panel that is a direct child of a tab container.
 * a tab needs to be controlled by its tabs parent
 */
export type Tab = Panel & {
  /**
   * tab label is different from label for the panel
   */
  tabLabel: string;
  /**
   * icon is rendered before the label
   */
  icon?: string;
};

export type ChartType = 'pie';
export type ChartField = ColumnDetails & {
  valueType: 'integer' | 'decimal';
  /**
   * valid color name as per standard CSS.
   * It is recommended that you either choose colors for all columns, or skip for all
   */
  color?: string;
};

/**
 * A chart renders a tabular data. At an abstract level, this is an alternative to tableViewer
 */
export type Chart = BaseComponent & {
  compType: 'chart';
  variant: ChartType;
  /**
   * fields that supply the chart data. Each field must be numeric.
   */
  fields: ChartField[];
};

/**
 * common attributes of all the actions
 */
type BaseAction = {
  name: string;
  /**
   * optional next action to be taken if this action succeeds
   */
  onSuccess?: string;
  /**
   * optional next action to be taken if this action fails
   */
  onFailure?: string;
  /**
   * service call is generally asynchronous, and likely to take some time.
   * should the UX be disabled till the service response is received?
   */
  toDisableUx?: boolean;
  /**
   * message to be rendered as success if the action succeeds
   * app should provide text for this id
   */
  successMessageId?: string;
  /**
   * message to be rendered as error if the action fails
   * app should provide text for this id
   */
  failureMessageId?: string;
};

/**
 * close this page.
 *
 */
export type CloseAction = BaseAction & {
  //actually base action attributes are not relevant, but having them simplifies type-checks
  type: 'close';
};

/**
 * Reset fields/tables on this page.
 *
 */
export type ResetAction = BaseAction & {
  type: 'reset';
  /**
   * by default all fields and tables will be reset.
   * you may specify that a specific panel associated with a child-form be reset.
   * Further, if fieldsToReset is also specified, then only the specified fields in this form will be reset
   */
  panelToReset?: string;
  /**
   * if specified, only the listed fields will be reset.
   * These fields are from the root-form by default.
   * if panelToReset is specified, only these fields from that child-form will be reset
   */
  fieldsToReset?: string[];
};
/**
 * A piece of work/task that is typically triggered through an event
 */
export type Action =
  | CloseAction
  | FilterAction
  | FormAction
  | FunctionAction
  | NavigationAction
  | ResetAction
  | ServiceAction
  | DisplayAction;
/**
 * action that requires specific programming logic. This is implemented as a function in the app
 */
export type FunctionAction = BaseAction & {
  type: 'function';
  /**
   * function name must be one of the functions defined in this page
   */
  functionName: string;
  /**
   * Additional parameters to be passed to the function.
   * Must match the published api specification of that function.
   * This is all design-time determined constants.
   * No feature is provided to pass run-time-determined parameters.
   */
  additionalParams?: StringMap<any>;
};
/**
 * form related action, like fetching and saving form data
 */
export type FormAction = BaseAction & {
  type: 'form';
  formName: string;
  formOperation: FormOperation;
};
/**
 *
 */
export type DisplaySettings = StringMap<StringMap<Value>>;
/**
 * change the view related attribute of a component
 */
export type DisplayAction = BaseAction & {
  type: 'display';
  /**
   * display settings for components
   * e.g {
   *    comp1: {hidden: true},
   *    comp2: {hidden: false},
   *    field1: {disabled: false, invalid: true}
   * }
   */
  displaySettings: DisplaySettings;
};

export type FilterAction = BaseAction & {
  type: 'form';
  formOperation: 'filter';
  formName: string;
  /**
   * name of the table (table-component) that receives the filtered data
   */
  targetTableName: string;
  /**
   * conditions based on which the rows for the child are fetched
   */
  filters?: FilterCondition[];
  /**
   * sorting of rows based on fields
   */
  sortBy?: SortBy[];
  fields?: string[];
  maxRows?: number;
};

/**
 * request a specific service
 */
export type ServiceAction = BaseAction & {
  type: 'service';
  serviceName: string;
  /**
   * submit the entire form/data-structure defined for this form.
   */
  submitAll?: true;

  /**
   * can be used only if submitAll is not set.
   * submit the form/data-structure defined for a panel.
   * the named panel must have childForm=""
   */
  panelToSubmit?: string;

  /**
   * can be used only if submitAll and panelToSubmit are not set.
   * list of fields to be submitted.
   * If the boolean is true, the field is considered to be mandatory, and an error is generated if teh value is missing
   */
  fieldsToSubmit?: StringMap<boolean>;
  /**
   * function to be executed just before requesting this service.
   * this function should be a RequestFunction type.
   * if the function returns falsy, then the service is not requested
   * This feature can be used to prepare the required data to be submitted, or carrying out any special validations
   */
  fnBeforeRequest?: string;
  /**
   * function to be called after the response is received (request returns) but before the payload is processed
   * this function is like an intercept that can alter the response before it is processed
   * it should be of type ResponseFunction
   */
  fnAfterResponse?: string;
  /**
   * The data received from a a service is is meant to be for the entire page.
   * However, you may target a panel that is bound to its own form.
   * Also, note that the data received is assumed to be "complete" data, and not incremental.
   * That is, if no data is received for a field, then that field is reset. (Any old data is replaced with an empty string)
   */
  targetPanelName?: string;
};
/**
 * event triggered to navigate to a page or a module
 * Note:
 * One of menuItem, module or layout is mandatory.
 */
export type NavigationAction = BaseAction & {
  type: 'navigation';
  /**
   * user is warned and is asked to reconfirm before taking this action, in case the form is modified by the user
   */
  warnIfModified?: boolean;

  /**
   * relevant if retainCurrentPage = true. action to be taken when this page is un-hidden/activated again.
   */
  onReactivation?: string;
} & NavigationOptions;
/**
 * meta data for a button that is meant to navigate to a menu item
 */
export type MenuButton = {
  /**
   *  unique name. typically xxxButton
   */
  name: string;
  /**
   * on click, this menu id is opened. If relevant, key fields of the form associated with the page/panel are sent as parameters
   */
  menuItem: string;
  /**
   * if icon is used, then the label is used as hint
   */
  label?: string;
  /**
   * used for non-fields.
   */
  icon?: string;
  /**
   * parameters to be passed, if different from the primary keys of the form.
   * note that the value should be of the form '$fieldName' if the value of a field is to be sent.
   */
  params?: Values;
};

export type NavigationOptions = {
  /**
   * defaults to current
   */
  layout?: string;
  /**
   * defaults to default in the new layout, or the current module if layout is not changed
   */
  module?: string;
  /**
   * default from the module if this is omitted
   */
  menuItem?: string;
  pageParameters?: Values;
  /**
   * if true, then the current page is not deleted, and saved on a stack
   */
  retainCurrentPage?: boolean;
  /**
   * new page is rendered as modal on the current page.
   */
  asModal?: boolean;
  /**
   * whether existing pages on the stack are to be deleted
   */
  erasePagesOnTheStack?: boolean;
};

/**
 * how to render a value, generally as a column in a table, but also can be used to render as a field
 */
export type ColumnDetails = {
  /**
   * name by which the values are available in a row
   */
  name: string;
  /**
   * header label to be used
   */
  label: string;
  /**
   * value type helps is rendering, specifically, numbers may have to be right-justified
   */
  valueType: ValueType;
  /**
   * way to render the value. this is the name of a pre-defined formatter
   */
  valueFormatter?: string;

  /**
   * In case the value is internal, and a suitable label/text is to be rendered.
   * On the lines of a drop-down field. Map of internal value to the text to be rendered
   */
  valueList?: StringMap<string>;

  /**
   * action to be taken when user clicks on this value
   */
  onClick?: string;

  /**
   * very special case where this is not a field, but is a static view-component to be rendered, not a text to be rendered
   */
  comp?: StaticComp | Button;
};
