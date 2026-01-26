import { SimpleRecord } from '@simplity';

export const _filters: SimpleRecord = {
  name: '_filters',
  isVisibleToClient: true,
  recordType: 'simple',
  description: 'Filtering criterion for columns',
  fields: [
    {
      name: 'name',
      fieldType: 'requiredData',
      valueSchema: '_text',
      label: 'Name',
    },
    {
      name: 'comparator',
      fieldType: 'requiredData',
      valueSchema: '_text',
      label: 'Condition',
    },
    { name: 'value', fieldType: 'requiredData', valueSchema: '_text' },
    { name: 'toValue', fieldType: 'optionalData', valueSchema: '_text' },
  ],
};
