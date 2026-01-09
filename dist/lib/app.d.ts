/**
 * this is our main app entry point.
 * this needs to be designed using plugin architecture.
 * as of now, we will keep it simple, by hardwiring the plugins.
 * AppController is the entry point for the controller layer, while AppElement is the entry point for the UI layer.
 * We have to tie them together here. Ideally, AppController is to be instantiated with an instance of AppElement.
 * However, since we are using a plugin architecture, we will have to instantiate them separately and then tie them together.
 * This is because, in a plugin architecture, the plugins are loaded dynamically and we cannot guarantee that the AppElement plugin is loaded before the AppController plugin.
 *
 * Current design is to instantiate AppController first with no AppElement, and then set the AppElement later when it is loaded.
 * This is not ideal, but it works for now.
 * In future, we can improve this by using a dependency injection framework or a service locator pattern.
 */
import { AppController, BootStrapper } from '@simplity';
declare function getAc(): AppController;
export declare const app: {
    getAc: typeof getAc;
};
export declare const bootStrapper: BootStrapper;
export {};
