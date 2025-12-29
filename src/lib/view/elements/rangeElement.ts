import {
  DataField,
  FormController,
  PageController,
  RangePanel,
} from 'src/lib/types';
import { BaseElement } from './baseElement';
import { htmlUtil } from './htmlUtils';
import { elementFactory } from './elementFactory';
import { FieldElement } from './fieldElement';

export class RangeElement extends BaseElement {
  public readonly fromView: FieldElement;
  public readonly toView: FieldElement;

  constructor(
    public readonly pc: PageController,
    fc: FormController | undefined,
    public readonly range: RangePanel,
    maxWidth: number
  ) {
    super(pc, fc, range, 'range-wrapper', maxWidth);

    this.fromView = elementFactory.newElement(
      this.pc,
      fc,
      range.fromField as DataField,
      maxWidth
    ) as FieldElement;

    let ele = htmlUtil.getChildElement(this.root, 'from-field');
    ele.appendChild(this.fromView.root);

    this.toView = elementFactory.newElement(
      this.pc,
      fc,
      range.toField as DataField,
      maxWidth
    ) as FieldElement;
    ele = htmlUtil.getChildElement(this.root, 'to-field');
    ele.appendChild(this.toView.root);
  }
}
