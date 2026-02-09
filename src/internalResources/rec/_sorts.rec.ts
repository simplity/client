import { SimpleRecord } from '@simplity';

export const _sorts: SimpleRecord = {
  name: '_sorts',
  generateClientForm: true,
  recordType: 'simple',
  description: 'Columns to be sorted on',
  fields: [
    { name: 'name', fieldType: 'requiredData', valueSchema: '_text' },
    {
      name: 'ascending',
      fieldType: 'requiredData',
      valueSchema: '_boolean',
      renderAs: 'check-box',
    },
  ],
};
