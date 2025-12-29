import { DataField, FormController, PageController, Value } from 'src/lib/types';
import { BaseElement } from './baseElement';
export declare class HiddenField extends BaseElement {
    readonly field: DataField;
    constructor(pc: PageController, fc: FormController | undefined, field: DataField, maxWidth: number, value?: Value);
}
