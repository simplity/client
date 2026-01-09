import { FormController, PageController, RangePanel } from '@simplity';
import { BaseElement } from './baseElement';
import { FieldElement } from './fieldElement';
export declare class RangeElement extends BaseElement {
    readonly pc: PageController;
    readonly range: RangePanel;
    readonly fromView: FieldElement;
    readonly toView: FieldElement;
    constructor(pc: PageController, fc: FormController | undefined, range: RangePanel, maxWidth: number);
}
