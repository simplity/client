import { Form, StringMap, ValueSchema } from '@simplity';
import { ProcessedRecords } from './processRecords';
export declare function generateForms(records: ProcessedRecords, forms: StringMap<Form>, valueSchemas: StringMap<ValueSchema>): number;
