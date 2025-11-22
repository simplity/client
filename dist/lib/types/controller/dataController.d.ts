import { FilterCondition, SortBy, StringMap, Value, Values, Vo } from '../common';
import { BaseView, ChartView, TableEditorView, TableViewerView } from '../view';
import { Form, Panel, EventName } from '../design';
import { PageController } from './';
import { DetailedMessage } from '../agent';
/**
 * base interface to be implemented by the form/table controllers
 */
export interface DataController {
    readonly name: string;
    readonly pc: PageController;
    readonly type: 'form' | 'table' | 'grid' | 'chart';
    /**
     * set/change display state of a field
     * @param compName field/component name
     * @param settings name-value pairs of setting values
     *
     * @returns true if the comp exists in this controller, false otherwise
     */
    setDisplayState(compName: string, settings: Values): boolean;
    /**
     * name of the form that defines the fields for the corresponding columns of this table
     */
    getFormName(): string | undefined;
    /**
     * data is received. typically from the server.
     * @param data common signature, but individual controllers need either an array or a VO
     * @param childName if this data is meant for a child controller
     */
    receiveData(data: Vo | Vo[], childName?: string): void;
    /**
     * For a tabular data, this is the new data to be used.
     * For a form, this is incremental data for its fields.
     * That is, fields for which data is not received will continue to have their current value.
     * @param data
     */
    setData(data: Vo | Vo[]): void;
    /**
     * reset data in a form
     * @param fields reset only the specified fields
     */
    resetData(fields?: string[]): void;
    /**
     * get the data. For a non-editable controller, this returns the data that was received or set
     */
    getData(): Vo | Vo[];
    /**
     * did the user edit any value in this form?
     */
    isModified(): boolean;
    /**
     * editable table must over-ride this
     */
    isValid(): boolean;
    /**
     * validate all editable components again
     * @returns true is all editable components are valid. false otherwise
     */
    validate(): boolean;
}
export interface ChartController extends DataController {
    readonly type: 'chart';
}
export interface TableViewerController extends DataController {
    readonly type: 'table';
    /**
     * get the data for this table
     */
    getData(): Vo[];
    /**
     * return the data associated with the specified row.
     *
     * @param rowIdx optional. defaults to current row.
     * @returns undefined if there is no data with the specified row index
     */
    getRowData(rowIdx?: number): Vo | undefined;
    /**
     * user has clicked on a row.
     * this event is NOT triggered if the table has any clickable column.
     * 0-based index of the row in the data-array
     * @param rowIdx
     */
    rowClicked(rowIdx: number): void;
    /**
     * user has clicked on a clickable cell.
     * this event is triggered if the column has an onClick action
     * 0-based index of the row in the data-array
     * @param rowIdx
     * @param action associated with the column that was clicked (onClick="action")
     */
    cellClicked(rowIdx: number, action: string): void;
    /**
     * show only rows with the searched text. This is case-insensitive
     *
     * @param text empty string to reset and show all rows
     */
    quickSearch(text: string): void;
    /**
     * get the Panel to be rendered as a Configuration panel for the TableViewer that the TableViewerCOntroller controls
     */
    createConfig(): {
        panel: Panel;
        fc: FormController;
    };
    /**
     * called from view-component after the list config panel is rendered
     */
    configRendered(): void;
    /**
     * user has changed the columns.
     * re-render with this sequence of columns
     *
     * @param names skipped if selection has to be just reset to defaults
     */
    resetColumns(names?: string[]): void;
}
export type tableDisplaySettings = {
    /**
     * array of columns names to be rendered.
     * Default is to render all columns as per design-time sequence
     */
    renderedColumns?: string[];
    /**
     * quick-search text. filter rows with any one column that contains the search text
     */
    quickSearchText?: string;
    /**
     * sort rows based on the field values
     */
    sortBy?: SortBy[];
    /**
     * fil
     */
    filters?: FilterCondition[];
};
/**
 * controls an editable tabular data (rows and columns)
 */
export interface TableEditorController extends DataController {
    readonly type: 'grid';
    getData(): Vo[];
    /**
     * user has clicked on a row.
     * this event is NOT triggered if the table has any clickable column.
     * 0-based index of the row in the data-array
     * @param roIdx
     */
    rowClicked(roIdx: number): void;
    /**
     * appends a row to the table and returns the 0-based index of the appended row
     * @param values skip this to append an empty row
     */
    appendRow(values?: Values): number;
    /**
     * set the display state for an entire column
     * @param columnName column name
     * @param stateName
     * @param stateValue appropriate value for the state
     */
    setColumnDisplayState(columnName: string, stateName: string, stateValue: string | number | boolean): void;
    /**
     * set the display state for an entire column
     * @param columnName column name
     * @param stateName
     * @param stateValue appropriate value for the state
     * @param rowId: omitted to apply this to the current row
     */
    setCellDisplayState(columnName: string, stateName: string, stateValue: string | number | boolean, rowId?: number): void;
    /**
     *
     * @param names
     * @param rowId
     */
    getColumnValues(names: string[], rowId: number): Values;
    /**
     *
     * @param values
     * @param rowId
     */
    setColumnValues(values: Values, rowId: number): void;
}
/**
 * form controller manages the MVC aspect of all editable controls.
 * it also wires commands to change teh way view-components are rendered to the right component
 * every view component belongs to a FC, and are supplied this instance for their constructors
 */
