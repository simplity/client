import { SimpleRecord } from '@simplity';

export const _hierarchy: SimpleRecord = {
  name: '_hierarchy',
  nameInDb: '_hierarchies',
  recordType: 'simple',
  description:
    'Defined hierarchy, like administrative units, product categories etc.',
  generateClientForm: false,
  operations: ['create', 'filter', 'get', 'save', 'update'],
  fields: [
    {
      name: 'hierarchyId',
      nameInDb: 'id',
      fieldType: 'generatedPrimaryKey',
      valueSchema: '_integer',
    },
    {
      name: 'name',
      fieldType: 'requiredData',
      valueSchema: '_text',
      nameInDb: 'name',
      description: `This is an internal name, and is not rendered on any client-page.
      Must follow naming convention for entityNames. like admin, sales, etc..
      This is used in the code to refer to the hierarchy, and must be unique across hierarchies.`,
    },
    {
      name: 'effectiveAt',
      nameInDb: 'effective_at',
      fieldType: 'requiredData',
      valueSchema: '_dateTime',
    },
    {
      name: 'discontinuedAt',
      nameInDb: 'discontinued_at',
      fieldType: 'optionalData',
      valueSchema: '_dateTime',
    },
  ],
  uniqueFields: [{ description: 'Name must be unique', fields: ['name'] }],
};
