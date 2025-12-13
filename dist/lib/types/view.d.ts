/**
 * All the view components that are used to render the app-design components
 *
 * NOTE: There will be cross-references between view components and controllers.
 * e.g. a FieldView will have a reference to its FormController, and the FormController will have references to all its FieldViews
 * This is OK as long as we do not try to serialize these objects.
 * Controllers are in src/lib/controller and view components are in src/lib/view
 * The app-specific implementations of these interfaces are in app/client/src/viewComponents and app/client/src/controllers respectively
 */
import { Alert, StringMap, Value, Values } from './common';
import { AppController, ChartController, FormController, PageController, TableViewerController } from './controller';
import { Button, Chart, DataField, MultiReportPanel, NavigationOptions, Page, BaseComponent, Panel, SimpleList, StaticComp, Tab, TableEditor, TableViewer, Tabs } from './design';
export type View = object;
/**
 * An App-view is the outer most container component inside of which the relevant view components are laid out
 */
export interface AppView {
    /**
     * Renders the application view. Must be called once after the constructor
     * @param ac app controller
     * @param startinglayout layout to be rendered
     * @param startingModule module to be rendered
     */
    render(ac: AppController, startinglayout: string, startingModule: string): void;
    /**
     * disable user interaction.
     * Typically used during page loads/updates
     * Caller MUST ensure that a subsequent call is made to enableUx()
     * @param displayText optional text to be shown to the user while UX is disabled
     */
    disableUx(displayText?: string): void;
    /**
     * enable user interaction. Caller should have invoked  disable() earlier
     * Typically used during page loads/updates
     * @param force to be used in case of some issue during async functions that a matched disable/enable are not working
     */
    enableUx(force?: boolean): void;
    /**
     * show messages as per the chosen design to show/flash message in a non-intrusive way
     * @param alerts
     */
    showAlerts(alerts: Alert[]): void;
    /**
     * Show a message/question to get user's response/choice
     * @param text message text to be shown
     * @param choices options to be shown as buttons to choose from
     * @returns 0-based index of the option chosen by the user
     */
    getUserChoice(text: string, choices: string[]): Promise<number>;
    /**
     * navigate to the desired page based on the details in this action
     * @param options page and other details
     */
    navigate(options: NavigationOptions): void;
    /**
     * close the current page. It is an error to try to close the current page if the page stack is empty
     */
    closePage(): void;
    /**
     * It is possible that a layout shows the page title outside of the page area.
     * this method is to be called to set the title. Note that this is NOT the title of the window
     * @param title
     */
    renderPageTitle(title: string): void;
    /**
     * layout may display some details like logged-in user etc..
     * @param values
     */
    renderContextValues(values: StringMap<string>): void;
}
/**
 * A view component that renders menu groups.
 * A menu group has a list of Menu Items
 */
/**
 * menu item is a clickable component that typically navigates the user to a specific page
 * a menu item may be rendered in more than one groups
 */
/**
 * Page View. Represents the view-component for a rendered page.
 */
export interface PageView {
    /**
     * meta data for this page
     */
    readonly page: Page;
    /**
     * run time parameters passed to this page
     */
    readonly inputs: Values;
    /**
     * whether the page buttons are to be rendered or hidden
     * @param show true to show and false to hide
     * @returns
     */
    showButtons(toShow: boolean): void;
    /**
     * invoked after this page view is integrated with the layout.
     * e.g. in html, this is called after the view is appended to the DOM.
     */
    pageLoaded(): void;
    /**
     * release any resources held by this page view
     */
    dispose(): void;
}
/**
 * Abstract/Base Control (a view-component that is part of a page)
 */
export interface BaseView {
    readonly name: string;
    readonly comp: BaseComponent;
    readonly initInfo: StringMap<unknown>;
    readonly ac: AppController;
    readonly pc: PageController;
    /**
     * set/reset an error message with this view-component. this
     *
     * @param error undefined means reset/remove any existing error message
     */
    setError(error: string | undefined): void;
    /**
     * A view-component may have certain display-states, like hidden etc..
     * To keep the concerns separated, view component should delegate the actual rendering to its rendering layer
     * for example, in HTML this would be with a style="display:none".
     * however, the view component MUST not do this. Instead it should delegate the "how" part to the last mile component
     * thi can be done by setting a custom attribute like "data-hidden"
     *
     * @param settings name-value pairs of setting values
     */
    setDisplayState(settings: Values): void;
    /**
     * release any resources held by this view component
     */
    dispose(): void;
}
/**
 * controls that do not contain other controls
 */
export type LeafView = FieldView | ButtonView | StaticView;
export type ContainerView = PanelView | TableViewerView | TableEditorView | ChartView | TabsView;
/**
 * Field is a view control that is bound to a run-time data-element.
 * It may or may not be editable.
 */
