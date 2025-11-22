import { logger } from '../../logger';
import { PageElement } from './pageElement';
import { htmlUtil } from './htmlUtils';
import { ModuleElement } from './moduleElement';
const PAGE_TITLE = 'page-title';
/**
 * Only child of AppElement. Defines the over-all layout
 */
export class LayoutElement {
    ac;
    layout;
    root;
    /*
     * handle to the child elements
     */
    pageEle;
    menuBarEle;
    /**
     * if a modal page is active
     */
    modalContainerEle;
    modalPageParent;
    modalPageView;
    /**
     * html elements for any context-value being rendered in the layout
     */
    contextEles = {};
    currentModule;
    //private lc: LayoutController;
    /**
     * module names mapped to their indexes in the modules[] array
     */
    moduleMap = {};
    moduleElements = {};
    /**
     * keeps track of active pages. Current one is on the top.
     */
    pageStack = [];
    constructor(ac, layout, options) {
        this.ac = ac;
        this.layout = layout;
        this.root = htmlUtil.newHtmlElement('layout');
        /**
         * keep the modal container ready;
         */
        this.modalContainerEle = htmlUtil.newHtmlElement('panel-modal');
        this.modalPageParent = htmlUtil.getChildElement(this.modalContainerEle, 'page');
        document.body.appendChild(this.modalContainerEle);
        /*
         * modules are mandatory. however, during development, it could be an empty array
         */
        let names = this.layout.modules || [];
        for (let i = 0; i < names.length; i++) {
            this.moduleMap[names[i]] = i;
        }
        this.menuBarEle = this.renderMenuBar();
        /**
         * hooks for rendering context-values
         */
        names = [PAGE_TITLE];
        if (this.layout.contextNamesToRender) {
            names = [PAGE_TITLE, ...this.layout.contextNamesToRender];
        }
        for (const nam of names) {
            const ele = htmlUtil.getOptionalElement(this.root, nam);
            if (ele) {
                this.contextEles[nam] = ele;
            }
        }
        this.initColorTheme();
        this.pageEle = htmlUtil.getChildElement(this.root, 'page');
        this.renderModule(options);
    }
    initColorTheme() {
        const colorTheme = htmlUtil.getOptionalElement(this.root, 'color-theme');
        if (!colorTheme) {
            logger.warn(`Layout ${this.layout.name} has no color theme element.`);
            return;
        }
        //check for user preference from local storage
        logger.info('local storage color-theme=', localStorage.getItem('color-theme'));
        let pref = (localStorage.getItem('color-theme') || 'system');
        if (!pref) {
            pref == 'system';
        }
        this.setColorTheme(pref);
        const checkedEle = colorTheme.querySelector('input[value="' + pref + '"]');
        if (!checkedEle) {
            logger.error(`Layout ${this.layout.name} has an invalid color theme element. radio button for preference ${pref} not found.`);
            return;
        }
        checkedEle.checked = true;
        colorTheme.addEventListener('change', (evt) => {
            const value = evt.target.value;
            this.setColorTheme(value);
            localStorage.setItem('color-theme', value);
        });
    }
    setColorTheme(pref) {
        let isDark = true;
        if (pref === 'system') {
            isDark =
                window.matchMedia &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
            logger.info('system theme detected. isDark=', isDark);
        }
        else {
            isDark = pref === 'dark';
        }
        if (isDark) {
            document.documentElement.setAttribute('dark', '');
        }
        else {
            document.documentElement.removeAttribute('dark');
        }
    }
    /**
     *
     */
    renderModule(options) {
        const mn = options.module || this.layout.modules[0];
        const module = this.getInitialModule(mn);
        const moduleEle = this.moduleElements[module.name];
        //set current module
        htmlUtil.setViewState(moduleEle.root, 'current', true);
        if (this.currentModule && this.currentModule !== moduleEle) {
            htmlUtil.setViewState(this.currentModule.root, 'current', false);
        }
        this.currentModule = moduleEle;
        const menu = this.getInitialMenu(module, options.menuItem);
        if (menu.pageName) {
            this.renderPage(menu.pageName, options);
        }
        else {
            throw new Error(this.reportError(`Menu ${menu.name} has no associated page. Initial page can not be rendered`));
        }
    }
    renderPage(pageName, options) {
        const page = this.ac.getPage(pageName);
        if (options.erasePagesOnTheStack) {
            this.purgeStack();
        }
        /**
         * if the old page was modal, we just close that
         */
        if (this.modalPageView) {
            this.closeModalPage();
        }
        else {
            const lastEntry = this.pageStack.pop();
            if (lastEntry) {
                if (options.asModal || options.retainCurrentPage) {
                    //save the scroll position for us to get back to
                    lastEntry.scrollTop = document.documentElement.scrollTop;
                    this.pageStack.push(lastEntry); //retain the current page.
                    if (!options.asModal) {
                        //hide it if not modal
                        htmlUtil.setViewState(lastEntry.ele.root, 'hidden', true);
                    }
                }
                else {
                    //old page is gone
                    lastEntry.ele.root.remove();
                }
            }
        }
        const pageView = new PageElement(this.ac, page, options.pageParameters || {});
        if (options.asModal && this.modalContainerEle) {
            this.modalPageView = pageView;
            this.modalPageParent.appendChild(pageView.root);
            htmlUtil.setViewState(this.modalContainerEle, 'hidden', false);
        }
        else {
            this.pageStack.push({
                ele: pageView,
                scrollTop: 0,
            });
            this.pageEle.appendChild(pageView.root);
        }
        if (this.menuBarEle) {
            const toHide = this.modalPageView === undefined && !!page.hideModules;
            htmlUtil.setViewState(this.menuBarEle, 'hidden', toHide);
        }
    }
    /**
     * to be called if the page was opened after retaining the earlier page
     */
    closeCurrentPage() {
        if (this.modalPageView) {
            this.closeModalPage();
            return;
        }
        let entry = this.pageStack.pop();
        if (!entry) {
            logger.error(`layout.closeCurrentPage() invoked but there is no page open!!`);
            return;
        }
        if (this.pageStack.length === 0) {
            logger.error(`page '${entry.ele.page.name}' cannot be closed because there is no active page to render. Error in page navigation design`);
            return;
        }
        entry.ele.root.remove();
        //show the last page
        entry = this.pageStack[this.pageStack.length - 1];
        htmlUtil.setViewState(entry.ele.root, 'hidden', false);
        if (this.menuBarEle) {
            const toHide = !!entry.ele.page.hideModules;
            htmlUtil.setViewState(this.menuBarEle, 'hidden', toHide);
        }
        window.scrollTo({ top: entry.scrollTop, behavior: 'instant' });
    }
    closeModalPage() {
        htmlUtil.setViewState(this.modalContainerEle, 'hidden', true);
        this.modalPageView.root.remove();
        this.modalPageView = undefined;
    }
    purgeStack() {
        if (this.modalPageView) {
            this.modalPageView.root.remove;
        }
        for (const entry of this.pageStack) {
            entry.ele.root.remove();
        }
    }
    getInitialModule(startWith) {
        let module;
        if (startWith) {
            module = this.ac.getModuleIfAccessible(startWith);
        }
        if (module) {
            return module;
        }
        for (const m of this.layout.modules) {
            module = this.ac.getModule(m);
            if (module) {
                return module;
            }
        }
        //we have to clash a message and go login etc???
        throw new Error(this.reportError(`Either no modules are set in this layout, or the logged-in user has no access to any module`));
    }
    getInitialMenu(module, menuItem) {
        if (menuItem) {
            const item = this.ac.getMenuIfAccessible(menuItem);
            if (item) {
                return item;
            }
            logger.error(`menuItem ${menuItem} is invalid, or is not accessible. navigating to the next possible menu item instead`);
        }
        for (const nam of module.menuItems) {
            const item = this.ac.getMenuIfAccessible(nam);
            if (item) {
                return item;
            }
        }
        throw new Error(this.reportError(`Either no menu items are set in this module, or the logged-in user has no access to any menu items`));
    }
    renderPageTitle(title) {
        const ele = this.contextEles[PAGE_TITLE];
        if (ele) {
            ele.textContent = title;
        }
        else {
            logger.warn('Current layout is not designed to render page title. Page title not rendered');
        }
    }
    renderContextValues(values) {
        for (const [key, value] of Object.entries(values)) {
            const ele = this.contextEles[key];
            if (ele) {
                ele.textContent = value;
            }
        }
    }
    renderMenuBar() {
        const menubar = htmlUtil.getOptionalElement(this.root, 'menu-bar');
        if (!menubar) {
            logger.info(`Layout ${this.layout.name} has no child element with data-id="menu-bar". Menu not rendered`);
            return;
        }
        for (const moduleName of this.layout.modules) {
            const module = this.ac.getModule(moduleName);
            const mg = new ModuleElement(this.ac, module);
            this.moduleElements[moduleName] = mg;
            const label = htmlUtil.getChildElement(mg.root, 'label');
            if (module.icon) {
                htmlUtil.appendIcon(label, module.icon);
            }
            htmlUtil.appendText(label, module.label);
            menubar.appendChild(mg.root);
        }
        return menubar;
    }
    reportError(msg) {
        logger.error(msg);
        return msg;
    }
}
//# sourceMappingURL=layoutElement.js.map