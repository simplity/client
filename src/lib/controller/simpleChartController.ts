import { logger } from '../logger';
import {
  Chart,
  ChartController,
  ChartView,
  FormController,
  Value,
  Values,
  Vo,
} from '@simplity';

export class SimpleChartController implements ChartController {
  private data: Vo[] = [];
  public readonly name;
  public readonly type = 'chart';
  public readonly pc;
  public readonly chart: Chart;

  constructor(
    public readonly fc: FormController,
    private readonly view: ChartView,
  ) {
    this.name = view.name;
    this.pc = fc.pc;
    this.chart = view.chart;
  }

  isEditable(): boolean {
    return false;
  }
  setFieldValue(fieldName: string, value: Value): void {
    console.error(
      `Chart Component ${this.name} : setFieldValue() for field ${fieldName} with a value of '${value}' is ignored as chart is not editable.`,
    );
  }
  setDisplayState(compName: string, _settings: Values): boolean {
    console.error(
      `Chart Component '${this.name}' : setDisplayState() for a sub-component named ${compName} is ignored`,
    );
    return false;
  }

  getFormName(): string | undefined {
    return undefined;
  }

  receiveData(data: Vo | Vo[], _childName?: string): void {
    if (Array.isArray(data)) {
      this.setData(data as Values[]);
      return;
    }
    const arr = data[this.name] || data['list'];
    if (arr && Array.isArray(arr)) {
      this.setData(arr as Values[]);
      return;
    }
    logger.error(
      `${this.name} requires a tabular data but a non-array data is being set. Data ignored`,
    );
  }

  setData(data: Vo | Vo[]): void {
    if (Array.isArray(data)) {
      this.data = data;
      this.view.renderData(data as Values[]);
      return;
    }
    console.error(
      `Chart Component ${this.name}: Non-array data is received. Data Ignored`,
      data,
    );
  }
  getData(): Vo | Vo[] {
    return this.data;
  }
  isModified(): boolean {
    return false;
  }
  isValid(): boolean {
    return true;
  }
  validate(): boolean {
    return true;
  }

  resetData(_fields?: string[]): void {
    this.setData([]);
  }
  getFieldValue(fieldName: string): Value | undefined {
    console.error(
      `Chart Component ${this.name}: getFieldValue() for field ${fieldName} is not supported.`,
    );
    return undefined;
  }
}
