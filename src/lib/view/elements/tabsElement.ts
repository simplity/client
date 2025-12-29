import { FormController, PageController, Tabs } from 'src/lib/types';
import { BaseElement } from './baseElement';

export class TabsElement extends BaseElement {
  constructor(
    pc: PageController,
    fc: FormController | undefined,
    tabs: Tabs,
    maxWidth: number
  ) {
    super(pc, fc, tabs, 'tabs', maxWidth);
  }
}
