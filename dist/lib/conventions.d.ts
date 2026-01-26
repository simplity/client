export declare const conventions: {
    messageIds: {
        /**
         * value is required
         */
        valueIsRequired: string;
        /**
         * generic error message when validation fails and  no specific error id is specified
         */
        invalidValue: string;
        /**
         * error when the specified schema is not defined in the app
         */
        schemaIsMissing: string;
    };
    /**
     * name of the style in gridStyles collection that is to be used as a default style
     */
    defaultGridStyle: string;
    /**
     * special pre-defined service to get drop-down values
     */
    listServiceName: string;
    /**
     * special pre-defined service for form operations
     */
    formServiceName: string;
    /**
     * special pre-defined service to get a report
     */
    reportServiceName: string;
    /**
     * user attribute that has the module.menu -> true map of allowed menus
     */
    accessibleMenus: string;
    /**
     * user attribute that has the list of allowed menu ids
     */
    grantAllAccess: string;
};
