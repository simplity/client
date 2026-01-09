import { Button, FormController, PageController, StaticComp } from '@simplity';
import { BaseElement } from './baseElement';
import { HtmlTemplateName, htmlUtil } from './htmlUtils';
import { logger } from 'lib/logger';

/**
 * base class for elements and buttons. These are elements with no children.
 * These elements are allowed to be rendered inside a TablePanel, in which case we have to handle them with their rowId.
 * This base class handles that part.
 */
export class LeafElement extends BaseElement {
  constructor(
    public readonly pc: PageController,
    fc: FormController | undefined,
    public comp: StaticComp | Button,
    maxWidth: number
  ) {
    super(pc, fc, comp, comp.compType as HtmlTemplateName, maxWidth);
    /**
     * no labels inside grids
     */
    if (maxWidth === 0 && this.labelEle) {
      this.labelEle.remove();
      this.labelEle = undefined;
    }

    //TODO: handle different types of static components
    const ct = comp.compType;
    if (ct === 'static') {
      const content = (comp as StaticComp).content || '';
      const ele = htmlUtil.getChildElement(this.root, 'content');
      ele.innerHTML = content;
      return;
    }
    if (ct !== 'button') {
      logger.error(
        `LeafElement instantiated with unsupported component type '${ct}'`
      );
      return;
    }
  }
}
