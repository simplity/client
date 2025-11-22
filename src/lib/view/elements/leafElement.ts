import { Button, FormController, PageController, StaticComp } from '@/types';
import { BaseElement } from './baseElement';
import { HtmlTemplateName } from './htmlUtils';

const getTemplateName = (comp: StaticComp | Button): HtmlTemplateName | '' => {
  if (comp.compType == 'button') {
    return 'button';
  }
  const st = comp as StaticComp;
  console.info(
    `going to create leaf element ${st.name} with type='${st.variant}' and templateName='${st.templateName}'`,
  );
  return st.variant || '';
};

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
    maxWidth: number,
  ) {
    super(pc, fc, comp, getTemplateName(comp), maxWidth);
    /**
     * no labels inside grids
     */
    if (maxWidth === 0 && this.labelEle) {
      this.labelEle.remove();
      this.labelEle = undefined;
    }
  }
}