export interface FieldView extends BaseView {
    /**
     * meta data for this button
     */
    readonly field: DataField;
    /**
     * value is coming from the top.
     * It is not invoked when the data is changed by the UX.
     * The value is to be set, and if required, to be propagated to the view.
     * @param value value
     */
    setValue(value: Value): void;
    /**
     * get the validation status of the field as updated when it was changed last.
     * a validation is not forced.
     * @returns true if this field is valid as of now. false otherwise.
     */
    isValid(): boolean;
    /**
     * force a fresh validation. This may be required if the validation may depend on things outside of the field value
     */
    validate(): boolean;
    /**
     * relevant if the field requires a list of enumerated values.
     * ignored with a warning if the control does not use a list of values
     * @param list list of valid options.
     */
    setList(list: SimpleList): void;
    /**
     * get the current value
     */
    getValue(): Value;
}
/**
 * A clickable button for user to ask for some action
 */
export interface ButtonView extends BaseView {
    /**
     * meta data for this button
     */
    readonly button: Button;
}
/**
 * A leaf control that is not bound to any data, but not a button
 */
export interface StaticView extends BaseView {
    /**
     * meta data for this button
     */
    readonly staticComp: StaticComp;
}
/**
 * panel is a container to render its child controls
 * it is a view component, and not a control, but is named that way for conformity with other similar components
 */
export interface PanelView extends BaseView {
    readonly panel: Panel;
    /**
     * in case this panel is associated with a child-form
     */
    readonly childFc?: FormController;
}
/**
 * Objective of this panel is to decide and render a report at run time, rather than render all of them at design time, and then hide/show
 * at least two child-reports are expected.
 * No report is rendered at the time of loading the page.
 * Only when the data is received, the relevant panel is initially rendered, and then bound to data.
 * The current report, if any, is destroyed.
 *
 */
export interface MultiReportPanelView extends BaseView {
    readonly panel: MultiReportPanel;
    currentReport?: CurrentReport;
    /**
     * remove all rendered rows. Header, if any, is to be retained.
     */
    reset(): void;
    /**
     * render required rows for the incoming data-rows.
     * @param data
     * @param selectedNames if this is a configurable table, then this is required
     */
    renderData(reportName: string, data: Values[], selectedNames?: string[]): void;
}
/**
 * current report that is rendered in a multi-report panel
 */
export type CurrentReport = {
    name: string;
    twc: TableViewerController;
    fc: FormController;
    table: TableViewer;
};
/**
 * Tab is a panel that is a direct child of a tabsGroup.
 */
export interface TabView extends BaseView {
    readonly tab: Tab;
}
/**
 * table renders tabular data, but does not allow any edits to the columns.
 * It can optionally have the facility to select a subset of rows.
 */
export interface TableViewerView extends BaseView {
    /**
     * A table viewer view MUST create a TableViewerController, by calling fc.newTableViewerController()
     */
    readonly twc: TableViewerController;
    readonly fc: FormController;
    readonly table: TableViewer;
    /**
     * remove all rendered rows. Header, if any, is to be retained.
     */
    reset(): void;
    /**
     * render required rows for the incoming data-rows.
     * @param data
     * @param selectedNames if this is a configurable table, then this is required
     */
    renderData(data: Values[], selectedNames?: string[]): void;
}
/**
 * table renders tabular data, but does not allow any edits to the columns.
 * It can optionally have the facility to select a subset of rows.
 */
export interface TableEditorView extends BaseView {
    readonly table: TableEditor;
    /**
     * remove all rendered rows.
     */
    reset(): void;
    /**
     * append on row to the view
     * @param fc form controller that manages this row
     * @param rowIdx 0-based row index with which the row is to be marked with
     * @param values optional initial values for the fields.
     * If not specified, the defaultValue, if specified for that field, will be used as the initial value for a field
     */
    appendRow(fc: FormController, rowIdx: number, values?: Values): void;
}
/**
 * Chart renders tabular data in a graphical format like bar, pie, line, etc..
 */
export interface ChartView extends BaseView {
    /**
     * A table viewer view MUST create a TableViewerController, by calling fc.newTableViewerController()
     */
    readonly cc: ChartController;
    readonly fc: FormController;
    readonly chart: Chart;
    /**
     * remove all rendered rows. Header, if any, is to be retained.
     */
    reset(): void;
    /**
     * render required rows for the incoming data-rows.
     * @param data
     * @param selectedNames if this is a configurable table, then this is required
     */
    renderData(data: Values[], selectedNames?: string[]): void;
}
/**
 * tab group is the container for tabs
 */
export interface TabsView extends BaseView {
    readonly tabs: Tabs;
    /**
     * set error status of a all tabs
     * @param errors must be of the right length for he tabs
     */
    setTabErrorStatus(errors: boolean[]): void;
}
/**
 * a function that creates an instance of a View-Component for the page-component that is supplied as input.
 * this is an app-specific implementation of the corresponding view-component.
 * This function is used instead of the standard simplity function if a page-component specifies pluginOption attribute
 */
export type ViewComponentFactory = {
    /**
     * an option to create an app-specific view component for this component.
     * @param pc
     * @param fc
     * @param comp
     * @param maxWidth
     * @param value
     * @returns an app-specific view component instance, or undefined
     */
    newViewComponent(pc: PageController, fc: FormController | undefined, comp: BaseComponent, maxWidth: number, value?: Value): BaseView | undefined;
};
