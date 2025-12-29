import { Chart, ChartController, ChartView, FormController, Values, Vo } from 'src/lib/types';
export declare class SimpleChartController implements ChartController {
    readonly fc: FormController;
    private readonly view;
    private data;
    readonly name: string;
    readonly type = "chart";
    readonly pc: import("src/lib/types").PageController;
    readonly chart: Chart;
    constructor(fc: FormController, view: ChartView);
    setDisplayState(compName: string, settings: Values): boolean;
    getFormName(): string | undefined;
    receiveData(data: Vo | Vo[], _childName?: string): void;
    setData(data: Vo | Vo[]): void;
    getData(): Vo | Vo[];
    isModified(): boolean;
    isValid(): boolean;
    validate(): boolean;
    resetData(fields?: string[]): void;
}
