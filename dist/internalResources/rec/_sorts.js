export const _sorts = {
    name: '_sorts',
    isVisibleToClient: true,
    recordType: 'simple',
    description: 'Columns to be sorted on',
    fields: [
        { name: 'name', fieldType: 'requiredData', valueSchema: '_text' },
        {
            name: 'ascending',
            fieldType: 'requiredData',
            valueSchema: '_boolean',
            renderAs: 'check-box',
        },
    ],
};
//# sourceMappingURL=_sorts.js.map