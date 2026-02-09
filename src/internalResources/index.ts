import { internalMessages } from './internalMessages';
import { _reportSettings } from './rec/_reportSettings.rec';
import { internalValueLists } from './internalValueLists';
import { internalValueSchemas } from './internalValueSchemas';
import { _columnSelection } from './rec/_columnSelection.rec';
import { _filters } from './rec/_filters.rec';
import { _reportSettingsHeader } from './rec/_reportSettingsHeader.rec';
import { _sorts } from './rec/_sorts.rec';

export const internalResources = {
  records: {
    _columnSelection,
    _filters,
    _reportSettings,
    _reportSettingsHeader,
    _sorts,
  },
  messages: internalMessages,
  valueLists: internalValueLists,
  valueSchemas: internalValueSchemas,
};
