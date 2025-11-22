import { DataField, FormController, PageController, Value } from '@/types';
import { BaseElement } from './baseElement';

export class HiddenField extends BaseElement {
  constructor(
    pc: PageController,
    fc: FormController | undefined,
    public readonly field: DataField,
    maxWidth: number,
    value?: Value,
  ) {
    super(pc, fc, field, '', maxWidth);
    if (!fc) {
      return;
    }

    let val = value;
    if (val === undefined) {
      val = field.initialValue;
    }
    if (val !== undefined) {
      if (this.fc) {
        this.fc.valueHasChanged(this.name, val);
      }
    }
  }
}
