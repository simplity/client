import { FormController, PageController, Tabs } from 'src/lib/types';
import { BaseElement } from './baseElement';
export declare class TabsElement extends BaseElement {
    constructor(pc: PageController, fc: FormController | undefined, tabs: Tabs, maxWidth: number);
}
