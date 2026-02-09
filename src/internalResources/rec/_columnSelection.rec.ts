import { SimpleRecord } from '@simplity';

export const _columnSelection: SimpleRecord = {
  name: '_columnSelection',
  generateClientForm: true,
  recordType: 'simple',
  description: 'Column/Field to be included in the report',
  fields: [
    { name: 'seqNo', fieldType: 'optionalData', valueSchema: '_integer' },
    { name: 'name', fieldType: 'requiredData', valueSchema: '_text' },
    { name: 'label', fieldType: 'requiredData', valueSchema: 'text' },
  ],
};
