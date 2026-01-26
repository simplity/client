import {
  Alert,
  AppController,
  AppInitPartameters,
  AppView,
  NavigationOptions,
  StringMap,
  Vo,
} from '@simplity';

import { PageElement } from './pageElement';
import { ChildElementId, htmlUtil } from './htmlUtils';
import { LayoutElement } from './layoutElement';
import { logger } from '../../logger';
import { BaseElement } from './baseElement';

const PAGE_TITLE = 'page-title';
/**
 * we may need to keep track of certain other states of the pages on steck.
 * hence this wrapper type
 */
type PageOnStack = { ele: PageElement; scrollTop: number; isModal?: boolean };

export class AppElement implements AppView {
  public ac!: AppController;
  /**
   * app-root element that hosts the application
   */
  public readonly root: HTMLElement;
  private pageEle!: HTMLElement;

  /**
   * pointer to the current layout view
   */
  private layoutEle!: LayoutElement;

  /**
   * html fragments that are to be rendered on a need basis.
   * these are appended to the document body in hidden state
   */
  private readonly spinnerEle?: HTMLElement;
  private spinnerTextEle?: HTMLElement;

  private readonly messageEle?: HTMLElement;
  private readonly messageTextEle?: HTMLElement;

  // modal container elements for rendering a modal page
  private readonly modalPageEle: HTMLElement;
  private readonly modalPageContainerEle?: HTMLElement;
  /**
   * current page is the one that has currently the focus.
   * it is not in the stack. theoretically, it could be the one on the top of the stack.
   * but keeping it on its own, and not pushing it to the stack makes certain operations easier.
   */
  private currentPage?: PageElement;
  /**
   * is the current page shown as a modal?
   */
  private modalOpened = false;
  /**
   * keeps track of active pages that are behind the current page.
   * Current one is on the stack.
   */
  private readonly pageStack: PageOnStack[] = [];

  //for showing a panel as modal
  /**
   *  modal container elements for rendering a modal panel.
   * this should be able to be on top of modal pages as well
   */
  private readonly modalPanelEle: HTMLElement;
  private readonly modalPanelContainerEle?: HTMLElement;
  private readonly modalClosePanel?: HTMLElement;
  private poppedupEle?: BaseElement;

