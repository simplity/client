import { SimpleRecord } from '@simplity';

export const _hierarchyDetails: SimpleRecord = {
  name: '_hierarchyDetails',
  nameInDb: '_hierarchy_details',
  recordType: 'simple',
  description: `Temporal topology of hierarchical connections. This record maintains the history of changes in the hierarchy definition.
    Each connection represents a link between a hierarchical unit and its parent unit at a specific point in time.`,
  generateClientForm: false,
  operations: ['create', 'filter', 'get', 'save', 'update'],
  fields: [
    {
      name: 'hierarchicalConnectionId',
      nameInDb: 'id',
      fieldType: 'generatedPrimaryKey',
      valueSchema: '_integer',
    },
    {
      name: 'parentId',
      nameInDb: 'parent_id',
      fieldType: 'requiredData',
      valueSchema: '_integer',
      foreignKey: {
        recordName: '_hierarchicalUnit',
        fieldName: 'hierarchicalUnitId',
      },
    },
    {
      name: 'childId',
      nameInDb: 'child_id',
      fieldType: 'requiredData',
      valueSchema: '_integer',
      foreignKey: {
        recordName: '_hierarchicalUnit',
        fieldName: 'hierarchicalUnitId',
      },
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
      description: 'null means still active',
    },
  ],
};