export interface FormController extends DataController {
    readonly type: 'form';
    /**
     * form controller always returns a Vo;
     */
    getData(): Vo;
    /**
     * to be used by the child component to register itself as a child of this controller
     * @param view
     */
    registerChild(view: BaseView): void;
    /**
     * invoked after all the child elements of the last tabGroup are rendered
     * beginOfTabGroup occurs when a registerChild() occurs for that tabGroup
     */
    endOfTabGroup(): void;
    /**
     * invoked after all the child elements of the last tab are rendered
     * beginOfTab occurs when a registerChild() occurs for that tab
     */
    endOfTab(): void;
    /**
     * all children rendered. This is invoked after all child controls complete their rendering
     */
    formRendered(): void;
    /**
     * This form has a table-viewer, and the tableViewer is just being constructed.
     * Note that the view-component calls this method inside of its constructor, but before rendering the view.
     * @param view
     */
    newTableViewerController(view: TableViewerView): TableViewerController;
    /**
     * called by a chart-view inside its constructor, but before the chart is rendered
     * @param view
     */
    newChartController(view: ChartView): ChartController;
    /**
     * This form has a table-editor, and the tableViewer is just being constructed.
     * Note that the view calls this method inside of its constructor, but before rendering the view.
     * @param view
     */
    newTableEditorController(view: TableEditorView): TableEditorController;
    /**
     * This form has a sub-form., and the tableViewer is just being constructed.
     * Note that the view calls this method inside of its constructor, but before rendering the view.
     * @param view
     */
    newFormController(name: string, form?: Form, data?: Vo): FormController;
    /**
     * get the named child controller. It may be a direct child or may be somewhere in the hierarchy
     * @param name
     */
    getController(name: string): DataController | undefined;
    /**
     * ensures that the supplied action is triggered when the event is fired by the specified node
     * @param nodeName on which to listen to for the event
     * @param eventName
     * @param eventFn what to do. can be an actual function, or the name of a registered function
     */
    addEventListener(nodeName: string, eventName: EventName, 
    /**
     * can be either an action-name or a call-back function
     */
    eventFn: EventHandler | string): void;
    /**
     * extract data for the specified fields
     * @param params name-isRequired map of fields to be extracted
     * @param messages error messages if any, are added to this array
     */
    extractData(params: StringMap<boolean>, messages: DetailedMessage[]): Vo | undefined;
    /**
     * extract key-field values.
     *
     * @param messages if any of the key fields are missing in action, a suitable message is added
     * @returns empty object if the controller has no forms, or if the form has no keys. (this condition is not considered to be an error)
     * undefined if value is not found for any of the key fields (an error message would have been added to messages)
     */
    extractKeys(messages: DetailedMessage[]): Values | undefined;
    /**
     *
     * @param fieldName name of the field for which value is required
     * @returns value to be set to the field.
     */
    setFieldValue(fieldName: string, value: Value): void;
    /**
     *
     * @param fieldName name of the field for which value is required
     * @returns value or undefined if this field has no value/not part of this form
     */
    getFieldValue(fieldName: string): Value | undefined;
    /**
     * get all the child views of this form.
     * @returns  all the child views of this form
     */
    getChildren(): StringMap<BaseView>;
    /**
     * get a view that is managed by this controller.
     * @param name to be retrieved.
     * @returns  undefined if no child with this name exists for this controller
     */
    getChild(name: string): BaseView | undefined;
    /**
     * A page keeps a status to know if the user has modified any data.
     * This information is used to enable/disable action buttons, or warn user on any exits
     * @param isModified true to assume that the form is modified. false to assume no changes to the form
     */
    setModifiedStatus(isModified: boolean): void;
    /**
     * true if this form has not defined any keys, or if all the defined key fields have values
     */
    hasKeyValues(): boolean;
    /**
     * called by a child-field when user has changed its value (not called while changing)
     * @param fieldName
     * @param newValue empty-string if the entered value is invalid, or no value is entered.
     * @param newValidity
     */
    valueHasChanged(fieldName: string, newValue: Value, newValidity?: boolean): void;
    /**
     * called by a child-field when user is still typing (in the process of changing)
     * @param fieldName
     * @param newValue empty-string if the entered value is invalid, or no value is entered.
     * @param newValidity true/false
     * @returns
     */
    valueIsChanging(fieldName: string, newValue: Value, newValidity?: boolean): void;
    /**
     * execute an action with this form-controller as the context
     * @param actionName
     * @param params depends on the type of action and the context.
     */
    act(actionName: string, params?: StringMap<any>): void;
    /**
     * a child is reporting an event. any handler that was added using addEventLister will be called for this event
     * @param eventDetails
     */
    eventOccurred(eventDetails: EventDetails): void;
}
/**
 * function (generally an arrow function) that is called back when the event triggers
 */
export type EventHandler = (details: EventDetails) => void;
/**
 * details of an event that is passed to the controller to handle
 */
export type EventDetails = {
    /** unique  name of the control that triggered this */
    viewName: string;
    eventName: EventName;
    /**
     * view that triggered this
     */
    view: BaseView;
    /**
     * form control associated with this event
     * certainly populated if this is passed to the run-time event function
     */
    fc: FormController;
    /**
     * for changing and changed events
     */
    newValue?: Value;
    /**
     * for changing and changed events
     */
    newValidity?: boolean;
    /**
     * any event-specific parameters
     */
    params?: Values;
};
