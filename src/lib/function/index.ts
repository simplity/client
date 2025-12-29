import { FunctionImpl, StringMap } from 'src/lib/types';
import { _initDatePicker } from './_initDatePicker.fn';

export const internalFunctions: StringMap<FunctionImpl> = {
  _initDatePicker,
};
