import { Chart, ChartController, ChartView, FormController, Value, Values, Vo } from '@simplity';
export declare class SimpleChartController implements ChartController {
    readonly fc: FormController;
    private readonly view;
    private data;
    readonly name: string;
    readonly type = "chart";
    readonly pc: import("@simplity").PageController;
    readonly chart: Chart;
    constructor(fc: FormController, view: ChartView);
    isEditable(): boolean;
    setFieldValue(fieldName: string, value: Value): void;
    setDisplayState(compName: string, _settings: Values): boolean;
    getFormName(): string | undefined;
    receiveData(data: Vo | Vo[], _childName?: string): void;
    setData(data: Vo | Vo[]): void;
    getData(): Vo | Vo[];
    isModified(): boolean;
    isValid(): boolean;
    validate(): boolean;
    resetData(_fields?: string[]): void;
    getFieldValue(fieldName: string): Value | undefined;
}
