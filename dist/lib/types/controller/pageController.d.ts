import { FieldView } from '../view';
import { Vo, AnyValue, Values, StringMap, Value } from '../common';
import { AppController, FnStatus, FormController } from './';
import { Action, FormOperation, KeyedList, SimpleList } from '../design';
import { DetailedMessage, FilterParams } from '../agent';
/**
 * options for a service request
 */
export type ServiceRequestOptions = {
    /**
     * pay load MUST be as per the input specification for the service.
     */
    payload?: Vo;
    /**
     * form control that should receive the response.
     * default is the form control associated with the page
     */
    fc?: FormController;
    /**
     * if the response is meant for a table inside this form.
     * it is to be noted that the response may contain the the tabular data with a generic name "list"
     * that is, the response could be {list:[....]} or {childNAme: [....]}
     */
    targetPanelName?: string;
    /**
     * arrow function to be called back with the response.
     * Page controller does not process the response, but simply passes it to this arrow function
     * @param response
     * @returns
     */
    callback?: (response: Vo | undefined) => void;
};
/**
 * Main controller that keeps the data model and the view in synch.
 * to be provided by page-component
 * injected into any component that needs communicate with the page at run time
 */
export interface PageController {
    readonly name: string;
    readonly ac: AppController;
    readonly fc: FormController;
    /**
     * called by the view component after the it renders itself, and all its children.
     * It is possible that the page view is still not attached/appended to its parent view element at this point.
     * Refer to pageLoaded() for the next event.
     *
     */
    pageRendered(): void;
    /**
     * To be called by the view component after the view is made part of the top-level view component.
     * Typically this happens after all rendering completes.
     * This is very similar to document.onLoad() in a paradigm when a new document is created for each page.
     */
    pageLoaded(): void;
    getFormController(): FormController;
    /**
     * facility to set a value for a run-time-variable by any function that stays for the rest of the duration of this page.
     * This can be used to set some state-attributes that the functions may require across their invocations
     * @param variable
     * @param value
     */
    setVariable(variable: string, value: AnyValue | Vo): void;
    /**
     *
     * @param variable
     * @returns value that was set earlier with a call to setVariable(). undefined if it was not set.
     */
    getVariable(variable: string): AnyValue | Vo | undefined;
    /**
     * get value of a field
     * @param qualifiedName if the field is defined in the root form, this this is a simple name. Otherwise it is panelName.fieldName etc..
     */
    getFieldValue(qualifiedName: string): Value | undefined;
    /**
     * A page keeps a status to know if the user has modified any data.
     * This information is used to enable/disable action buttons, or warn user on any exits
     * @param isModified true to assume that the form is modified. false to assume no changes to the form
     */
    setModifiedStatus(isModified: boolean): void;
    /**
     * is this page valid?
     */
    isValid(): boolean;
    /**
     * arrange to get value list for this control as data for its drop-down,
     * and assign it when the value-list arrives
     * @param control to which the value list is to be set using setList()
     * @param key
     */
    getList(control: FieldView, key?: string | number | undefined): void;
    /**
     * Request a service. To be used only if this is better than design-time features for service request are not suitable
     * Response from the service, by default is used as data for this page, and the data is received as per convention.
     * If this is what is desired, no callback function should be specified.
     * If callback is specified, then the data is NOT set to this page. It is left to the callback to whatever it wants to do with the response-data.
     *
     * @param serviceName
     * @param options as per the input specification for the service being requested
     */
    requestService(serviceName: string, options?: ServiceRequestOptions): void;
    /**
     * ths is used by run-time code with an action created at run time, rather than an action that was known at design-time
     * @param action
     * @param fc undefined if this action is not associated with a specific data controller
     * @param params depends on the type of action and the context.
     */
    act(actionName: string, fc?: FormController, params?: StringMap<unknown>): void;
    /**
     * execute an action with form-data/form-controller as the context
     * @param actionName
     * @param fc undefined if this action is not associated with a specific data controller
     * @param params depends on the type of action and the context.
     */
    takeAction(action: Action, fc?: FormController, params?: StringMap<unknown>): void;
    /**
     * feature to add drop-down list at run time as a local list. (not going to the server)
     * e.g. the field-list in list-configuration panel
     * @param name
     * @param list
     */
    addList(name: string, list: SimpleList | KeyedList): void;
    /**
     * add a function at run time. To be used only if a design-time function is not feasible.
     * This can also be used in special cases where we have to override a design-time function.
     * Note that this function is invoked with no parameters, and the returned value is discarded.
     * @param action
     */
    addFunction(name: string, fn: () => unknown): void;
    /**
     * @param formName on which operation is to be requested
     * @param operation
     * @param messages an error message is added if an empty error message is returned
     * @returns service name for this operation.
     * empty string if this controller has no form, or the operation is not valid for the form
     */
    getServiceName(formName: string, operation: FormOperation, messages: DetailedMessage[]): string;
    /**
     * call/execute a function that is defined by the meta data in this page.
     * this function is expected to be called for what it does, not not for what it returns.
     * the returned value is not
     * @param functionName
     * @param additionalParams to be passed to the function
     * @param msgs array of messages to which messages could be added while locating and executing the function
     * @returns status of function call.
     */
    callFunction(nam: string, additionalParams?: StringMap<unknown>, msgs?: DetailedMessage[]): FnStatus;
    /**
     * set/change display state of a component
     * @param compName field/component name
     * @param settings name-value pairs of setting values
     *
     */
    setDisplayState(compName: string, settings: Values): void;
}
/**
 * VO as response from getReportSettings service
 */
export type ReportServiceResponse = {
    list: {
        variantName: string;
        settings: ReportSettings;
    }[];
};
/**
 * same as filterParams, but all attributes are mandatory
 */
export type ReportSettings = Required<FilterParams>;
