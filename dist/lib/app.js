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
import { AppElement } from './view/elements';
import { AC } from './controller';
import { serviceAgent } from './agent';
import { logger } from './logger';
let appController;
function getAc() {
    if (!appController) {
        throw new Error('Application Bootstrap Error: App is accessed before it is boostrapped.');
    }
    return appController;
}
function bootstrap(appRuntime) {
    const agent = serviceAgent.newAgent({
        localServices: appRuntime.localServices,
        serverUrl: appRuntime.serverUrl,
        responses: appRuntime.cachedResponses,
    });
    const appView = new AppElement(appRuntime.appElement, appRuntime.htmls);
    appController = new AC(appRuntime, agent, appView);
    let params = parseQueryString(appController);
    if (!params) {
        params = {
            layout: appRuntime.startingLayout,
            module: appRuntime.startingModule,
            menuItem: appRuntime.startingMenuItem,
        };
    }
    appView.render(appController, params);
}
function shutDown() { }
function reportError() {
    logger.error('Malformed direct link. Ignored');
    return undefined;
}
function parseQueryString(ac) {
    const s = window.location.search;
    if (!s) {
        return undefined;
    }
    const urlParams = new URLSearchParams(s);
    const d = urlParams.get('_d');
    const t = urlParams.get('_t');
    if (!d) {
        return reportError();
    }
    //direct link
    const link = ac.getDirectLink(d);
    if (!link) {
        return reportError();
    }
    if (link.requiresToken && !t) {
        return reportError();
    }
    const pageParameters = {};
    for (const [key, value] of urlParams.entries()) {
        if (key !== '_d' && key !== '_t') {
            pageParameters[key] = value;
        }
    }
    if (t) {
        pageParameters['token'] = t;
    }
    return {
        layout: link.layout,
        module: link.module,
        menuItem: link.menuItem,
        pageParameters,
    };
}
export const app = { getAc };
export const bootStrapper = {
    start: bootstrap,
    stop: shutDown,
};
//# sourceMappingURL=app.js.map