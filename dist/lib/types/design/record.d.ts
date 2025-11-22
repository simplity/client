import { SortBy, Value } from '../common';
import { SimpleList, ValueType } from '.';
/**
 * ways to render a field(data-bound control) in a page/form
 */
export type FieldRendering = 'hidden' | 'output' | 'image' | 'text-field' | 'text-area' | 'password' | 'select' | 'select-output' | 'check-box';
/**
 * Field of a record is used for rendering a DataField on the page.
 * Here are the  attributes of a Field in a record that is meant for the DataField
 */
export type RecordFieldAndDataField = {
    /**
     * if specified, it should be a valid value for the specified valueType.
     * the view component simulates as if the user has entered this value.
     */
    initialValue?: Value;
    /**
     * relevant if this field is included in a tabular list
     */
    filterable?: boolean;
    /**
     * used by the client-side for rendering a tabular list of rows. Typically, ids are hidden,
     */
    hideInList?: boolean;
    /**
     * some fields in a record may be managed programmatically, and are not edited by the end-user
     */
    hideInSave?: boolean;
    /**
     * used by the client-side for rendering.
     * May be rendered in any of the ways that is in vogue: tooltip, info-icon that pops up a dialog, help section below the field, etc..
     */
    helpText?: string;
    /**
     * used by the client-side for rendering
     */
    icon?: string;
    /** for image field */
    imageNamePrefix?: string;
    /** for image fields */
    imageNameSuffix?: string;
    /**
     * not recommended, but in some cases the field may contain an array of values.
     * if this is set to true, then it is assumed that the field is actually a text-field and the value must be a comma-separated list of values,each of which conform to the specified value-schema
     */
    isArray?: boolean;
    /**
     * used by the client-side for rendering
     */
    label?: string;
    /**
     * formatter that converts the value to a displayable format.
     */
    valueFormatter?: string;
    /**
     * if the list of values is a keyed-list and the key value is to be taken from another field.
     * Like state-code that would depend on 'country-code'
     */
    listKeyFieldName?: string;
    /**
     * in case the list is keyed, but this field uses a deign-time fixed value for the key.
     * e.g. reportField uses a keyed-list named reportFields, and the current field is mean for a reportName="users"
     * in such a case, listKeyName should not be specified, but listKeyValue="users"
     */
    listKeyValue?: string | number;
    /**
     * if the value is one of a list of enumerated values..
     * like if the field is country-code, then it may be associated with a pre-defined list named 'countries'
     */
    listName?: string;
    /**
     * if this field is a drop-down.
     * to be used only if the list is simple, and is not a common one across several other fields.
     * also useful if the field is synthesized at run time.
     */
    listOptions?: SimpleList;
    /**
     * id for the message to be flashed in the client if this field fails validation
     */
    messageId?: string;
    /**
     * any custom action to be taken while user keeps typing value for this field.
     * If specified, this action must be defined in the page.ts
     */
    onBeingChanged?: string;
    /** any custom action to be taken on change of this field. If specified, this action must be defined in the page.ts */
    onChange?: string;
    /**
     * to action when the field is clicked
     */
    onClick?: string;
    /**
     * used by the client-side for rendering
     */
    placeHolder?: string;
    /**
     * used by the client-side for rendering
     */
    prefix?: string;
    /**
     * how should this field be rendered in a form/page?
     */
    renderAs?: FieldRendering;
    /**
     * relevant if this field is included in a tabular list
     */
    sortable?: boolean;
    /**
     * used by the client-side for rendering
     */
    suffix?: string;
    /**
     * what type of primitve value
     */
    valueType: ValueType;
    /**
     * Schema based validation of this field, if this is expected from an outside source.
     * Optional for internal fields.
     */
    valueSchema?: string;
    /**
     * used for validating ranges.
     * May also be used for rendering date-range instead of two separate date fields.
     */
    toField?: string;
    /**
     * used by the client-side for rendering
     */
    width?: VisualWidth;
};
/**
 * Record is an ordered set of data elements
 * It is a server-side concept. However, it is used to generate forms that are used by the client-sde-apps
 */
export type Record = SimpleRecord | ExtendedRecord | CompositeRecord;
/**
 * type of a field in a record
 */
export type FieldType = 'generatedPrimaryKey' | 'primaryKey' | 'tenantKey' | 'createdBy' | 'createdAt' | 'modifiedBy' | 'modifiedAt' | 'requiredData' | 'optionalData';
type InterFieldValidationType = 
/**
 * either both fields have values or both are empty
 */
'bothOrNone'
/**
 * if first one has a value, second one also must have a value. If first one has no value, then there is no restriction on the second one.
 */
 | 'bothOrSecond'
/**
 * both must have the same value
 */
 | 'equal'
/**
 * the two must have different values
 */
 | 'different'
/**
 * one and only one of the two must have a value
 */
 | 'oneOf'
/**
 * from-to-pair. Field2 must have a value greater than the value of the first one
 */
 | 'range'
/**
 * field2 must have a value greater than or equal to the first one
 */
 | 'rangeOrEqual';
