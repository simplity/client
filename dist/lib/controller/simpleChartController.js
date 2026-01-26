import { logger } from '../logger';
export class SimpleChartController {
    fc;
    view;
    data = [];
    name;
    type = 'chart';
    pc;
    chart;
    constructor(fc, view) {
        this.fc = fc;
        this.view = view;
        this.name = view.name;
        this.pc = fc.pc;
        this.chart = view.chart;
    }
    isEditable() {
        return false;
    }
    setFieldValue(fieldName, value) {
        console.error(`Chart Component ${this.name} : setFieldValue() for field ${fieldName} with a value of '${value}' is ignored as chart is not editable.`);
    }
    setDisplayState(compName, _settings) {
        console.error(`Chart Component '${this.name}' : setDisplayState() for a sub-component named ${compName} is ignored`);
        return false;
    }
    getFormName() {
        return undefined;
    }
    receiveData(data, _childName) {
        if (Array.isArray(data)) {
            this.setData(data);
            return;
        }
        const arr = data[this.name] || data['list'];
        if (arr && Array.isArray(arr)) {
            this.setData(arr);
            return;
        }
        logger.error(`${this.name} requires a tabular data but a non-array data is being set. Data ignored`);
    }
    setData(data) {
        if (Array.isArray(data)) {
            this.data = data;
            this.view.renderData(data);
            return;
        }
        console.error(`Chart Component ${this.name}: Non-array data is received. Data Ignored`, data);
    }
    getData() {
        return this.data;
    }
    isModified() {
        return false;
    }
    isValid() {
        return true;
    }
    validate() {
        return true;
    }
    resetData(_fields) {
        this.setData([]);
    }
    getFieldValue(fieldName) {
        console.error(`Chart Component ${this.name}: getFieldValue() for field ${fieldName} is not supported.`);
        return undefined;
    }
}
//# sourceMappingURL=simpleChartController.js.map