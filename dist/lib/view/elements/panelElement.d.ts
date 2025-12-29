import { FormController, PageController, Panel, PanelView } from 'src/lib/types';
import { BaseElement } from './baseElement';
export declare class PanelElement extends BaseElement implements PanelView {
    readonly panel: Panel;
    /**
     * in case this panel is associated with a child-form
     */
    readonly childFc?: FormController;
    constructor(pc: PageController, fc: FormController | undefined, panel: Panel, maxWidth: number);
}
