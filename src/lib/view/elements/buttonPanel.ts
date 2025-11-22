import { Button, ButtonPanel, FormController, PageController } from '@/types';
import { BaseElement } from './baseElement';
import { elementFactory } from './elementFactory';
import { ChildElementId, htmlUtil } from './htmlUtils';

/**
 * button panel renders action buttons, typically at the bottom of a form
 * Current design is to use left, center and right partitions to render three types of buttons.
 * 1. buttons to go back on the left
 * 2. action buttons for this form in the center
 * 3. buttons that take you forward, like next step, on the right
 *
 * this is just a wrapper and is not a component. It's job is to render its child components
 */
export class ButtonPanelElement extends BaseElement {
  constructor(
    pc: PageController,
    fc: FormController | undefined,
    public readonly panel: ButtonPanel,
    maxWidth: number,
  ) {
    super(pc, fc, panel, 'button-panel', maxWidth);
    /**
     * render the three sets of buttons
     */
    for (const [place, buttons] of [
      ['left', panel.leftButtons],
      ['middle', panel.middleButtons],
      ['right', panel.rightButtons],
    ] as [string, Button[]][]) {
      if (buttons) {
        const parent = htmlUtil.getChildElement(
          this.root,
          place as ChildElementId,
        );
        for (const button of buttons) {
          const ele = elementFactory.newElement(pc, fc, button, 0);
          parent.appendChild(ele.root);
        }
      }
    }
  }
}
