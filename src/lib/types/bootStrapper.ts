import { ServiceFunction, ServiceResponse } from './agent';
import { StringMap } from './common';
import { FunctionImpl } from './controller';
import { AppDesign, ValueList } from './design';
import { ViewComponentFactory } from './view';

export type AppRuntime = AppDesign & {
  /**
   * URL for the server. All requests are sent to this url.
   * Only local resources are used if the url is not set
   */
  serverUrl?: string;
  /**
   *  app-specific configuration parameters that may be used by app-specific functions
   */
  appParams?: StringMap<any>;
  /**
   * e.g. ./assets/images/
   */
  imageBasePath: string;

  /**
   * layout to render on load
   */
  startingLayout: string;

  /**
   * module to be selected by default on loading
   */
  startingModule: string;

  /**
   * ready responses are cached responses by serviceNames,  by the client.
   * we may also decide to shift them to the server side on a need basis.
   * this feature is useful during development and for demo purposes
   * if a ready response is available, the response is used instead of calling a service
   */
  cachedResponses?: StringMap<ServiceResponse>;

  //////////// added by the app-layer by programmers
  /**
   * local lists are cached responses to getList(). Useful during development/demo
   * this is a run-time concept to override a design component at run time
   */
  localLists?: StringMap<ValueList>;
  /**
   * local services are used during development as stubs.
   * a service  that is meant to be served by the server is over-ridden to be served locally on the client instead
   */
  localServices?: StringMap<ServiceFunction>;

  /**
   * Function implementations that can be invoked at run time
   */
  functionImpls?: StringMap<FunctionImpl>;

  /**
   * factory instance that creates view components as per the design
   * optional for a partial app that does not render anything
   */
  viewComponentFactory?: ViewComponentFactory;
  /**
   * root element where the app is rendered
   */
  appElement: HTMLElement;
};

export interface BootStrapper {
  /**
   * called once to initialize the application
   */
  start(app: AppRuntime): void;
  stop(): void;
}
