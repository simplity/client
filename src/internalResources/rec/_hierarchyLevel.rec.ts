import { SimpleRecord } from '@simplity';

export const _hierarchyLevel: SimpleRecord = {
  name: '_hierarchyLevel',
  nameInDb: '_hierarchy_levels',
  recordType: 'simple',
  description:
    'A fixed level in the hierarchy, like Zone, circle etc.. in an Admin Hierarchy',
  generateClientForm: false,
  operations: ['create', 'filter', 'get', 'save', 'update'],
  fields: [
    {
      name: 'hierarchyLevelId',
      nameInDb: 'id',
      fieldType: 'generatedPrimaryKey',
      valueSchema: '_integer',
    },
    {
      name: 'hierarchyId',
      nameInDb: 'hierarchy_id',
      fieldType: 'requiredData',
      valueSchema: '_integer',
      foreignKey: { fieldName: 'hierarchyId', recordName: '_hierarchy' },
    },
    {
      name: 'level',
      nameInDb: 'level',
      fieldType: 'requiredData',
      valueSchema: '_integer',
      description: `Level number, starting from 1 for the top level. This is temporal.
      It should be ensured that there are no gaps in the level numbers for a given hierarchy at any instant of time.`,
    },
    {
      name: 'name',
      fieldType: 'requiredData',
      valueSchema: '_text',
      nameInDb: 'name',
    },
    {
      name: 'tableName',
      nameInDb: 'unit_source_table',
      fieldType: 'optionalData',
      valueSchema: '_text',
      description: `Name of the table that has the actual units that participate this hierarchy at this level.
      null means that the unit just name, an is organized in _hierarchicalUnit of this level. 
      Hierarchies that are that are created just for reporting purposes need not design any additional table for this. 
`,
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
  uniqueFields: [
    {
      description: 'Name must be unique across levels in a hierarchy',
      fields: ['hierarchyId', 'name'],
    },
  ],
};
