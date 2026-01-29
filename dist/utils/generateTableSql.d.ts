import { SimpleRecord, StringMap, ValueSchema } from '@simplity';
/**
 * Generates SQL to create table for the given record.
 * Sql to add foreign key constraints, if any, are returned separately,
 * so that they can be executed after all tables are created.
 * @param record
 * @param schemas that has value-schemas
 * @returns
 */
export declare function generateTableSqls(record: SimpleRecord, schemas: StringMap<ValueSchema>, createSql: string[], fkSql: string[]): void;
export declare function shortCodeCheck(table: string, column: string, values: string[] | number[], isNumber?: boolean): string;
