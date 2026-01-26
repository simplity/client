import { logger } from '../logger';
import { FC } from './formController';
import { conventions } from 'lib/conventions';
const FORM_NAME = 'ROOT';
const FIELD_REGEX = /^\${.+}$/;
export class PC {
    ac;
    // ///////// attributes that are non-state : they are immutable
    name;
    /**
     * controller for the root form.
     */
    fc;
    /**
     * meta data for this page
     */
    page;
    /**
     * page class/component associated with this service
     */
    pageView;
    buttonsToDisplay = [];
    /**
     * relevant if forSave is true.
     * true if the page is invoked with keys, and hence we are updating
     */
    saveIsUpdate = false;
    // //////////// State (mutable) attributes
    /**
     * title of the page may have dynamic content (field) in that.
     * this field has the calculated string, based on current values
     */
    currentTitle;
    /**
     * set to true if user changes any field value
     */
    isModified = false;
    /**
     * values that are set at run time at the page-context.
     * this context is checked for preparing the payload using params.
     */
    values = {};
    /**
     * runtime actions are triggered by view components that may be created at run time, needing onclick-action.
     */
    functions = {};
    actions = {};
    lists = {};
    popupIsActive = false;
    /**
     * if a popup is shown with managed-close, this has the action to be triggered on close
     */
    onPopdown = undefined;
    /**
     * parameters to be used when popdown action is triggered
     */
    popdownParams = undefined;
    constructor(ac, pageView) {
        this.ac = ac;
        this.pageView = pageView;
        this.page = pageView.page;
        /**
         * we make a copy of actions because we may add actions dynamically
         */
        if (this.page.actions) {
            this.actions = { ...this.page.actions };
        }
        this.name = this.page.name;
        let form = undefined;
        const formName = this.page.formName;
        if (formName) {
            form = this.ac.getForm(formName);
        }
        this.fc = new FC(FORM_NAME, this, form);
    }
    pageRendered() {
        this.ac.hideAlerts();
        this.fc.formRendered();
        //we may have to enable/disable buttons
        this.setButtonDisplays(this.page.leftButtons);
        this.setButtonDisplays(this.page.rightButtons);
        this.setButtonDisplays(this.page.middleButtons);
    }
    pageLoaded() {
        logger.info(`page ${this.name}loaded`, this);
        /**
         * do we have input data for this page?
         */
        const expectedInputs = this.page.inputs;
        const inputNames = [];
        const inputValues = {};
        if (expectedInputs) {
            /**
             * assign input parameters into the page
             */
            const inp = this.pageView.inputs || {};
            for (const [key, isRequired] of Object.entries(expectedInputs)) {
                const val = inp[key];
                if (val !== undefined) {
                    inputValues[key] = val;
                    inputNames.push(key);
                }
                else if (isRequired && !this.page.inputIsForUpdate) {
                    throw this.ac.newError(`Input value missing for parameter ${key} for page ${this.name}`);
                }
            }
        }
        if (inputNames.length) {
            this.fc.setData(inputValues);
            if (this.page.inputIsForUpdate) {
                /**
                 * it is possible that some parent field is also sent along with key fields.
                 * in such a case, it is update if all fields are recd.
                 */
                const keysReceived = this.fc.hasKeyValues();
                if (keysReceived) {
                    this.saveIsUpdate = keysReceived;
                }
                else {
                    logger.warn(`Not all key values received for update on page ${this.name}. Page is assumed to be for "new" operation.`);
                }
            }
        }
        if (this.page.onLoadActions) {
            if (this.page.inputIsForUpdate && inputNames.length === 0) {
                // onload is meant only for update mode. onload not triggered if this is not for update but "save" or "new"
            }
            else {
                for (const actionName of this.page.onLoadActions) {
                    console.info(`Onload action ${actionName} being initiated`);
                    this.act(actionName, this.fc, undefined);
                }
            }
        }
        this.checkTitle();
    }
    getFormController() {
        return this.fc;
    }
    setVariable(name, value) {
        this.values[name] = value;
    }
    getVariable(name) {
        return this.values[name];
    }
    setModifiedStatus(isModified) {
        this.isModified = isModified;
    }
    isValid() {
        return this.fc.isValid();
    }
    /**
     *
     * @param messages
     */
    showMessages(messages) {
        if (!messages.length) {
            return;
        }
        const alerts = [];
        for (const msg of messages) {
            const text = this.ac.getMessage(msg.id, msg.params, msg.text);
            alerts.push({ type: msg.type, text: text });
        }
        this.ac.showAlerts(alerts);
    }
    getList(control, key) {
        const listName = control.field.listName;
        if (!listName) {
            logger.warn(`Control ${control.name} does not have listName, but a list is requested for it. Request ignored`);
            return;
        }
        const localList = this.lists[listName];
        if (localList) {
            const isSimple = Array.isArray(localList);
            let list = [];
            if (isSimple) {
                list = localList;
            }
            else {
                if (key !== undefined) {
                    list = localList[key] || [];
                }
                else {
                    logger.error(`List ${listName} is a keyed list but no key value is specified while requesting this list for control "${control.name}" `);
                }
            }
            control.setList(list);
            return;
        }
        this.ac.getList(listName, false, key).then((list) => {
            control.setList(list);
        });
    }
    formOk(formName, operation, messages) {
        if (!formName) {
            addMessage(`Form controller ${this.name} is not associated with a form. Can not do form based service`, messages);
            return false;
        }
        const form = this.ac.getForm(formName);
        const ops = form.operations;
        if (!ops) {
            addMessage(`Form ${form.name} is not designed for any form operation. Can not do form based service`, messages);
            return false;
        }
        //TODO: check for guest access after generator is fixed
        //    if (!form.serveGuests) {
        //      if (!this.ac.getUser()) {
        //        addMessage(`User needs to login for this operation`, messages);
        //        return false;
        //      }
        //    }
        if (!ops[operation]) {
            addMessage(`operation '${operation}' is not allowed on the form ${this.name}`, messages);
            return false;
        }
        return true;
    }
    requestService(serviceName, options) {
        if (!options) {
            options = {};
        }
        const controller = options.fc || this.fc;
        this.ac.serve(serviceName, options.payload, false).then((resp) => {
            logger.info(`Service ${serviceName} returned.`, resp);
            //we have to show messages
            if (resp.messages) {
                this.showMessages(resp.messages);
            }
            const ok = resp.status === 'completed';
            if (ok) {
                const data = resp.data || {};
                if (options.callback) {
                    options.callback(data);
                }
                else {
                    controller.receiveData(data, options.targetPanelName);
                }
            }
        });
    }
    /**
     * to be called by a run-time app-specific function.
     * This feature is designed to cater to a situation where the details of an action can not be specified at design time.
     * @param action
     * @param controller defaults to the root form controller.
     * A child-form-controller may be passed in case some field values are to be taken from that form as part of this action.
     * @param params
     */
    takeAction(action, controller, additionalParams) {
        const ap = {
            msgs: [],
            fc: controller || this.fc,
            activeActions: {},
            additionalParams,
        };
        /**
         * actions may trigger other actions that may lead to infinite-loops.
         * we treat recursive call to the  same action as an infinite-loop.
         */
        this.doAct(action.name, ap, action);
    }
    act(actionName, controller, additionalParams) {
        /**
         * run time functions override design time actions.
         * Also, run time action is just a function, and has no feature for "before" or "after" action
         */
        const fn = this.functions[actionName];
        if (fn) {
            fn();
            return;
        }
        const ap = {
            msgs: [],
            fc: controller || this.fc,
            activeActions: {},
            additionalParams,
        };
        /**
         * actions may trigger other actions that may lead to infinite-loops.
         * we treat recursive call to the  same action as an infinite-loop.
         */
        this.doAct(actionName, ap);
    }
    addList(name, list) {
        this.lists[name] = list;
    }
    addFunction(name, fn) {
        this.functions[name] = fn;
    }
    getFieldValue(qualifiedName) {
        const parts = qualifiedName.split('.');
        const fieldName = parts.pop();
        let fc = this.fc;
        if (parts.length) {
            for (const part of parts) {
                const c = fc.getController(part);
                if (!c) {
                    logger.error(`No value could be determined for field '${qualifiedName}' because the sub-form '${part}' does not exist `);
                    return undefined;
                }
                if (c.type !== 'form') {
                    logger.error(`No value could be determined for field '${qualifiedName}' because the sub-form '${part}' is of type '${c.type}'. Sub forms must be of type 'form'`);
                    return undefined;
                }
                fc = c;
            }
        }
        const v = fc.getFieldValue(fieldName);
        if (v === undefined) {
            logger.error(`Field '${qualifiedName}' does not exist`);
        }
        return v;
    }
    callFunction(name, params, msgs, controller) {
        const entry = this.ac.getFn(name);
        const status = { allOk: false };
        if (!msgs) {
            msgs = [];
        }
        if (!entry) {
            addMessage(`function ${name} is not defined but is being requested`, msgs);
            return status;
        }
        let ret = undefined;
        const fnType = entry.type;
        try {
            status.allOk = true;
            switch (fnType) {
                case 'form':
                    if (controller) {
                        ret = entry.fn(controller, params, msgs);
                    }
                    else {
                        logger.warn(`function ${name} is of type "form" but is invoked with no data-controller. Root dc is assumed.`);
                        ret = entry.fn(this.fc, params, msgs);
                    }
                    break;
                case 'global':
                    ret = entry.fn(this.ac, params, msgs);
                    break;
                case 'page':
                    ret = entry.fn(this, params, msgs);
                    break;
                case 'field':
                    logger.warn(`function ${name} is a validation function, but is being called in a non-validation context in page ${this.name}`);
                    ret = entry.fn(params);
                    break;
                case 'request':
                case 'response':
                    addMessage(`function ${name} is defined with type="${fnType}".  It should not be invoked on its own. (It is used internally by the page controller with a serviceAction with which this function may be associated.)`, msgs);
                    break;
                default:
                    addMessage(`function ${name} is defined with type="${fnType}", but this type of function is not yet implemented.`, msgs);
                    break;
            }
        }
        catch (e) {
            let msg = `Error while calling function ${name}: `;
            if (e instanceof Error) {
                const err = e;
                console.error(err.stack);
                msg += err.message;
            }
            else {
                msg += e;
            }
            addMessage(msg, msgs);
            status.allOk = false;
        }
        status.returnedValue = ret;
        return status;
    }
    setButtonDisplays(buttons) {
        if (!buttons) {
            return;
        }
        for (const btn of buttons) {
            const enable = btn.enableWhen;
            if (!enable) {
                continue;
            }
            const control = this.fc.getChild(btn.name);
            if (!control) {
                continue;
            }
            this.buttonsToDisplay.push({
                button: control,
                show: enable === 'valid',
            });
        }
    }
    checkTitle() {
        let title = this.page.titlePrefix || '';
        if (this.page.titleField) {
            const val = this.fc.getFieldValue(this.page.titleField) || '  ';
            title += val; // it will come later?
        }
        if (this.page.titleSuffix) {
            title += this.page.titleSuffix;
        }
        if (title !== this.currentTitle) {
            this.currentTitle = title;
            this.ac.setPageTitle(title);
        }
    }
    async serve(serviceName, fc, data, targetChild, onResponseFn) {
        if (targetChild) {
            if (!this.fc.getController(targetChild)) {
                const text = `Service ${serviceName} is requested with a target table='${targetChild}', but no table is available with that name. service not requested.`;
                logger.error(text);
                this.showMessages([{ id: 'noTable', text, type: 'error' }]);
                return false;
            }
        }
        const reqAt = new Date().getTime();
        const resp = await this.ac.serve(serviceName, data, false); //we are handling disabling ux
        const respAt = new Date().getTime();
        logger.info(`Service '${serviceName}' returned after  ${respAt - reqAt}ms`, resp);
        if (onResponseFn) {
            logger.info(`Function ${onResponseFn} invoked to process the response`);
            const fnd = this.ac.getFn(onResponseFn, 'response');
            const fn = fnd.fn;
            fn(this, resp);
        }
        //we have to show messages
        if (resp.messages) {
            this.showMessages(resp.messages);
        }
        const ok = resp.status === 'completed';
        if (ok) {
            if (resp.data) {
                fc.receiveData(resp.data, targetChild);
            }
            const completedAt = new Date().getTime();
            logger.info(`It took ${completedAt - respAt}ms to render the data received from the service '${serviceName}' `);
        }
        return ok;
    }
    /**
     * IMP: code within this class must call this, and not the public method
     * actions can be chained with onSuccess and onFailure etc..
     * This may lead to infinite loops.
     * This is designed to detect any such loop and throw error, rather than getting a activeActions-over-flow
     */
    doAct(actionName, p, action) {
        if (!action) {
            action = this.getAction(actionName, p.fc);
        }
        let errorFound = false;
        const fcToUse = p.fc || this.fc;
        if (!action) {
            addMessage(`${actionName} is not defined as an action on this page but is requested by a component.`, p.msgs);
            errorFound = true;
        }
        else if (p.activeActions[actionName]) {
            addMessage(`Action ${actionName} started to chain of action links that is leading to a circular relationship.
            This may result in an infinite loop, and hence is not allowed`, p.msgs);
            errorFound = true;
        }
        if (errorFound || !action) {
            this.actionReturned(undefined, p);
            return;
        }
        p.activeActions[actionName] = true;
        if (action.toDisableUx) {
            this.ac.disableUx();
        }
        const actionType = action.type;
        let nextAction;
        switch (actionType) {
            case 'message':
                this.showMessages(action.messages);
                nextAction = action.nextAction;
                break;
            case 'close':
                //todo: any checks and balances?'
                this.ac.closePage();
                return;
            case 'reset':
                nextAction = this.doReset(action);
                break;
            case 'display':
                nextAction = this.doDisplay(action);
                break;
            case 'valueSetter':
                nextAction = this.doSetters(action, p);
                break;
            case 'popup':
                nextAction = this.doPopup(action, p);
                break;
            case 'popdown':
                nextAction = this.doPopdown(action);
                break;
            case 'function':
                nextAction = this.doFn(action, p, fcToUse);
                break;
            case 'form':
                if (this.doFormAction(action, p)) {
                    //async action was initiated successfully. action chining is handled there
                    return;
                }
                //got errors
                break;
            case 'navigation':
                this.navigate(action, p);
                //can not ask for another action after navigation
                break;
            case 'service':
                if (this.tryToServe(action, p, fcToUse)) {
                    //async action was initiated successfully. action chining is handled there
                    return;
                }
                //got errors
                break;
            default:
                addMessage(`${actionType} is an invalid action-type specified in action ${actionName}`, p.msgs);
                errorFound = true;
                break;
        }
        this.actionReturned(errorFound ? undefined : action, p, nextAction);
    }
    doReset(action) {
        let fc = this.fc;
        if (action.panelToReset) {
            const controller = this.fc.getController(action.panelToReset);
            if (!controller) {
                throw this.ac.newError(`No panel/table named ${action.panelToReset} or that panel is not associated with a child-form. Reset action aborted`);
            }
            fc = controller;
        }
        fc.resetData(action.fieldsToReset);
        return action.nextAction;
    }
    doDisplay(action) {
        for (const [compName, settings] of Object.entries(action.displaySettings)) {
            this.setDisplayState(compName, settings);
        }
        return action.nextAction;
    }
    doSetters(action, p) {
        for (const setter of action.setters) {
            const value = this.getValueOf(setter.value, p.fc || this.fc);
            if (value !== undefined) {
                this.setValueTo(setter.field, value, p.fc || this.fc);
            }
            else {
                logger.error(`ValueSetter action with setter = ${JSON.stringify(setter)} could not determine a value to set`);
            }
        }
        return action.nextAction;
    }
    doPopup(action, p) {
        if (this.popupIsActive) {
            throw this.ac.newError(`A popup is already active. Close the current popup before showing another one.`);
        }
        const name = action.panelName;
        const view = this.fc.getChild(name);
        if (!view) {
            throw this.ac.newError(`No panel named ${name} found to show as popup`);
        }
        this.ac.showAsPopup(view, action.closeMode);
        this.popupIsActive = true;
        if (action.closeMode === 'managed') {
            this.onPopdown = action.onClose;
            this.popdownParams = p;
        }
        else {
            this.onPopdown = undefined;
            this.popdownParams = undefined;
        }
        return action.nextAction;
    }
    //this is called if the call to popup is with manual-close
    doPopdown(action) {
        if (!this.popupIsActive) {
            throw this.ac.newError(`no popup is active to be closed.`);
        }
        if (this.popdownParams) {
            throw this.ac.newError(`Popup is active with managed-close. But a manual close was attempted.`);
        }
        this.ac.closePopup();
        this.popupIsActive = false;
        return action.nextAction;
    }
    /**
     * to be called when the user closes a popup with managed-close
     */
    popupClosed() {
        if (!this.popupIsActive) {
            throw this.ac.newError(`no popup is active to be closed, but popupClosed called.`);
        }
        if (!this.popdownParams) {
            throw this.ac.newError(`Popup is active with manual-close. But a managed-close was attempted.`);
        }
        //note that the view has already closed the popup and called us.
        this.popupIsActive = false;
        if (this.onPopdown) {
            const actionName = this.onPopdown;
            const p = this.popdownParams;
            this.onPopdown = undefined;
            this.popdownParams = undefined;
            this.doAct(actionName, p);
        }
    }
    doFn(action, p, controller) {
        const functionName = action.functionName;
        /**
         * is it a dynamic function added at run time for this page?
         */
        const fn = this.functions[functionName];
        if (fn) {
            fn();
            return action.onSuccess;
        }
        let params;
        if (action.additionalParams) {
            if (p.additionalParams) {
                params = { ...p.additionalParams, ...action.additionalParams };
            }
            else {
                params = action.additionalParams;
            }
        }
        else if (p.additionalParams) {
            params = p.additionalParams;
        }
        const status = this.callFunction(functionName, params, p.msgs, controller);
        return status.allOk ? action.onSuccess : action.onFailure;
    }
    tryToServe(action, p, controller) {
        let values;
        const payload = action.dataToSend;
        if (payload) {
            const source = payload.source;
            if (source === 'all' || source === 'panel') {
                let controllerToUse;
                if (source === 'all') {
                    controllerToUse = this.fc;
                }
                else {
                    controllerToUse = this.getControllerByType(payload.panelName, 'form');
                    if (!controllerToUse) {
                        throw this.ac.newError(`Design Error. Action '${action.name}' on page '${this.name}' specifies panelToSubmit='${payload.panelName}' but that form is not used on this page `);
                    }
                }
                //let us validate the form again
                if (controllerToUse.validate()) {
                    values = controllerToUse.getData();
                }
                else {
                    addMessage('Please fix the errors on this page', p.msgs);
                    return false;
                }
            }
            else if (source === 'fields') {
                const n = p.msgs.length;
                values = controller.extractData(payload.fields, p.msgs);
                if (n !== p.msgs.length) {
                    return false;
                }
            }
            else if (source === 'table') {
                const tc = this.getControllerByType(payload.tablePanel, 'table');
                if (!tc) {
                    throw this.ac.newError(`Design Error. Action '${action.name}' on page '${this.name}' specifies tablePanel='${payload.tablePanel}' but that table is not used on this page `);
                }
                if (payload.sendARow) {
                    values = tc.getRowData(payload.rowIdx, payload.columns);
                }
                else {
                    values = { list: tc.getData() };
                }
            }
            else {
                throw this.ac.newError(`Design Error. Action '${action.name}' on page '${this.name}' specifies an invalid source='${source}' `);
            }
        }
        /**
         * do we have an intercept?
         */
        if (action.fnBeforeRequest) {
            const fnd = this.ac.getFn(action.fnBeforeRequest, 'request');
            const fn = fnd.fn;
            const ok = fn(controller, values, p.msgs);
            if (!ok) {
                return false;
            }
        }
        /**
         * ok. ask for the service.
         */
        this.serve(action.serviceName, controller, values, action.targetPanelName, action.fnAfterResponse).then((ok) => {
            this.actionReturned(action, p, ok ? action.onSuccess : action.onFailure);
        });
        this.actionReturned(undefined, p, action.nextAction);
        return true;
    }
    /**
     *
     * @param name may be of the form ${run-time-name}
     */
    getAction(name, fc) {
        if (!name.startsWith('$')) {
            return this.actions[name];
        }
        const an = this.substituteValue(name, fc);
        if (an === undefined) {
            logger.error(`Action '${name}' could not be translated because a value for that field was not found`);
            return undefined;
        }
        return this.actions['' + an];
    }
    setDisplayState(compName, settings) {
        const done = this.fc.setDisplayState(compName, settings);
        if (done) {
            return;
        }
        //could be for a row or a column.
        const tablePart = this.getTableParts(compName);
        if (tablePart === undefined) {
            return;
        }
        const tc = this.getControllerByType(tablePart.name, 'table');
        if (tc) {
            tc.setRowOrCellState(settings, tablePart.rowIdx, tablePart.columnName);
        }
    }
    getTableParts(name) {
        const names = name.split('.');
        if (names.length === 1) {
            return undefined;
        }
        const msg = `'${name}' is not a valid target for a row or a cell in a table. Expected 'name.number' or 'name.?' with optional '.columnName'`;
        if (names.length > 3) {
            logger.error(msg);
            return undefined;
        }
        const parts = { name: names[0].trim() };
        const idx = names[1].trim();
        if (idx === '?') {
            //means current-idx. rowIdx need not be added
        }
        else {
            const n = Number.parseInt(idx, 10);
            if (!Number.isInteger(n)) {
                logger.error(msg);
                return undefined;
            }
            parts.rowIdx = n;
        }
        if (names.length === 3) {
            parts.columnName = names[2].trim();
        }
        return parts;
    }
    /**
     * an async action has returned. We have to continue the possible action-chain
     * @param action
     * @param ok //if the action succeeded
     * @param activeActions
     */
    actionReturned(action, p, nextAction) {
        this.showMessages(p.msgs);
        if (action?.toDisableUx) {
            this.ac.enableUx();
        }
        if (nextAction) {
            this.doAct(nextAction, p, undefined);
        }
    }
    navigate(action, p) {
        const data = this.getDataInput(action.dataSources, p);
        const options = { ...action.navigationOptions };
        if (options.retainCurrentPage) {
            if (!options.menuItem) {
                addMessage(`Action ${action.name} requires that the current page be retained,
            but does not specify the menu item to be used to open a new page`, p.msgs);
                return false;
            }
            if (options.module) {
                addMessage(`Action ${action.name} requires that the current page be retained.
            It should not specify moduleName in this case.`, p.msgs);
                return false;
            }
            this.ac.navigate(options, data);
            return true;
        }
        /**
         * we are to close this page
         */
        if (options.warnIfModified && this.isModified) {
            /**
             * TODO: use message service for this
             */
            if (window.confirm('Click on Okay to abandon any changes you would have made. Cancel to get back to editing ')) {
                return true;
            }
        }
        const onClose = this.page.onCloseAction;
        if (!onClose) {
            this.ac.navigate(options, data);
            return true;
        }
        const trigger = this.actions[onClose];
        if (!trigger || trigger.type === 'navigation') {
            addMessage(`${onClose} is specified as close-action for this page.
          This action is not defined, or it is defined as a navigation action.`, p.msgs);
            return false;
        }
        this.act(onClose, undefined);
        window.setTimeout(() => {
            this.ac.navigate(options, data);
        }, 0);
        return true;
    }
    /**
     *
     * @param action
     * @param p
     * @param callback
     * @returns nextAction to be taken without waiting for thr form-service to return
     * undefined in case of any error in submitting the form..
     */
    doFormAction(action, p) {
        const fc = p.fc || this.fc;
        let operation = action.formOperation;
        if (operation === 'save') {
            operation = this.saveIsUpdate ? 'update' : 'create';
        }
        const nbrMessages = p.msgs.length;
        if (!this.formOk(action.formName || fc.getFormName(), operation, p.msgs)) {
            return false;
        }
        let data;
        let targetChild;
        let fa;
        switch (action.formOperation) {
            case 'get':
                data = fc.extractKeys(p.msgs);
                break;
            case 'filter':
                fa = action;
                data = this.getFilterData(fc, fa, p.msgs);
                targetChild = fa.targetTableName;
                break;
            case 'create':
            case 'update':
            case 'delete':
            case 'save':
                if (!this.isValid()) {
                    addMessage('Page has fields with errors.', p.msgs);
                    break;
                }
                data = fc.getData();
                break;
            default:
                addMessage(`Form operation ${action.formOperation} is not valid`, p.msgs);
                break;
        }
        if (nbrMessages < p.msgs.length) {
            return false;
        }
        //format payload for FormService
        const payload = {
            formName: action.formName,
            formOperation: operation,
            formData: data || {},
        };
        //all ok to call the service. this function returns immediately after requesting the service.
        this.serve(conventions.formServiceName, fc, payload, targetChild, undefined).then((ok) => {
            this.actionReturned(action, p, ok ? action.onSuccess : action.onFailure);
        });
        //nextAction is to be taken without waiting for the form-service to return
        this.actionReturned(undefined, p, action.nextAction);
        return true;
    }
    getFilterData(fc, action, messages) {
        const vo = {};
        if (action.sortBy) {
            vo.sorts = action.sortBy;
        }
        if (action.fields) {
            vo.fields = action.fields;
        }
        if (action.maxRows) {
            vo.maxRows = action.maxRows;
        }
        let filters;
        if (action.filters) {
            filters = this.getConditions(fc, action.filters, messages);
        }
        else {
            // any value in the form is considered to be a filter-condition of type '='
            filters = this.toFilters(fc.getData());
        }
        if (filters) {
            vo.filters = filters;
        }
        return vo;
    }
    getValueOf(source, fc) {
        if (typeof source !== 'object') {
            //we do not check for null and functions. It is a constant value
            return source;
        }
        //is it a form-field?
        if (source.fieldName) {
            const f = source;
            const controller = source.formName
                ? this.getControllerByType(source.formName, 'form')
                : fc;
            if (controller) {
                return controller.getFieldValue(f.fieldName);
            }
            return undefined;
        }
        //it is a column in a table
        const t = source;
        const tc = this.getControllerByType(t.tableName, 'table');
        if (tc) {
            return tc.getRowData(t.rowIdx)?.[t.columnName];
        }
        return undefined;
    }
    setValueTo(field, value, fc) {
        if (typeof field === 'string') {
            fc.setFieldValue(field, value);
            return;
        }
        if (field.fieldName) {
            const f = field.formName
                ? this.getControllerByType(field.formName, 'form')
                : fc;
            if (f) {
                f.setFieldValue(field.fieldName, value);
            }
            return;
        }
        const t = field;
        const tc = this.getControllerByType(t.tableName, 'table');
        if (tc) {
            const row = tc.getRowData(t.rowIdx);
            if (row) {
                row[t.columnName] = value;
            }
        }
    }
    getControllerByType(name, type) {
        const controller = this.fc.getController(name);
        if (!controller) {
            logger.error(`No controller named ${name} is available on this page.`);
            return undefined;
        }
        if (controller.type !== type) {
            logger.error(`child controller '${name}' is expected to be a '${type}' but it is ${controller.type}`);
            return undefined;
        }
        return controller;
    }
    /**
     * If the value is of the pattern ${fieldName}, get the value of that field-name.
     * else return the value as it is
     * @param value as specified at design time.
     * @param fc: form controller that has values for the relevant fields
     * @returns
     */
    substituteValue(value, fc) {
        if (!FIELD_REGEX.test(value)) {
            //it's a constant
            return value;
        }
        const name = value.substring(2, value.length - 1);
        let val;
        if (fc) {
            val = fc.getFieldValue(name);
        }
        if (val == undefined) {
            val = this.getFieldValue(name);
        }
        if (val === undefined) {
            logger.warn(`${value}: No value found for run-time-field ${name} in the form-controller`);
        }
        return val;
    }
    /**
     * //TODO we have to validate the fields
     * @param values
     * @returns
     */
    toFilters(values) {
        const filters = [];
        for (const [field, value] of Object.entries(values)) {
            if (value) {
                filters.push({ field, value: '' + value, comparator: '=' });
            }
        }
        if (filters.length) {
            return filters;
        }
        return undefined;
    }
    getConditions(fc, conditions, msgs) {
        const filters = [];
        if (!conditions || !conditions.length) {
            return filters;
        }
        for (const con of conditions) {
            const op = con.comparator || '=';
            if (op === '!#' || op === '#') {
                filters.push(con);
                continue;
            }
            const value = this.getFilterValue(con.field, con.value, fc);
            if (value === '') {
                if (!con.isRequired) {
                    continue;
                }
                addMessage(`value is missing for the field '${con.field}'. Action will abort.`, msgs);
                return undefined;
            }
            if (con.comparator !== '><') {
                filters.push({ ...con, value });
                continue;
            }
            let toValue = con.toValue;
            if (typeof toValue === 'string') {
                toValue = this.substituteValue(toValue, fc);
            }
            if (toValue !== '') {
                filters.push({ ...con, value, toValue });
                continue;
            }
            if (!con.isRequired) {
                continue;
            }
            addMessage(`value is missing for the field '${con.field}'. Action will abort.`, msgs);
            return undefined;
        }
        return filters;
    }
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
    getFilterValue(fieldName, value, fc) {
        let nameToUse = fieldName;
        // Is the value specified at design time?
        if (value !== undefined) {
            if (typeof value !== 'string' || !FIELD_REGEX.test(value)) {
                //it's a constant
                return value;
            }
            //it is a run-time field-name of the form ${field-name}
            nameToUse = value.substring(2, value.length);
        }
        if (!nameToUse) {
            return '';
        }
        const fieldValue = fc.getFieldValue(nameToUse);
        if (fieldValue !== undefined) {
            return fieldValue;
        }
        logger.warn(`Parameter ${fieldName} has no value while invoking an action that uses this parameter`);
        return '';
    }
    getDataInput(dataSources, p) {
        if (!dataSources || !dataSources.length) {
            return undefined;
        }
        let allData = {};
        for (const dataSource of dataSources) {
            const controller = p.fc || this.fc;
            let vo;
            const source = dataSource.source;
            if (source === 'all' || source === 'panel') {
                let controllerToUse;
                if (source === 'all') {
                    controllerToUse = this.fc;
                }
                else {
                    controllerToUse = this.getControllerByType(dataSource.panelName, 'form');
                    if (!controllerToUse) {
                        throw this.ac.newError(`Design Error. An action on page '${this.name}' specifies panelToSubmit='${dataSource.panelName}' but that form is not used on this page `);
                    }
                    //let us validate the form again
                    if (controllerToUse.validate()) {
                        vo = controllerToUse.getData();
                    }
                    else {
                        addMessage('Please fix the errors on this page', p.msgs);
                        return;
                    }
                }
            }
            else if (source === 'fields') {
                vo = {};
                for (const [name, isRequired] of Object.entries(dataSource.fields)) {
                    const v = controller.getFieldValue(name);
                    if (v === undefined || v === '') {
                        if (isRequired) {
                            addMessage(`Field '${name}' is required to be sent as data-source, but has no value`, p.msgs);
                            return;
                        }
                    }
                    else {
                        vo[name] = v;
                    }
                }
            }
            else if (source === 'values') {
                vo = dataSource.values;
            }
            else if (source === 'table') {
                const tc = this.getControllerByType(dataSource.tablePanel, 'table');
                if (!tc) {
                    throw this.ac.newError(`Design Error. An action on page '${this.name}' specifies tablePanel='${dataSource.tablePanel}' but that table is not used on this page `);
                }
                if (dataSource.sendARow) {
                    vo = tc.getRowData(dataSource.rowIdx, dataSource.columns);
                }
                else {
                    vo = { list: tc.getData() };
                }
            }
            else {
                throw this.ac.newError(`Design Error. An action on page '${this.name}' specifies an invalid source='${source}' `);
            }
            if (vo) {
                allData = { ...allData, ...vo };
            }
        }
        return allData;
    }
}
function addMessage(text, msgs) {
    msgs.push({ text, id: '', type: 'error' });
}
//# sourceMappingURL=pageController.js.map