export const conventions = {
  messageIds: {
    /**
     * value is required
     */
    valueIsRequired: '_valueRequired',
    /**
     * generic error message when validation fails and  no specific error id is specified
     */
    invalidValue: '_invalidValue',
    /**
     * error when the specified schema is not defined in the app
     */
    schemaIsMissing: '_schemaIsMissing',
  },
  /**
   * name of the style in gridStyles collection that is to be used as a default style
   */
  defaultGridStyle: '_defaultStyle',
  /**
   * special pre-defined service to get drop-down values
   */
  listServiceName: '_getList',

  /**
   * special pre-defined service for form operations
   */
  formServiceName: '_formService',

  /**
   * special pre-defined service to get a report
   */
  reportServiceName: '_getReportSettings',
  /**
   * user attribute that has the module.menu -> true map of allowed menus
   */
  accessibleMenus: '_accessibleMenus',
  /**
   * user attribute that has the list of allowed menu ids
   */
  grantAllAccess: '_grantAllAccess',
};
