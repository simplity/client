import { AlertType, FormattedValue, Value, Vo } from '../common';
import { AppController, FormController, PageController } from './';
import { DetailedMessage, ServiceResponse } from '../agent';
import { BaseView } from '../view';
/**
 * A global function that is accessible at the app level.
 *
 * @param ac: the app controller
 * @param params: additional parameters passed to the function
 * @param msgs array to which the function can add messages that may be passed on to the UX
 * @returns any. In some situations the return value may also be checked for truthy/falsy to trigger events like onsuccess etc..
 */
export type GlobalFunction = (ac: AppController, params: unknown, msgs: DetailedMessage[]) => unknown;
/**
 * A function that is to be triggered on some event. This is executed with page as the context.
 *
 * @param pc: the page controller used by this page
 * @param params: optional parameters for this function. If used, this is typically an object with name-value pairs.
 * onChange and OnChanging event call-back functions receive an object with {fieldName, value, event} attributes
 * @param msgs array to which the function can add messages that may be passed on to the UX
 * @returns any. In some situations the return value may also be checked for truthy/falsy to trigger evens like onsuccess etc..
 */
export type PageFunction = (pc: PageController, params: unknown, msgs: DetailedMessage[]) => unknown;
/**
 * a function that is triggered on events like
 * onChanged, onChanging, onValueChanged etc..
 * This is executed with form as the context. function can access only the form controller
 * (In case the function requires access to page level context, use page)
 * @param fc controller for this field
 * @param params   onChange and OnChanging event call-back functions receive an object with {fieldName, value, event} attributes
 * @param msgs array to which the function can add messages that may be passed on to the UX
 * @returns any. In some situations the return value may also be checked for truthy/falsy to trigger evens like onsuccess etc..
 */
export type FormFunction = (fc: FormController, param: unknown, msgs: DetailedMessage[]) => unknown;
/**
 * a function that is triggered just before requesting a service using a ServiceAction.
 * This is an intercept function that can either modify the payload for the request, or abort the request with an error message.
 * @param fc controller of the form being submitted. Note that the PageController is accessible from this.
 * @param payload that accompanies the request.
 * @param msgs array to which the function should add messages in case the request is to be aborted
 * @returns true to say OK for the request. false to abort the request.
 */
export type RequestFunction = (fc: FormController, payload: Vo | undefined, msgs: DetailedMessage[]) => boolean;
/**
 * An intercept function that is triggered after the response is received for an ServiceAction,
 * but before the serviceResponse is processed by the controller.
 * @param pc page controller
 * @param response serviceResponse that may be modified by this function
 */
export type ResponseFunction = (pc: PageController, response: ServiceResponse) => void;
/**
 * A form validation functions returns an array of messages in case of validation errors, or undefined if there are no errors
 */
export type FormValidationFunction = (fc: FormController) => [{
    fieldName: string;
    message: string;
}] | undefined;
export type FunctionImpl = {
    type: 'global';
    fn: GlobalFunction;
} | {
    type: 'page';
    fn: PageFunction;
} | {
    type: 'form';
    fn: FormFunction | FormValidationFunction;
} | {
    type: 'field';
    fn: FieldValidationFn;
} | {
    type: 'request';
    fn: RequestFunction;
} | {
    type: 'response';
    fn: ResponseFunction;
} | {
    type: 'format';
    fn: FormatterFunction;
} | {
    type: 'init';
    fn: ViewInitFunction;
};
/**
 * status returned by the controller when a function is requested at run time
 */
/**
 * status returned by the controller when a function is requested at run time
 */
export type FnStatus = {
    /**
     * true if the function was called with success, false in case of any error, like function not defined, or the function threw an exception
     */
    allOk: boolean;
    /**
     * value returned by the function, if it got executed successfully
     */
    returnedValue?: unknown;
};
export type AppError = {
    error: string;
};
/**
 * Error object emitted by a value-schema validator
 */
export type SchemaError = {
    name: string;
    params?: string[];
};
/**
 * function that validates the supplied value, after parsing itq.
 */
export type FieldValidationFn = (value: {
    value: string;
}) => ValueValidationResult;
/**
 * data-structure returned by a validation function.
 * value is undefined if the string could not be parsed into the right type
 */
export type ValueValidationResult = {
    /**
     * NULL_VALUE (and not undefined) if the parsing fails. (refer to getNullValue() method))
     * parsed value of the right type, if parsing is successful, even of the validation fails.
     * IMP: should check for messages to know if this value is valid or not.
     */
    value?: Value;
    /**
     * undefined if the value is valid.
     * at least one message in the array if the validation fails. (never empty array).
     * multiple messages possible if the field has multiple validation rules
     */
    messages: ValidationMessage[];
} | {
    value: Value;
    messages?: ValidationMessage[];
};
export type ValidationMessage = {
    /**
     * messages are externalized. run-time environment would get the actual text for this in the desired language
     */
    messageId: string;
    alertType: AlertType;
    /**
     * number of parameters should match the parameters embedded in the message
     */
    params?: string[];
};
/**
 * function that formats a value to text format and provides rendering attributes to be set
 * used by the client to mark-up a value being rendered.
 */
export type FormatterFunction = (value: Value) => FormattedValue;
/**
 * function to be called to initialize a view-component after it is created by the view-layer of simplity.
 * e.g. in html, if flatpickr is used, the inputElement must be initialized.
 * @param view  abstract base-view. implementation should cast it to the rendering-specific element
 * for e.g. in html this is BaseElement.
 */
export type ViewInitFunction = (view: BaseView) => void;
