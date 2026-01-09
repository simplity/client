import { htmlUtil } from './htmlUtils';
import { MenuItemElement } from './menuItemElement';
export class ModuleElement {
    ac;
    module;
    root;
    menuItems = {};
    menuEle;
    constructor(ac, module) {
        this.ac = ac;
        this.module = module;
        this.root = htmlUtil.newHtmlElement('module');
        this.menuEle = htmlUtil.getChildElement(this.root, 'menu-item');
        /*
         * module with single menu acts as direct menu item
         */
        const arrowEle = htmlUtil.getOptionalElement(this.root, 'arrow-icon');
        const items = this.module.menuItems;
        if (items.length === 1) {
            if (arrowEle) {
                htmlUtil.setViewState(arrowEle, 'hidden', true);
                htmlUtil.setViewState(this.root, 'empty', true);
            }
            this.root.addEventListener('click', () => {
                this.ac.menuSelected(this.module.name, items[0].name);
            });
            return;
        }
        const moduleName = this.module.name;
        for (const item of this.module.menuItems) {
            const menu = this.ac.getMenu(moduleName, item.name);
            if (menu.isHidden) {
                continue;
            }
            const menuItemElement = new MenuItemElement(menu);
            this.menuItems[item.name] = menuItemElement;
            menuItemElement.root.addEventListener('click', () => {
                this.ac.menuSelected(this.module.name, item.name);
            });
            this.menuEle.appendChild(menuItemElement.root);
        }
    }
}
//# sourceMappingURL=moduleElement.js.map