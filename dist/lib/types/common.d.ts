/**
 * entity string index
 */
export type StringMap<T> = {
    [name: string]: T;
};
export type OptionalOf<T> = {
    [K in keyof T]?: T[K];
};
/**
 * Technique to incorporate condition like (one of a,b, or c must be specified)
 */
export type OneOf<T> = {
    [K in keyof T]: {
        [P in K]: T[K];
    } & Partial<Record<Exclude<keyof T, K>, never>>;
}[keyof T];
/**
 * Logger that provides the three basic logging utilities
 */
export type Logger = {
    /**
     * log some information
     * @param args
     */
    info(...args: any[]): void;
    /**
     * log some error
     * @param args
     */
    error(...args: any[]): void;
    /**
     * log some warning
     * @param args
     */
    warn(...args: any[]): void;
    /**
     * log some debug information
     * @param args
     */
    debug(...args: any[]): void;
};
export type FunctionType = 'global' | 'page' | 'form' | 'field' | 'request' | 'response' | 'format' | 'init';
/**
 * data needs to be moved around, possibly across networks and programming paradigms.
 * Hence a string, number and boolean are used to represent value for the sic value types.
 * Date is a string like "yyyy-mm-dd", and time stamp is a string like "yyyy-mm-ddThh:MM:ss.fffZ"
 */
export type Value = string | number | boolean;
/**
 * array of values. all elements of an array are of same type
 */
export type ValueArray = string[] | number[] | boolean[];
/**
 * name-value pairs of primitive values
 */
export type Values = StringMap<Value>;
export type AnyValue = Value | Values | ValueArray | Values[];
/**
 * Generic data structure that can represent arbitrary data organization inside of an object-structure.
 * That is, it is an object with name-value pairs. The value can be either a primitive value
 */
export type Vo = {
    [key: string]: AnyValue | Vo | Vo[];
};
/**
 * mark-ups are value-markup pairs.
 * markup, in an html client, translates to a data-* attribute being set for the enclosing element
 * for a numeric/date type, the value may start with '<' or '>' followed by the value
 * for a text field it may start and end with '/', in which case, it is assumed to be
 * '' matches with undefined, while * matches for anything. It does not make sense to have any entries after a * entry
 * e.g. [['<0', 'negative'], ['>1000', 'high'], ['*' , 'normal']]
 */
export type Markup = [string, string];
export type BaseFormatter = {
    name: string;
    /**
     * mark-ups are value-markup pairs.
     * markup, in an html client, translates to a data-* attribute being set for the enclosing element
     * for a numeric/date type, the value may start with '<' or '>' followed by the value
     * for a text field it may start and end with '/', in which case, it is assumed to be
     * '' matches with undefined, while * matches for anything. It does not make sense to have any entries after a * entry
     * e.g. [['<0', 'negative'], ['>1000', 'high'], ['*' , 'normal']]
     */
    markups?: Markup[];
};
/**
 * format a boolean for output
 */
export type BooleanFormatter = BaseFormatter & {
    type: 'boolean';
    trueValue: string;
    falseValue: string;
    unknownValue: string;
};
/**
 * format a number for output
 */
export type NumberFormatter = BaseFormatter & {
    type: 'number';
    /**
     * e.g. to output 001 instead of 1
     */
    minDigits?: number;
    /**
     * defaults to the one specified in the valueType or 0
     */
    nbrDecimals?: number;
    /**
     * 12,25,000 or 1,225,000
     */
    commas?: 'lakhs' | 'millions';
    /**
     * e.g. label says In crores, then the values are shown to nearest 1000
     */
    toNearest?: 'thousands' | 'lakhs' | 'millions' | 'crores';
};
/**
 * format a date for output
 */
export type DateFormatter = BaseFormatter & {
    type: 'date';
    format: string;
};
/**
 * format a timestamp for output
 */
export type TimestampFormatter = BaseFormatter & {
    type: 'timestamp';
    /**
     * defaults to locale of the client machine.
     * standard locale string
     */
    locale?: string;
    format?: string;
};
/**
 * format a text for output
 */
export type TextFormatter = BaseFormatter & {
    type: 'text';
    /**
     * x is substituted, while everything else is reproduced as it is
     * like xxx-xx-xxx.
     */
    format: string;
    /**
     * if you need to 'x-out' characters, then specify your choice of variable character
     */
    varchar?: string;
};
/**
 * If your need requires a custom function for formatting the value.
 */
export type CustomFormatter = {
    type: 'custom';
    /**
     * name of the formatter function provided by the app
     */
    function: string;
};
export type ValueFormatter = BooleanFormatter | CustomFormatter | DateFormatter | NumberFormatter | TextFormatter | TimestampFormatter;
/**
 * case may be converted to upper, lower.
 * A field name like "fieldName" or "FieldName" or "field_name" is converted to "Field Name"
 */
export type CaseConverter = 'UPPER' | 'lower' | 'label';
export type FormattedValue = {
    value: string;
    markups?: [string, Value][];
};
/**
 * field name and sort order
 */
export type SortBy = {
    field: string;
    descending?: boolean;
};
/**
 * a condition is like "field-1 != 33" or "field1 > field2 but < field3
 */
export type FilterCondition = {
    /**
     * name of the field used for filtering
     */
    field: string;
    /**
     * defaults to Equals ('=')
     */
    comparator?: Comparator;
    /**
     * Defaults to the value of the named field.
     * Not relevant for hasValue ('#') and hasNoValue ('!#') operators.
     * value must be of the right type for the field and the comparator
     * use ${field-name} notation if the value comes from a different field.
     * e.g. amount="${value}".
     *
     * Note that the value is picked-up at the client-side at run time.
     */
    value?: Value;
    /**
     * required if the operator is between/range. ignored otherwise
     * Use ${field-name} to pick-up the value at rune time on the client-side
     */
    toValue?: Value;
    /**
     * set this to true if the value is required.
     * It is considered to be an error if a value is not found for the ${field-name} at run time
     */
    isRequired?: boolean;
};
/**
 * comparators for forming conditions like id = '1234'
 */
export type Comparator = '=' | '!=' | '<' | '<=' | '>' | '>=' | '><' | '^' | '~' | '#' | '!#';
export type AlertType = 'success' | 'info' | 'warning' | 'error';
export type Alert = {
    type: AlertType;
    text: string;
};
/**
 * spec for an interface. contains all the test descriptions for each method.
 * can be used for it(...)
 */
export type Spec = {
    [method: string]: string[];
};
