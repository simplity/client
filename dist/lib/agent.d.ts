import { AgentConfigData, ServiceAgent, ServiceStatus } from 'src/lib/types';
export declare const STATUS_DESCRIPTIONS: {
    [status in ServiceStatus]: string;
};
export declare const serviceAgent: {
    /**
     *
     * @param configData
     * @returns an new instance of ServiceAgent that can be used repeatedly to serve
     * service requests.
     * Caller should retain the instance and use it repeatedly, and NOT get new instance for each request
     */
    newAgent: (configData: AgentConfigData) => ServiceAgent;
};
