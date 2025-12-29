import { logger } from './logger';
import {
  Vo,
  AgentConfigData,
  ServiceAgent,
  ServiceStatus,
  ServerRequest,
  ServerResponse,
} from 'src/lib/types';

export const STATUS_DESCRIPTIONS: {
  [status in ServiceStatus]: string;
} = {
  communicationError:
    'An error was encountered while communicating with the server',
  completed: 'Completed with success',
  completedWithErrors: 'Completed, but there were errors',
  invalidDataFormat: 'The input data was not appropriate for this service',
  noServer: 'No server is set up',
  noSuchService:
    'Service name is invalid, or this server is configured not to respond to this service',
  noSuchSession: 'Session id for this conversational mode is invalid',
  serverError:
    'The server could not invoke this service due to a general error on the server',
  serviceNameRequired: 'No service name was specified',
  sessionRequired:
    'this service request valid only in a conversational mode. Hence a session id is required',
};

/*
 * utility to get an instance of a Service Agent
 */

export const serviceAgent = {
  /**
   *
   * @param configData
   * @returns an new instance of ServiceAgent that can be used repeatedly to serve
   * service requests.
   * Caller should retain the instance and use it repeatedly, and NOT get new instance for each request
   */
  newAgent: (configData: AgentConfigData): ServiceAgent => {
    return new SA(configData);
  },
};

class SA implements ServiceAgent {
  private readonly responses;
  private readonly localServices;
  private readonly serverUrl;

  constructor(configData: AgentConfigData) {
    this.responses = configData.responses || {};
    this.localServices = configData.localServices || {};
    this.serverUrl = configData.serverUrl;
  }

  /**
   *
   * @param service name of the service to be invoked
   * @param sessionId session id, if this service is to be invoked in conversational mode.
   * This is the token that is received after a successful login
   * @param data to be sent as per the service specification for this service
   * @returns Response object with status, description and data as per the service specification.
   * Generally, data is not usefule, even if it is received, if status is not 'completed' or 'completedWithErrors'
   */
  public async serve(
    service: string,
    sessionId?: string,
    data?: Vo
  ): Promise<ServerResponse> {
    let r = this.responses[service];
    if (r !== undefined) {
      //got it from our cache
      logger.debug(`Service Agent: Served ${service} from cached response`);
      return JSON.parse(JSON.stringify(r));
    }

    //do we have a local service?
    const ls = this.localServices[service];
    if (ls) {
      r = ls(data);
      // a local service may pretend its absence by returning this status.
      if (r.status !== 'noSuchService') {
        logger.debug(`Service Agent: Served ${service} from local service`);
        return JSON.parse(JSON.stringify(r));
      }
      logger.debug(
        `Service Agent:  ${service}: Local service refused to serve. Looking for server..`
      );
    }

    //send a request to the server
    const req: ServerRequest = { service };
    if (sessionId) {
      req.sessionId = sessionId;
    }

    if (data) {
      req.data = data;
    }

    let status: ServiceStatus = 'noServer';
    let description: string = STATUS_DESCRIPTIONS[status];

    if (!this.serverUrl) {
      logger.debug(
        `Service Agent: No server is configured.  ${service} could not be served`
      );
      return {
        status,
        description,
      };
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    };

    try {
      const response = await fetch(this.serverUrl, options);
      logger.debug(
        `Service Agent: ${service}: Requested server at ${this.serverUrl}`
      );
      return (await response.json()) as ServerResponse;
    } catch {
      status = 'communicationError';
      description = `Error while communicating with server URL: ${this.serverUrl}`;
      logger.error(`Service Agent:communicationError.  ${description}`);
      return {
        status,
        description,
      };
    }
  }
}
