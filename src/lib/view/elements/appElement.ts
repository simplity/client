import {
  Alert,
  AppController,
  AppView,
  NavigationOptions,
  PanelView,
  StringMap,
  Vo,
} from '@/types';

import { PageElement } from './pageElement';
import { ChildElementId, htmlUtil } from './htmlUtils';
import { LayoutElement } from './layoutElement';
import { logger } from '../../logger';

const PAGE_TITLE = 'page-title';

export class AppElement implements AppView {
  public ac!: AppController;
  public readonly root: HTMLElement;
  private currentPopup?: PanelView;
  private layoutEle?: LayoutElement;

  private readonly pageStack: PageElement[] = [];
  private readonly spinnerEle?: HTMLElement;
  private readonly messageEle?: HTMLElement;
  private readonly messageTextEle?: HTMLElement;
  /**
   *
   * @param runtime
   * @param appEle container element to which the app-view is to be appended to
   */
  constructor(appEle: HTMLElement) {
    this.root = appEle;

    this.spinnerEle = htmlUtil.newHtmlElement('disable-ux');
    if (this.spinnerEle) {
      document.body.appendChild(this.spinnerEle);
    }
    this.messageEle = htmlUtil.newHtmlElement('message');
    if (this.messageEle) {
      this.messageTextEle = htmlUtil.getOptionalElement(
        this.messageEle,
        'message',
      );
      document.body.appendChild(this.messageEle);
    }
  }

  /**
   * Renders the application view. Must be called once after the constructor
   * @param ac app controller
   * @param startinglayout layout to be rendered
   * @param startingModule module to be rendered
   */
  render(
    ac: AppController,
    startinglayout: string,
    startingModule: string,
  ): void {
    this.ac = ac;
    this.renderLayout(startinglayout, {
      module: startingModule,
    });
  }

  download(data: Vo, fileName: string): void {
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'octet/stream' });
    const url = URL.createObjectURL(blob);
    const doc = window.document;
    const a = doc.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.target = '_blank';
    a.download = fileName;
    doc.body.appendChild(a);
    a.click();
    doc.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private renderLayout(layoutName: string, params: NavigationOptions): void {
    if (this.layoutEle) {
      if (this.layoutEle.layout.name === layoutName) {
        return;
      }
      this.layoutEle.root.remove();
    }

    const layout = this.ac.getLayout(layoutName);
    const lv = new LayoutElement(this.ac, layout, params);
    this.layoutEle = lv;
    this.root.appendChild(lv.root);
  }

  closePage(): void {
    if (this.layoutEle) {
      this.layoutEle.closeCurrentPage();
    }
  }

  navigate(options: NavigationOptions) {
    //navigate to a layout??
    if (
      options.layout &&
      this.layoutEle &&
      this.layoutEle.layout.name !== options.layout
    ) {
      if (options.asModal || options.retainCurrentPage) {
        throw this.ac.newError(
          `When the current page is retained, new menu-item must be from the same-layout`,
        );
      }

      if (this.pageStack.length) {
        throw this.ac.newError(
          `Navigation requested from layout '${this.layoutEle!.layout.name}' to '${options.layout}'. 
            There are ${this.pageStack.length} pages on the stack. 
            If these can be removed, then you must set erasePagesOnTheStack.true`,
        );
      }

      this.renderLayout(options.layout, options);
      return;
    }

    if (options.module) {
      this.layoutEle!.renderModule(options);
      return;
    }

    if (!options.menuItem) {
      throw this.ac.newError(
        `Navigation action has no layout/module/menu specified. navigation aborted`,
      );
    }

    const menu = this.ac.getMenu(options.menuItem);
    if (!menu.pageName) {
      logger.error(
        `Menu item ${options.menuItem} has no pageName. Can not navigate`,
      );
      return;
    }

    this.layoutEle!.renderPage(menu.pageName, options);
  }

  renderContextValues(values: StringMap<string>): void {
    for (const [name, value] of Object.entries(values)) {
      const ele = htmlUtil.getOptionalElement(
        this.root,
        name as ChildElementId,
      );
      if (ele) {
        ele.textContent = value.toString();
      } else {
        logger.info(
          `field ${name} with a value of "${value}" could not be rendered because an element with attribute data-id="${name} was not found in the html document`,
        );
      }
    }
  }

  renderPageTitle(title: string): void {
    const values: StringMap<string> = {};
    values[PAGE_TITLE] = title;
    this.renderContextValues(values);
  }

  showAlerts(alerts: Alert[]): void {
    console.info(alerts);
    let msg = '';
    for (const alert of alerts) {
      msg += alert.type + ': ' + alert.text + '\n';
    }

    if (!this.messageEle || !this.messageTextEle) {
      window.alert(msg);
      return;
    }
    const txt = this.messageTextEle.innerText;
    if (txt) {
      msg = txt + '\n' + msg;
    }
    this.messageTextEle.innerText = msg;
    htmlUtil.setViewState(this.messageEle, 'hidden', false);
  }

  getUserChoice(text: string, choices: string[]): Promise<number> {
    throw new Error(
      `Text: ${text} to be rendered asking for${choices.length} options. This functionality is not yet developed`,
    );
  }

  renderAsPopup(panel: PanelView): void {
    if (this.currentPopup) {
      throw new Error(
        `Panel ${panel.name} to be rendered as popup. But panel ${this.currentPopup.name} is already shown as popup`,
      );
    }
    this.currentPopup = panel;
    logger.warn(
      `Panel ${panel.name} to be rendered as popup. This functionality is not yet developed`,
    );
  }

  closePopup(): void {
    if (this.currentPopup) {
      this.currentPopup = undefined;
    } else {
      logger.warn(`A closePopup() is request when there is no active popup`);
    }
  }

  doNavigate(url: string) {
    //app.getCurrentAc().newWindow(url);
  }

  disableUx(): void {
    if (this.spinnerEle) {
      htmlUtil.setViewState(this.spinnerEle, 'hidden', false);
    } else {
      logger.error(
        `App has not provided an html-template named 'disable-ux'. UX is not disabled`,
      );
    }
  }

  enableUx(): void {
    if (this.spinnerEle) {
      htmlUtil.setViewState(this.spinnerEle, 'hidden', true);
    }
  }
}