type BaseRecord = {
    /**
     * record names have to be unique, but they may clash with name of other types.
     * for example a form may have the same name as the record that it is based on.
     */
    name: string;
    /**
     * used at run time for rendering additional details etc..
     *
     */
    description?: string;
    /**
     * design notes etc.. used for internal purpose. Not visible to the runtime system.
     * To be used to document design decisions etc...
     */
    notes?: string;
    /**
     * If this record represents a table/view in the RDBMS
     */
    nameInDb?: string;
    /**
     * whether the database table associated with this record uses audit fields
     */
    usesAuditFields?: boolean;
    /**
     * name of the function that validates an instance of data.
     * this function must follow the prescribed API for such a function, and is made available at run time.
     * This function should be of type FormValidationFunction with scope set to 'form'
     */
    validationFn?: string;
    /**
     * timestamp technique is used to handle issues related to concurrent updates
     */
    useTimestampCheck?: boolean;
    /**
     * used to generate a form
     */
    operations?: FormOperation[];
    /**
     * a form is generated only if this is visible to client-side
     */
    isVisibleToClient: boolean;
    /**
     * if this is visible to the client-app, is authentication required for the client to trigger any form-based service?
     */
    serveGuests?: boolean;
    /**
     * used for generating demo/test data
     */
    nbrDataRowsForDemo?: number;
    /**
     * inter-field validations are invoked only if all the field validations succeed
     */
    interFieldValidations?: InterFieldValidation[];
    /**
     * fields that together uniquely identify a record, other than the primary key. There may be multiple such unique field-sets.
     */
    uniqueFields?: UniqueFields[];
    /**
     * Other records to on which this records depends on. For example a parent record.
     * Note that the parent is to be specified as a linked record to the child record, and not the other way round.
     */
    linkedRecords?: LinkedRecord[];
    /**
     * fields by which the records are sorted
     */
    sortBy?: SortBy[];
};
export type SimpleRecord = BaseRecord & {
    recordType: 'simple';
    /**
     * fields that make up this record.
     * in certain contexts, the order is important Hence this is an array
     */
    fields: Field[];
    validations?: InterFieldValidation[];
    businessValidations?: BusinessValidation[];
};
export type UniqueFields = {
    /**
     * description of the unique constraint
     */
    description?: string;
    /**
     * One or more fields that are to be unique in combination across all rows
     */
    fields: string[];
};
export type LinkedRecord = {
    /**
     * description of the foreign key constraint
     */
    description?: string;
    /**
     * name of the record that this is a foreign key to
     */
    recordName: string;
    /**
     * fields in this record that are linked to the other record
     */
    links: {
        field: string;
        linkedField: string;
    }[];
};
/**
 * a record that hs fields from another record and possibly some more fields
 */
export type ExtendedRecord = BaseRecord & {
    recordType: 'extended';
    /**
     * main record from which this sub-record is defined
     */
    mainRecordName: string;
    /**
     * All fields from the main record are included by default.
     * Specify the subset of field names to be included if only a subset of fields are to be included
     */
    fieldNames?: string[];
    /**
     * any additional fields
     */
    additionalFields?: Field[];
};
export type CompositeRecord = BaseRecord & {
    recordType: 'composite';
    /**
     * main record to which the other (child) records are linked to
     */
    mainRecordName: string;
    childRecords: ChildRecord[];
};
export type Field = RecordFieldAndDataField & {
    /**
     * name is to be unique within a record
     */
    name: string;
    /**
     * this is from a data-base design perspective, if this is a column in the table.
     * otherwise, only optional/required
     */
    fieldType: FieldType;
    /**
     * required if this is a column in the RDBMS table
     */
    nameInDb?: string;
    /**
     * expression that determine how values for this field are generated across rows for demo/tst purposes
     */
    demoValue?: string;
    /**
     * visible to the client side as help text etc..
     */
    description?: string;
    /**
     * what should be the type of column in the dbDesign.
     * defaults to the type determined based on the dbTypes specified at the app-level
     */
    dbType?: string;
};
/**
 * validate a pair-of related fields
 */
export type InterFieldValidation = {
    field1: string;
    field2: string;
    validationType: InterFieldValidationType;
    messageId: string;
    /**
     * the rule is applicable if and only if field1 has this specific value
     */
    onlyIfFieldValueEquals?: 'string';
};
export type BusinessValidation = {
    /**
     * name of the function that implements the business validation logic.
     * This function must follow the prescribed API for such a function, and is made available at run time.
     */
    functionName: string;
    /**
     * description of the business validation
     */
    description?: string;
};
/**
 * operations on a record/form/data-set. Traditionally called CRUD for Create, Read, Update,Delete
 */
export type FormOperation = 'get' | 'create' | 'update' | 'delete' | 'filter' | 'save';
/**
 * A child form is linked to a parent form in a data-structure
 */
export type ChildRecord = SimpleChildRecord | EditableChildRecord | TabularChildRecord | EditableTabularChildRecord;
type BaseChild = {
    /**
     * name by which this record is added to the main record.
     * may be different from the child record name
     */
    childName: string;
    childRecordName: string;
    /**
     * if the child record is linked to the parent with one-to-many relationship.
     * this array has the names of fields in the parent to be matched for linking
     */
    parentLinkFields?: string[];
    /**
     * if the child record is linked to the parent with one-to-many relationship.
     * this array has the names of fields in the child record to be matched for linking
     */
    childLinkFields?: string[];
    /**
     * panel/group name to be rendered on the view
     */
    label?: string;
};
export type SimpleChildRecord = BaseChild & {
    childType: 'simple';
};
export type EditableChildRecord = BaseChild & {
    childType: 'editable';
    isEditable: true;
    errorId?: string;
};
export type TabularChildRecord = BaseChild & {
    childType: 'table';
    isTable: true;
};
export type EditableTabularChildRecord = BaseChild & {
    childType: 'editableTable';
    isEditable: true;
    isTable: true;
    minRows: number;
    maxRows: number;
    errorId: string;
};
export type VisualWidth = number;
export {};
