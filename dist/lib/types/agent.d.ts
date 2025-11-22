import { FilterCondition, SortBy, StringMap, Vo } from './common';
/**
 * Component that serves all services to the client-app.
 * Code from the client app MUST use this component, and never make any request to the server directly.
 */
export interface ServiceAgent {
    /**
     * This is an async function. it returns after initiating the process.
     * callers can either use async/wait to serialize their logic, or use .then() etc.. and move on with the rest of the logic
     * Note that this method does not throw exception on any error.
     * It catches any error, and creates an appropriate response with the error.
     * Hence it is more amenable  async-await style of coding
     *
     * @param serviceName to be served from the server
     * @param sessionId: optional token/sessionId if a session is established with the server
     * @param data: data for this service. undefined if this service does not take any input
     * @returns promise that will not throw any error. The returned response may contain error details
     */
    serve(serviceName: string, sessionId?: string, data?: Vo): Promise<ServerResponse>;
}
/**
 * Configuration parameters for the agent
 */
export type AgentConfigData = {
    /**
     * URL for the server. All requests are sent to this url.
     * Only local resources are used if the url is not set
     */
    serverUrl?: string;
    /**
     * mock responses for services. Note that there is one fixed response for a request, irrespective of the input data.
     * LocalService should be used if response is data-dependent
     */
    responses?: StringMap<ServiceResponse>;
    /**
     * some local logic based on which the response can be determined.
     * note that the service is called only if no ready response is available.
     */
    localServices?: StringMap<Service>;
};
/**
 * Service is a function that responds with its response when invoked with its specified, possibly optional, input data
 */
export type Service = (data?: Vo) => ServiceResponse;
/**
 * request for a ListService must contain certain data elements
 */
export type ListRequestVo = {
    /**
     * name of the list
     */
    list: string;
    /**
     * key value if the list is keyed
     */
    key?: string | number;
    /**
     * if this is a keyed-list, but we need all the lists for all possible keys
     */
    forAllKeys?: boolean;
};
/**
 * input parameters to the filter API
 */
export type FilterParams = {
    /**
     * default is to get all rows.
     * Note that there is a default max rows that any service will respond back with.
     */
    maxRows?: number;
    /**
     * array of filter conditions. Default is to use no filters, and select all.
     */
    filters?: FilterCondition[];
    /**
     * default is to use the default-sort used by the underlying form definition, if any
     * fields to be sorted by. Sorting on text fields is case-insensitive
     */
    sorts?: SortBy[];
    /**
     * fields names to be selected. These are the columns in the table being rendered
     * default is to get all the fields
     */
    fields?: string[];
};
/**
 * server may return session-id as well..
 */
export type ServerResponse = ServiceResponse & {
    sessionId?: string;
};
/**
 * Data structure that has the details to request the server to serve a service
 */
export type ServerRequest = {
    service: string;
    sessionId?: string;
    data?: Vo;
};
/**
 * Data structure of the response for a service request.
 * This is the generic format. Each service will have it's specific Vo
 */
export type ServiceResponse = {
    /**
     * status code of request processing by the server
     */
    status: ServiceStatus;
    /**
     * human readable description of the status code
     */
    description: string;
    /**
     * optional if status is 'served'. Otherwise will contain at least one message with severity of error
     */
    messages?: DetailedMessage[];
    /**
     * output from service execution. relevant only if status is served
     */
    data?: Vo;
};
/**
 * status field in the response
 */
export type ServiceStatus = 
/**
 * Successfully completed.
 */
'completed'
/**
 * Service completed but with errors. Either the input data was invalid, or the intended action could not be taken for other reasons.
 */
 | 'completedWithErrors'
/**
 * Request does not specify a session id.
 */
 | 'sessionRequired'
/**
 * No session is active with this session id. Either the session has expired, or the id is invalid.
 */
 | 'noSuchSession'
/**
 * Invalid input data format.
 */
 | 'invalidDataFormat'
/**
 * No server is set up.
 */
 | 'noServer'
/**
 * Request does not specify a service name.
 */
 | 'serviceNameRequired'
/**
 * No such service is served by this app, or the service is not accessible to this user.
 */
 | 'noSuchService'
/**
 * error while communicating with the server
 */
 | 'communicationError'
/**
 * There was an internal error on the server. It is being looked into.
 */
 | 'serverError';
/**
 * Structure of a Message received as part of a response
 */
export type DetailedMessage = {
    /**
     * one of the pre-defined type
     */
    type: 'error' | 'warning' | 'info' | 'success';
    /**
     * unique name assigned to this message in the app.
     */
    id: string;
    /**
     * Required if id is not specified. If text is specified, then the id is ignored.
     * formatted text in English that is ready to be rendered
     */
    text: string;
    /**
     * name of the field (primary one in case more than one field are involved) that caused
     * this error. undefined if this is not specific to any field.
     */
    fieldName?: string;
    /**
     * name of the table/object that the field is part of. undefined if this not relevant
     */
    objectName?: string;
    /**
     * 0-based row number in case the field in error is part of a table.
     */
    idx?: number;
    /**
     * run-time parameters that are used to compose this message. This is useful in i18n
     */
    params?: string[];
};
