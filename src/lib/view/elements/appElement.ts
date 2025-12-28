import {
  Alert,
  AppController,
  AppView,
  NavigationOptions,
  StringMap,
  Values,
  Vo,
} from '@/types';

import { PageElement } from './pageElement';
import { ChildElementId, htmlUtil } from './htmlUtils';
import { LayoutElement } from './layoutElement';
import { logger } from '../../logger';

const PAGE_TITLE = 'page-title';
/**
 * we may need to keep track of certain other states of the pages on steck.
 * hence this wrapper type
 */
type PageOnStack = { ele: PageElement; scrollTop: number };

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

  private readonly modalEle?: HTMLElement;
  private readonly modalPageEle?: HTMLElement;

  /**
   * keeps track of active pages. Current one is on the top.
   */
  private readonly pageStack: PageOnStack[] = [];
  /**
   * is the last opened page modal?
   */
  private modalOpened = false;
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
     * modal container
     */
    this.modalEle = htmlUtil.newHtmlElement('modal-panel');
    if (this.modalEle) {
      this.modalPageEle = htmlUtil.getChildElement(this.modalEle, 'page');
      if (!this.modalPageEle) {
        throw new Error(
          `Modal panel html template must have a child element with data-id="page"`
        );
      }

      const closeBtn = htmlUtil.getOptionalElement(
        this.modalEle,
        'close-button'
      );
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          this.closePage();
        });
      }
      document.body.appendChild(this.modalEle);
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
    startingModule: string
  ): void {
    this.ac = ac;
    const pageName = this.renderLayout(startinglayout, {
      module: startingModule,
    });
    this.renderPage(pageName, false);
  }

  public navigate(options: NavigationOptions) {
    if (options.erasePagesOnTheStack && this.pageStack.length) {
      this.purgeStack();
    }

    let pageName: string;

    //navigate to a layout??
    if (options.layout && this.layoutEle.layout.name !== options.layout) {
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
      pageName = this.renderLayout(options.layout, options);
    } else {
      pageName = this.layoutEle.renderModule(options);
    }

    const lastEntry = this.pageStack[this.pageStack.length - 1];
    if (lastEntry) {
      if (options.asModal) {
        if (!this.modalEle || !this.modalPageEle) {
          throw this.ac.newError(
            `Modal page requested but the app html template has no modal-panel defined`
          );
        }
        this.modalOpened = true;
        htmlUtil.setViewState(this.modalEle, 'hidden', false);
      } else if (options.retainCurrentPage) {
        //hide the last page
        lastEntry.scrollTop = document.documentElement.scrollTop;
        htmlUtil.setViewState(lastEntry.ele.root, 'hidden', true);
      } else {
        lastEntry.ele.dispose();
        this.pageStack.pop();
      }
    }

    this.renderPage(pageName, options.asModal || false, options.pageParameters);
  }

  public closePage(): void {
    let entry = this.pageStack.pop();
    if (!entry) {
      logger.error(`appElement.closeCurrentPage() invoked no page is open!!`);
      return;
    }

    // App must have at least one page rendered at all times
    if (this.pageStack.length === 0) {
      logger.error(
        `page '${entry.ele.page.name}' cannot be closed because there is no active page to render. Error in page navigation design`
      );
      return;
    }
    entry.ele.dispose();

    if (this.modalOpened) {
      this.modalOpened = false;
      htmlUtil.setViewState(this.modalEle!, 'hidden', true);
    }

    //show the previous page
    entry = this.pageStack[this.pageStack.length - 1];
    htmlUtil.setViewState(entry.ele.root, 'hidden', false);

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
    const layout = this.ac.getLayout(layoutName);
    this.layoutEle = new LayoutElement(this.ac, layout);
    this.pageEle = htmlUtil.getChildElement(this.layoutEle.root, 'page');
    this.root.appendChild(this.layoutEle.root);
    //render the module and return the initial page name to be rendered
    return this.layoutEle.renderModule(options);
  }

  private renderPage(
    pageName: string,
    asModal: boolean,
    pageParameters?: Values
  ): void {
    const page = this.ac.getPage(pageName);
    const pageView = new PageElement(this.ac, page, pageParameters || {});

    this.pageStack.push({
      ele: pageView,
      scrollTop: 0,
    });

    if (asModal) {
      this.modalPageEle!.appendChild(pageView.root);
    } else {
      this.layoutEle.displayMenuBar(!page.hideModules);
      this.pageEle.appendChild(pageView.root);
    }
  }
}
