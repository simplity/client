/**
 * Specification of a service. Services are the basic contract between the client-app and the server-app
 */
export type Service = {
    /**
     * name must match with the name with which it is mapped in the object
     */
    name: string;
    /**
     * Meant to be used by developers only. Place to document any specifics about this service.
     */
    description?: string;
    /**
     * whether the service is available to guest users (not logged in)
     */
    serveGuests?: boolean;
    /**
     * service is requested with this form as data-input
     */
    requestForm?: string;
    /**
     * the response contains this data
     */
    responseForm?: string;
};
