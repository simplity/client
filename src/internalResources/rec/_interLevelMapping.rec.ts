import { SimpleRecord } from '@simplity';

export const _interLevelMapping: SimpleRecord = {
  name: '_interLevelMapping',
  nameInDb: '_inter_level_mappings',
  recordType: 'simple',
  description: `What are the levels at which the mappings between two hierarchies should happen.
    This is to support scenarios like mapping administrative units to sales territories etc.
    This is more a rule for detailed mapping.`,
  generateClientForm: false,
  operations: ['create', 'filter', 'get', 'save', 'update'],
  fields: [
    {
      name: 'interLevelMappingId',
      nameInDb: 'id',
      fieldType: 'generatedPrimaryKey',
      valueSchema: '_integer',
    },
    {
      name: 'parentLevelId',
      nameInDb: 'parent_level_id',
      fieldType: 'requiredData',
      valueSchema: '_integer',
      foreignKey: {
        recordName: '_hierarchy',
        fieldName: 'hierarchyId',
      },
    },
    {
      name: 'childLevelId',
      nameInDb: 'child_level_id',
      fieldType: 'requiredData',
      valueSchema: '_integer',
      foreignKey: {
        recordName: '_hierarchy',
        fieldName: 'hierarchyId',
      },
    },
    {
      name: 'name',
      fieldType: 'requiredData',
      valueSchema: '_text',
      nameInDb: 'name',
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
