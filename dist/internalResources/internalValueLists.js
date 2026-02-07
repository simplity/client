export const internalValueLists = {
    _reportNames: {
        name: '_reportNames',
        listType: 'runtime',
        isKeyed: false,
        dbTableName: '_dynamic_report',
        dbColumn1: 'report_name',
        dbColumn2: 'report_name',
    },
    _reportVariantNames: {
        name: '_reportVariantNames',
        listType: 'runtime',
        isKeyed: true,
        dbTableName: '_report_variant',
        dbColumn1: 'variant_name',
        dbColumn2: 'variant_name',
        keyColumn: 'report_name',
    },
    _comparators: {
        name: '_comparators',
        listType: 'simple',
        list: [
            { value: '=', label: 'equal to' },
            { value: '!=', label: 'not equal to' },
            { value: '<', label: 'less than' },
            { value: '<=', label: 'less than or equal to' },
            { value: '>', label: 'greater than' },
            { value: '>=', label: 'greater than or equal to' },
            { value: '~', label: 'contains' },
            { value: '^', label: 'starts with' },
            { value: '><', label: 'between' },
        ],
    },
};
//# sourceMappingURL=internalValueLists.js.map