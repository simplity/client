import { internalMessages } from './internalMessages';
import { _reportSettings } from './rec/_reportSettings';
import { internalValueLists } from './internalValueLists';
import { internalValueSchemas } from './internalValueSchemas';
import { _columnSelection } from './rec/_columnSelection';
import { _filters } from './rec/_filters';
import { _reportSettingsHeader } from './rec/_reportSettingsHeader';
import { _sorts } from './rec/_sorts';

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
