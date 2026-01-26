export const _columnSelection = {
    name: '_columnSelection',
    isVisibleToClient: true,
    recordType: 'simple',
    description: 'Column/Field to be included in the report',
    fields: [
        { name: 'seqNo', fieldType: 'optionalData', valueSchema: '_integer' },
        { name: 'name', fieldType: 'requiredData', valueSchema: '_text' },
        { name: 'label', fieldType: 'requiredData', valueSchema: 'text' },
    ],
};
//# sourceMappingURL=_columnSelection.js.map