  /**
   *
   * @param runtime
   * @param appEle container element to which the app-view is to be appended to
   */
  constructor(appEle: HTMLElement, htmls?: StringMap<string>) {
    this.root = appEle;
    if (htmls) {
      htmlUtil.addTemplates(htmls);
    }

    this.spinnerEle = htmlUtil.newHtmlElement('disable-ux');
    if (this.spinnerEle) {
      document.body.appendChild(this.spinnerEle);
    }

    this.messageEle = htmlUtil.newHtmlElement('message');
    if (this.messageEle) {
      this.messageTextEle = htmlUtil.getOptionalElement(
        this.messageEle,
        'message'
      );
      const closeBtn = htmlUtil.getOptionalElement(
        this.messageEle,
        'close-button'
      );
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          this.hideAlerts();
        });
      }
      document.body.appendChild(this.messageEle);
    }

    /**
     * modal containers
     */
    this.modalPanelEle = htmlUtil.newHtmlElement('modal-panel');
    this.modalPanelContainerEle = htmlUtil.getOptionalElement(
      this.modalPanelEle,
      'container'
    );

    if (this.modalPanelContainerEle) {
      this.modalClosePanel = htmlUtil.getOptionalElement(
        this.modalPanelEle,
        'close-panel'
      );

      if (this.modalClosePanel) {
        const closeEle =
          htmlUtil.getOptionalElement(this.modalPanelEle, 'close-button') ||
          this.modalClosePanel;

        closeEle.addEventListener('click', () => {
          this.closeModalPanel();
        });
      }
    } else {
      logger.error(
        `This app has no html to support modal display of certain type of contets. 
        An html template named 'modal-panel' with a placeholder for 'container' is missing.`
      );
    }
    document.body.appendChild(this.modalPanelEle);

    this.modalPageEle = htmlUtil.newHtmlElement('modal-page');
    this.modalPageContainerEle = htmlUtil.getOptionalElement(
      this.modalPageEle,
      'page'
    );

    if (!this.modalPageContainerEle) {
      logger.error(
        `This app has no html to support modal display of certain type of contets. 
        An html template named 'modal-page' with a placeholder for 'page' is missing.`
      );
    }
    document.body.appendChild(this.modalPageEle);
  }

  /**
   * Renders the application view. Must be called once after the constructor
   * @param ac app controller
   * @param options intialization parameters
   * @param startingModule module to be rendered
   */
  render(ac: AppController, options: AppInitPartameters): void {
    this.ac = ac;
    const pageName = this.renderLayout(options.layout, {
      module: options.module,
      menuItem: options.menuItem,
    });
    this.renderPage(pageName, false, options.pageParameters);
  }

  public navigate(options: NavigationOptions, inputData?: Vo): void {
    if (options.erasePagesOnTheStack && this.pageStack.length) {
      this.purgeStack();
    }

    /**
     * pageNmay may not be in options. It nay the default for a layout/module
     */
    let pageName: string;

    // hope we stay on the same layout!
    if (!options.layout || this.layoutEle.layout.name === options.layout) {
      pageName = this.layoutEle.renderModule(options);
    } else {
      //ok to change the layout?
      if (options.asModal || options.retainCurrentPage) {
        throw this.ac.newError(
          `When the current page is retained, new menu-item must be from the same-layout`
        );
      }

      if (this.pageStack.length) {
        throw this.ac.newError(
          `Navigation requested from layout '${this.layoutEle!.layout.name}' to '${options.layout}'. 
            There are ${this.pageStack.length} pages on the stack. 
            If these can be removed, then you must set erasePagesOnTheStack to true in navigation options`
        );
      }

      //alright, change the layout
      pageName = this.renderLayout(options.layout, options);
    }

    //hide/close the current page
    if (this.currentPage) {
      if (options.retainCurrentPage) {
        if (this.modalOpened && !options.asModal) {
          throw this.ac.newError(
            `A Modal page can not retain itself and open a non-modal page`
          );
        }
        /*
         * push the current page onto the stack, and fade out from the view
         */
        this.pageStack.push({
          ele: this.currentPage,
          scrollTop: document.documentElement.scrollTop,
        });
        htmlUtil.setViewState(this.currentPage.root, 'hidden', true);
      } else {
        this.currentPage.dispose();
      }
    }

    if (options.asModal) {
      if (!this.modalPageContainerEle) {
        throw this.ac.newError(
          `Modal page requested but a suitable template named 'modal-page' is not provided, or is not as per the norm`
        );
      }
      this.modalOpened = true;
      htmlUtil.setViewState(this.modalPageEle, 'hidden', false);
    } else if (this.modalOpened) {
      this.modalOpened = false;
      htmlUtil.setViewState(this.modalPageEle!, 'hidden', true);
    }

    this.renderPage(pageName, options.asModal || false, inputData);
    if (options.module) {
      this.layoutEle.showModule(options.module);
    }
  }

  public closePage(): void {
    const entry = this.pageStack.pop();
    if (!entry) {
      logger.error(`A page can not be closed when no pages were saved.`);
      return;
    }

    this.currentPage!.dispose();

    /**
     * it is not possible that the current page in non-modal but the previous page is modal
     */
    if (this.modalOpened && !entry.isModal) {
      this.modalOpened = false;
      htmlUtil.setViewState(this.modalPageEle!, 'hidden', true);
    }

    this.currentPage = entry.ele;
    htmlUtil.setViewState(this.currentPage.root, 'hidden', false);

    //menu bar visibility
    this.layoutEle.displayMenuBar(!entry.ele.page.hideModules);

    //restore scroll position
    window.scrollTo({ top: entry.scrollTop, behavior: 'instant' });
  }

  public renderContextValues(values: StringMap<string>): void {
    for (const [name, value] of Object.entries(values)) {
      const ele = htmlUtil.getOptionalElement(
        this.root,
        name as ChildElementId
      );
      if (ele) {
        ele.textContent = value.toString();
      } else {
        logger.info(
          `field ${name} with a value of "${value}" could not be rendered because an element with attribute data-id="${name} was not found in the html document`
        );
      }
    }
  }

  renderPageTitle(title: string): void {
    const values: StringMap<string> = {};
    values[PAGE_TITLE] = title;
    this.renderContextValues(values);
  }

  hideAlerts(): void {
    if (this.messageTextEle) {
      this.messageTextEle!.innerText = '';
    }
    if (this.messageEle) {
      htmlUtil.setViewState(this.messageEle, 'hidden', true);
    }
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
    throw this.ac.newError(
      `Text: ${text} to be rendered asking for${choices.length} options. This functionality is not yet developed`
    );
  }

  navigateOut(url: string) {
    logger.warn(
      `Navigation to url: ${url} is requested. This functionality is not yet developed`
    );
    //app.getCurrentAc().newWindow(url);
  }

  disableUx(displayText?: string): void {
    if (!this.spinnerEle) {
      logger.error(
        `App has not provided an html-template named 'disable-ux'. UX is not disabled`
      );
      return;
    }
    if (displayText && this.spinnerTextEle) {
      this.spinnerTextEle.textContent = displayText;
    }
    htmlUtil.setViewState(this.spinnerEle, 'hidden', false);
  }

  enableUx(): void {
    if (this.spinnerEle) {
      if (this.spinnerTextEle) {
        this.spinnerTextEle.textContent = '';
      }
      htmlUtil.setViewState(this.spinnerEle, 'hidden', true);
    }
  }

  public download(data: Vo, fileName: string): void {
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

  public showAsPopup(
    panel: BaseElement,
    closeMode?: 'manual' | 'managed'
  ): void {
    if (!this.modalPanelContainerEle) {
      throw this.ac.newError(
        `Modal panel can not be shown because the app does not have a suitable html template named 'modal-panel'`
      );
    }

    if (this.poppedupEle) {
      throw this.ac.newError(
        `Panel '${this.poppedupEle.name}' is already shown as popup. Panel ${panel.name} can not be shown as popup`
      );
    }

    const panelEle = panel.root;
    panelEle.remove(); //just in case it is still attached to the page
    htmlUtil.setViewState(panel.root, 'hidden', false); //just in case it was hidden
    this.modalPanelContainerEle.appendChild(panelEle);
    this.poppedupEle = panel;

    if (this.modalClosePanel) {
      const toHide = closeMode === 'managed';
      htmlUtil.setViewState(this.modalClosePanel, 'hidden', toHide);
    }

    htmlUtil.setViewState(this.modalPanelEle, 'hidden', false);
    this.poppedupEle = panel as BaseElement;
  }

  public closePopup(): void {
    if (!this.poppedupEle) {
      logger.warn(`No popup panel is shown currently. Nothing to hide`);
      return;
    }

    this.poppedupEle.root.remove();
    this.poppedupEle = undefined;
    htmlUtil.setViewState(this.modalPanelEle, 'hidden', true);
  }

  private purgeStack() {
    for (const entry of this.pageStack) {
      entry.ele.dispose();
    }

    this.pageStack.length = 0;
    logger.info(
      `Erased ${this.pageStack.length} pages from the stack as per navigation options.`
    );
  }

  private renderLayout(layoutName: string, options: NavigationOptions): string {
    if (this.layoutEle) {
      this.layoutEle.dispose();
    }
    const layout = this.ac.getLayout(layoutName);
    this.layoutEle = new LayoutElement(this.ac, layout);
    this.pageEle = htmlUtil.getChildElement(this.layoutEle.root, 'page');
    this.root.appendChild(this.layoutEle.root);
    //render the module and return the initial page name to be rendered
    return this.layoutEle.renderModule(options);
  }

  private closeModalPanel(): void {
    if (this.modalPanelContainerEle) {
      this.modalPanelContainerEle.innerHTML = '';
      htmlUtil.setViewState(this.modalPanelEle, 'hidden', true);
    }
  }

  private renderPage(pageName: string, asModal: boolean, inputData?: Vo): void {
    const page = this.ac.getPage(pageName);
    const pageView = new PageElement(this.ac, page, inputData || {});
    this.currentPage = pageView;
    this.modalOpened = asModal;

    if (asModal) {
      this.modalPageContainerEle!.appendChild(pageView.root);
    } else {
      this.layoutEle.displayMenuBar(!page.hideModules);
      this.pageEle.appendChild(pageView.root);
    }
    this.currentPage = pageView;
  }
}
