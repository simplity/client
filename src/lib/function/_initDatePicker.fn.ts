import { FieldElement } from '../view/elements';
import { Datepicker, DatepickerOptions } from 'flowbite';
import { DataField, DateSchema, FunctionImpl, ViewInitFunction } from '@/types';
const OPTIONS: DatepickerOptions = {
  autohide: true,
  format: 'yyyy-mm-dd',
  orientation: 'bottom',
  buttons: false,
};
/**
 * this function is tightly coupled wit the way date-picker html template is written
 * @param view
 */
const fn: ViewInitFunction = (view) => {
  const fieldView = view as FieldElement;
  const field = fieldView.comp as DataField;
  //ele.readOnly = true;

  const options = { ...OPTIONS };
  const schemaName = field.valueSchema;
  if (schemaName) {
    const vs = view.ac.getValueSchema(schemaName) as DateSchema;
    let date = new Date();
    if (vs.maxFutureDays) {
      date.setDate(date.getDate() + vs.maxFutureDays);
      options.maxDate = date.toISOString().substring(0, 10);
    }
    if (vs.maxPastDays) {
      date.setDate(date.getDate() - vs.maxPastDays);
      options.minDate = date.toISOString().substring(0, 10);
    }
  }

  const ele = fieldView.fieldEle as HTMLInputElement;
  ele.autocomplete = 'off';
  const d = new Datepicker(ele, options);
  /**
   * flowbite triggers dateChange, and not 'change' on the element
   * not sure why they chose to dao that!
   * Here, we do the 'right thing' by triggering onchange event for the input element
   */
  ele.addEventListener('changeDate', () => {
    fieldView.valueHasChanged(ele.value.trim());
  });
  /**
   * save the date picker for any use:
   * known use as of now: Range picker destroys it before creating a range packer
   */
  view.initInfo.datePicker = d;
};

export const _initDatePicker: FunctionImpl = {
  type: 'init',
  fn,
};
