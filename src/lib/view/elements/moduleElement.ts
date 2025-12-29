import { AppController, Module, StringMap } from 'src/lib/types';
import { htmlUtil } from './htmlUtils';
import { MenuItemElement } from './menuItemElement';

export class ModuleElement {
  readonly root: HTMLElement;
  private readonly menuItems: StringMap<MenuItemElement> = {};
  private readonly menuEle: HTMLElement;
  constructor(
    private readonly ac: AppController,
    private readonly module: Module
  ) {
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
      const menuItemElement = new MenuItemElement(menu);
      this.menuItems[item.name] = menuItemElement;
      menuItemElement.root.addEventListener('click', () => {
        this.ac.menuSelected(this.module.name, item.name);
      });

      this.menuEle.appendChild(menuItemElement.root);
    }
  }
}
