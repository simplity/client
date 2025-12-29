import { Button, FormController, PageController, StaticComp } from 'src/lib/types';
import { BaseElement } from './baseElement';
/**
 * base class for elements and buttons. These are elements with no children.
 * These elements are allowed to be rendered inside a TablePanel, in which case we have to handle them with their rowId.
 * This base class handles that part.
 */
export declare class LeafElement extends BaseElement {
    readonly pc: PageController;
    comp: StaticComp | Button;
    constructor(pc: PageController, fc: FormController | undefined, comp: StaticComp | Button, maxWidth: number);
}
