import { BaseElement } from './baseElement';
export class HiddenField extends BaseElement {
    field;
    constructor(pc, fc, field, maxWidth, value) {
        super(pc, fc, field, '', maxWidth);
        this.field = field;
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
//# sourceMappingURL=hiddenField.js.map