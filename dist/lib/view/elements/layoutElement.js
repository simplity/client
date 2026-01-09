import { logger } from '../../logger';
import { htmlUtil } from './htmlUtils';
import { ModuleElement } from './moduleElement';
const PAGE_TITLE = 'page-title';
/**
 * Used exclusively by AppElement to manage non-page related view componnets in a layout
 *
 */
export class LayoutElement {
    ac;
    layout;
    root;
    /*
     * handle to the child elements
     */
    menuBarEle;
    //private readonly pageEle: HTMLElement;
    /**
     * html elements for any context-value being rendered in the layout
     */
    contextEles = {};
    currentModule;
    currentModuleEle;
    //private lc: LayoutController;
    /**
     * module names mapped to their indexes in the modules[] array
     */
    moduleMap = {};
    moduleElements = {};
    constructor(ac, layout) {
        this.ac = ac;
        this.layout = layout;
        this.root = htmlUtil.newHtmlElement('layout');
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
            pref = 'system';
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
    renderModule(options) {
        const mn = options.module || this.currentModule || this.layout.modules[0];
        const module = this.getInitialModule(mn);
        const moduleEle = this.moduleElements[module.name];
        //set current module
        htmlUtil.setViewState(moduleEle.root, 'current', true);
        if (this.currentModuleEle && this.currentModuleEle !== moduleEle) {
            htmlUtil.setViewState(this.currentModuleEle.root, 'current', false);
        }
        this.currentModuleEle = moduleEle;
        this.currentModule = mn;
        const menu = this.getInitialMenu(module, options.menuItem);
        if (!menu.pageName) {
            throw new Error(this.reportError(`Menu ${menu.name} has no associated page. Initial page can not be rendered`));
        }
        return menu.pageName;
    }
    displayMenuBar(toShow) {
        if (!this.menuBarEle) {
            return;
        }
        if (this.menuBarEle) {
            htmlUtil.setViewState(this.menuBarEle, 'hidden', !toShow);
        }
    }
    showModule(module) {
        if (module === this.currentModule) {
            return;
        }
        if (this.currentModuleEle) {
            htmlUtil.setViewState(this.currentModuleEle.root, 'current', false);
        }
        this.currentModuleEle = this.moduleElements[module];
        htmlUtil.setViewState(this.currentModuleEle.root, 'current', true);
        this.currentModule = module;
    }
    /**
     * to be called if the page was opened after retaining the earlier page
     */
    renderContextValues(values) {
        for (const [key, value] of Object.entries(values)) {
            const ele = this.contextEles[key];
            if (ele) {
                ele.textContent = value;
            }
        }
    }
    dispose() {
        this.root.remove();
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
        const moduleName = module.name;
        if (menuItem) {
            const item = this.ac.getMenuIfAccessible(moduleName, menuItem);
            if (item) {
                return item;
            }
            logger.error(`menuItem ${menuItem} is invalid, or is not accessible. navigating to the next possible menu item instead`);
        }
        for (const item of Object.values(module.menuItems)) {
            const menuItem = this.ac.getMenuIfAccessible(moduleName, item.name);
            if (menuItem) {
                return item;
            }
        }
        throw new Error(this.reportError(`Either no menu items are set in this module, or the logged-in user has no access to any menu items`));
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