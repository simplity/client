import { Datepicker } from 'flowbite';
const OPTIONS = {
    autohide: true,
    format: 'yyyy-mm-dd',
    orientation: 'bottom',
    buttons: false,
};
/**
 * this function is tightly coupled wit the way date-picker html template is written
 * @param view
 */
const fn = (view) => {
    const fieldView = view;
    const field = fieldView.comp;
    //ele.readOnly = true;
    const options = { ...OPTIONS };
    const schemaName = field.valueSchema;
    if (schemaName) {
        const vs = view.ac.getValueSchema(schemaName);
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
    const ele = fieldView.fieldEle;
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
export const _initDatePicker = {
    type: 'init',
    fn,
};
//# sourceMappingURL=_initDatePicker.fn.js.map