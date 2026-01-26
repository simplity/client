import { SimpleRecord } from '@simplity';

export const _reportSettings: SimpleRecord = {
  name: '_reportSettings',
  recordType: 'simple',
  description:
    'configuration of a dynamic report. This may be done by the app=administrator, or by an end-users',
  isVisibleToClient: true,
  nameInDb: '_report_settings',
  operations: ['create', 'delete', 'filter', 'get', 'save', 'update'],
  fields: [
    {
      name: 'reportName',
      fieldType: 'primaryKey',
      valueSchema: '_text',
      nameInDb: 'report_name',
      description:
        'Name of the underlying record that can fetch data for this report using filter method',
    },
    {
      name: 'variantName',
      fieldType: 'primaryKey',
      valueSchema: '_text',
      nameInDb: 'variant_name',
      description: 'Must be unique for a record.',
      label: 'Variant Name',
    },

    /*
     * we need fields regarding ownership and security. We will add them later
     */
    {
      name: 'settings',
      fieldType: 'requiredData',
      valueSchema: '_text',
      nameInDb: 'settings',
      description: 'JSON for the settings.',
    },
  ],
};
