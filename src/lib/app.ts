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

import { AppController, AppRuntime, AppView, BootStrapper } from '@simplity';
import { AppElement } from './view/elements';
import { AC } from './controller';
import { serviceAgent } from './agent';

let appController: AppController | undefined;
function getAc(): AppController {
  if (!appController) {
    throw new Error(
      'Application Bootstrap Error: App is accessed before it is boostrapped.'
    );
  }
  return appController;
}

function bootstrap(appRuntime: AppRuntime): void {
  const agent = serviceAgent.newAgent({
    localServices: appRuntime.localServices,
    serverUrl: appRuntime.serverUrl,
    responses: appRuntime.cachedResponses,
  });
  const appView: AppView = new AppElement(
    appRuntime.appElement,
    appRuntime.htmls
  );
  appController = new AC(appRuntime, agent, appView);

  appView.render(
    appController,
    appRuntime.startingLayout,
    appRuntime.startingModule
  );
}
function shutDown(): void {}

export const app = { getAc };

export const bootStrapper: BootStrapper = {
  start: bootstrap,
  stop: shutDown,
};
