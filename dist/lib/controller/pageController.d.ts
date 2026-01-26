import { FieldView, PageView, Value, Vo, Values, StringMap, PageController, AppController, FormController, DetailedMessage, FnStatus, Action, AnyValue, SimpleList, KeyedList, FormOperation, ServiceRequestOptions } from '@simplity';
export declare class PC implements PageController {
    readonly ac: AppController;
    readonly name: string;
    /**
     * controller for the root form.
     */
    readonly fc: FormController;
    /**
     * meta data for this page
     */
    private readonly page;
    /**
     * page class/component associated with this service
     */
    private readonly pageView;
    private readonly buttonsToDisplay;
    /**
     * relevant if forSave is true.
     * true if the page is invoked with keys, and hence we are updating
     */
    private saveIsUpdate;
    /**
     * title of the page may have dynamic content (field) in that.
     * this field has the calculated string, based on current values
     */
    private currentTitle;
    /**
     * set to true if user changes any field value
     */
    private isModified;
    /**
     * values that are set at run time at the page-context.
     * this context is checked for preparing the payload using params.
     */
    private values;
    /**
     * runtime actions are triggered by view components that may be created at run time, needing onclick-action.
     */
    private readonly functions;
    private readonly actions;
    private readonly lists;
    private popupIsActive;
    /**
     * if a popup is shown with managed-close, this has the action to be triggered on close
     */
    private onPopdown;
    /**
     * parameters to be used when popdown action is triggered
     */
    private popdownParams;
    constructor(ac: AppController, pageView: PageView);
    pageRendered(): void;
    pageLoaded(): void;
    getFormController(): FormController;
    setVariable(name: string, value: AnyValue | Vo): void;
    getVariable(name: string): AnyValue | Vo | undefined;
    setModifiedStatus(isModified: boolean): void;
    isValid(): boolean;
    /**
     *
     * @param messages
     */
    showMessages(messages: DetailedMessage[]): void;
    getList(control: FieldView, key?: string | number | undefined): void;
    formOk(formName: string | undefined, operation: FormOperation, messages: DetailedMessage[]): boolean;
    requestService(serviceName: string, options?: ServiceRequestOptions): void;
    /**
     * to be called by a run-time app-specific function.
     * This feature is designed to cater to a situation where the details of an action can not be specified at design time.
     * @param action
     * @param controller defaults to the root form controller.
     * A child-form-controller may be passed in case some field values are to be taken from that form as part of this action.
     * @param params
     */
    takeAction(action: Action, controller?: FormController, additionalParams?: StringMap<unknown>): void;
    act(actionName: string, controller?: FormController, additionalParams?: StringMap<unknown>): void;
    addList(name: string, list: SimpleList | KeyedList): void;
    addFunction(name: string, fn: () => unknown): void;
    getFieldValue(qualifiedName: string): Value | undefined;
    callFunction(name: string, params?: StringMap<unknown>, msgs?: DetailedMessage[], controller?: FormController): FnStatus;
    private setButtonDisplays;
    private checkTitle;
    private serve;
    /**
     * IMP: code within this class must call this, and not the public method
     * actions can be chained with onSuccess and onFailure etc..
     * This may lead to infinite loops.
     * This is designed to detect any such loop and throw error, rather than getting a activeActions-over-flow
     */
    private doAct;
    private doReset;
    private doDisplay;
    private doSetters;
    private doPopup;
    private doPopdown;
    /**
     * to be called when the user closes a popup with managed-close
     */
    popupClosed(): void;
    private doFn;
    private tryToServe;
    /**
     *
     * @param name may be of the form ${run-time-name}
     */
    private getAction;
    setDisplayState(compName: string, settings: Values): void;
    private getTableParts;
    /**
     * an async action has returned. We have to continue the possible action-chain
     * @param action
     * @param ok //if the action succeeded
     * @param activeActions
     */
    private actionReturned;
    private navigate;
    /**
     *
     * @param action
     * @param p
     * @param callback
     * @returns nextAction to be taken without waiting for thr form-service to return
     * undefined in case of any error in submitting the form..
     */
    private doFormAction;
    private getFilterData;
    private getValueOf;
    private setValueTo;
    private getControllerByType;
    /**
     * If the value is of the pattern ${fieldName}, get the value of that field-name.
     * else return the value as it is
     * @param value as specified at design time.
     * @param fc: form controller that has values for the relevant fields
     * @returns
     */
    private substituteValue;
    /**
     * //TODO we have to validate the fields
     * @param values
     * @returns
     */
    private toFilters;
    private getConditions;
    /**
     * get the value for the filter-field.
     * if the supplied value is undefined, it means that the value must be taken from fc.
     * If it is of the form ${fieldName}, it means that the value must be taken for this field-name
     * otherwise the value is taken as it is.
     * @param fieldName name of the field on which the condition is to be put for filtering
     * @param value as specified at design time.
     * @param fc: form controller that has values for the relevant fields
     * @returns
     */
    private getFilterValue;
    private getDataInput;
}
