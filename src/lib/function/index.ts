import { FunctionImpl, StringMap } from '@/types';
import { _initDatePicker } from './_initDatePicker.fn';

export const internalFunctions: StringMap<FunctionImpl> = {
  _initDatePicker,
};
