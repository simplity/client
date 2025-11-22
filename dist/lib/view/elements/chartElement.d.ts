import { Chart as ChartComp, //Chart is taken by chart.js
ChartView, FormController, PageController, Vo } from '@/types';
import { BaseElement } from './baseElement';
export declare class ChartElement extends BaseElement implements ChartView {
    readonly fc: FormController;
    readonly chart: ChartComp;
    /**
     * for implementing sort feature
     */
    private data;
    readonly cc: import("@/types").ChartController;
    private readonly chartEle;
    private readonly labels;
    private readonly fieldNames;
    constructor(pc: PageController, fc: FormController, chart: ChartComp, maxWidth: number);
    /**
     *
     * @param data
     * @param columnNames is specified, we are to render these columns, in that order
     */
    renderData(data: Vo[], _columnNames?: string[]): void;
    private chartClicked;
    /**
     * remove all rows that are rendered. Remove the header if it is dynamic
     */
    reset(_headerAsWell?: boolean): void;
}
