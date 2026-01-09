import { BaseElement } from './baseElement';
import { htmlUtil } from './htmlUtils';
import { logger } from 'lib/logger';
/**
 * base class for elements and buttons. These are elements with no children.
 * These elements are allowed to be rendered inside a TablePanel, in which case we have to handle them with their rowId.
 * This base class handles that part.
 */
export class LeafElement extends BaseElement {
    pc;
    comp;
    constructor(pc, fc, comp, maxWidth) {
        super(pc, fc, comp, comp.compType, maxWidth);
        this.pc = pc;
        this.comp = comp;
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
            const content = comp.content || '';
            const ele = htmlUtil.getChildElement(this.root, 'content');
            ele.innerHTML = content;
            return;
        }
        if (ct !== 'button') {
            logger.error(`LeafElement instantiated with unsupported component type '${ct}'`);
            return;
        }
    }
}
//# sourceMappingURL=leafElement.js.map