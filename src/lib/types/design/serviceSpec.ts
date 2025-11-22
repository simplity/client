/**
 * serviceSpec describes a service. services are the basic contract between the client-app and the server-app
 */
export type ServiceSpec = {
  /**
   * name must match with the name with which it is mapped in the object
   */
  name: string;
  description?: string;
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
