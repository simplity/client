import { SimpleRecord } from '@simplity';

export const _hierarchicalUnit: SimpleRecord = {
  name: '_hierarchicalUnit',
  nameInDb: '_hierarchical_units',
  recordType: 'simple',
  description: `This is a unit on its own, and not yet connected to the hierarchy.
    This being a generic record, will have only the name and the level number. 
    Other attributes, if required, are to be organized in an app-specific record.
    The actual connection to the hierarchy and parent unit will be maintained in a separate record, so that we can maintain the history of changes in the hierarchy definition.`,
  generateClientForm: false,
  operations: ['create', 'filter', 'get', 'save', 'update'],
  fields: [
    {
      name: 'hierarchicalUnitId',
      nameInDb: 'id',
      fieldType: 'generatedPrimaryKey',
      valueSchema: '_integer',
    },
    {
      name: 'hierarchyLevelId',
      nameInDb: 'hierarchy_level_id',
      fieldType: 'requiredData',
      valueSchema: '_integer',
      foreignKey: {
        recordName: '_hierarchyLevel',
        fieldName: 'hierarchyLevelId',
      },
    },
    {
      name: 'name',
      nameInDb: 'name',
      fieldType: 'requiredData',
      valueSchema: '_text',
      description: `Name of the unit. This is not necessarily unique, but it is better to keep it unique within a level in a hierarchy.
      This is to be a copy of the name in the source table, if the hierarchy level is connected to a source table.
      This is to ensure that we can maintain the history of changes in the source table as well as the hierarchy definition without any conflict.`,
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
