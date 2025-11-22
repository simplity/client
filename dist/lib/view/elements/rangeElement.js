import { BaseElement } from './baseElement';
import { htmlUtil } from './htmlUtils';
import { elementFactory } from './elementFactory';
export class RangeElement extends BaseElement {
    pc;
    range;
    fromView;
    toView;
    constructor(pc, fc, range, maxWidth) {
        super(pc, fc, range, 'range-wrapper', maxWidth);
        this.pc = pc;
        this.range = range;
        this.fromView = elementFactory.newElement(this.pc, fc, range.fromField, maxWidth);
        let ele = htmlUtil.getChildElement(this.root, 'from-field');
        ele.appendChild(this.fromView.root);
        this.toView = elementFactory.newElement(this.pc, fc, range.toField, maxWidth);
        ele = htmlUtil.getChildElement(this.root, 'to-field');
        ele.appendChild(this.toView.root);
    }
}
//# sourceMappingURL=rangeElement.js.map