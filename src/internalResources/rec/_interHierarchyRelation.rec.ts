import { SimpleRecord } from '@simplity';

export const _interHierarchyRelation: SimpleRecord = {
  name: '_interHierarchyRelation',
  nameInDb: '_inter_hierarchy_relations',
  recordType: 'simple',
  description: `How units in one hierarchy relate to units in another hierarchy. 
    This is to support scenarios like mapping administrative units to sales territories etc.
    This is just the definition of the relation. 
    The actual mapping of units across hierarchies is maintained in _interHierarchyUnitMapping.`,
  generateClientForm: false,
  operations: ['create', 'filter', 'get', 'save', 'update'],
  fields: [
    {
      name: 'interHierarchyRelationId',
      nameInDb: 'id',
      fieldType: 'generatedPrimaryKey',
      valueSchema: '_integer',
    },
    {
      name: 'parentHierarchyId',
      nameInDb: 'parent_hierarchy_id',
      fieldType: 'requiredData',
      valueSchema: '_integer',
      foreignKey: {
        recordName: '_hierarchy',
        fieldName: 'hierarchyId',
      },
    },
    {
      name: 'childHierarchyId',
      nameInDb: 'child_hierarchy_id',
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
