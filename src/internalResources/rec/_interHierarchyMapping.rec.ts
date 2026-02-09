import { SimpleRecord } from '@simplity';

export const _interHierarchyMapping: SimpleRecord = {
  name: '_interHierarchyMapping',
  nameInDb: '_inter_hierarchy_mapping',
  recordType: 'simple',
  description: `How units in one hierarchy relate to units in another hierarchy. 
    This is to support scenarios like mapping administrative units to sales territories etc.
    This record has the mappings at the unit level.`,
  generateClientForm: false,
  operations: ['create', 'filter', 'get', 'save', 'update'],
  fields: [
    {
      name: 'interHierarchyMappingId',
      nameInDb: 'id',
      fieldType: 'generatedPrimaryKey',
      valueSchema: '_integer',
    },
    {
      name: 'parentUnitId',
      nameInDb: 'parent_unit_id',
      fieldType: 'requiredData',
      valueSchema: '_integer',
      foreignKey: {
        recordName: '_hierarchicalUnit',
        fieldName: 'hierarchicalUnitId',
      },
      description: `Unit in the parent hierarchy. 
      Must be connected to a hierarchy that is defined as parent in _interHierarchyRelation.
      Mustbe unique across the mappings for a given parent hierarchy, but can be mapped to multiple child units in case of one-to-many relation between hierarchies.`,
    },
    {
      name: 'childUnitId',
      nameInDb: 'child_unit_id',
      fieldType: 'requiredData',
      valueSchema: '_integer',
      foreignKey: {
        recordName: '_hierarchicalUnit',
        fieldName: 'hierarchicalUnitId',
      },
      description: `Unit in the child hierarchy. 
      Must be connected to a hierarchy that is defined as child in _interHierarchyRelation.`,
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
};
