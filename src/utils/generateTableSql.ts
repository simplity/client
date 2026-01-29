import {
  DecimalSchema,
  Field,
  IntegerSchema,
  SimpleRecord,
  StringMap,
  TextSchema,
  ValueSchema,
} from '@simplity';

/**
 * constraint naming conventions
 * pk_<table>
 * fk_<table>_<col>
 * chk_<table>_<col>_...
 */

const INT32_MAX = 2147483647;
const ENABLE_TEXT_REGEX_CHECK = false;
type Ctx = {
  schema: ValueSchema;
  cols: string[];
  fkSql: string[];
  pks: string[];
  table: string;
  col: string;
  field: Field;
};
/**
 * Generates SQL to create table for the given record.
 * Sql to add foreign key constraints, if any, are returned separately,
 * so that they can be executed after all tables are created.
 * @param record
 * @param schemas that has value-schemas
 * @returns
 */
export function generateTableSqls(
  record: SimpleRecord,
  schemas: StringMap<ValueSchema>,
  createSql: string[],
  fkSql: string[],
): void {
  const table = record.nameInDb!;
  const cols: string[] = [];
  const pks: string[] = [];

  for (const field of record.fields) {
    const col = field.nameInDb!;
    const schema = schemas[field.valueSchema]!;
    emitColumn({ schema, cols, fkSql, pks, table, col, field });
  }

  // composite PK (non-generated)
  if (pks.length > 1) {
    cols.push(`CONSTRAINT pk_${table} PRIMARY KEY (${pks.join(', ')})`);
  }

  createSql.push(`\nCREATE TABLE ${table} (\n  ${cols.join(',\n  ')}\n);`);
  return;
}

function emitColumn(ctx: Ctx): void {
  const ft = ctx.field.fieldType;
  // generated PK
  if (ft === 'generatedPrimaryKey') {
    ctx.cols.push(`${ctx.col} BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY`);
    return;
  }

  // collect PKs (non-generated)
  if (ft === 'primaryKey') {
    ctx.pks.push(ctx.col);
  }

  // collect FK SQL
  if (ctx.field.foreignKey) {
    ctx.fkSql.push(
      `ALTER TABLE ${ctx.table} ADD CONSTRAINT fk_${ctx.table}_${ctx.col} ` +
        `FOREIGN KEY (${ctx.col}) REFERENCES ${ctx.field.foreignKey.recordName}(${ctx.field.foreignKey.fieldName});`,
    );
  }

  const vt = ctx.schema.valueType;
  switch (vt) {
    case 'boolean':
      emitBooleanColumn(ctx);
      break;
    case 'integer':
      emitIntegerColumn(ctx);
      break;
    case 'decimal':
      emitDecimalColumn(ctx);
      break;
    case 'text':
      emitTextColumn(ctx);
      break;
    case 'date':
      emitDateColumn(ctx);
      break;
    case 'timestamp':
      emitTimestampColumn(ctx);
      break;
    default:
      throw new Error(`Unhandled valueType ${vt}`);
  }
  return;
}

export function shortCodeCheck(
  table: string,
  column: string,
  values: string[] | number[],
  isNumber?: boolean,
): string {
  const name = `chk_${table}_${column}_code`;
  const list = isNumber
    ? values.join(', ')
    : values.map((v) => `'${v}'`).join(', ');
  return `CONSTRAINT ${name} CHECK (${column} IN (${list}))`;
}

function finishNullability(base: string, field: Field): string {
  const optional =
    field.fieldType === 'optionalData' && field.initialValue === undefined;

  return optional ? base : `${base} NOT NULL`;
}

function emitTimestampColumn(ctx: Ctx): void {
  let line = `${ctx.col} TIMESTAMP`;

  if (
    ctx.field.fieldType === 'createdAt' ||
    ctx.field.fieldType === 'modifiedAt'
  ) {
    line += ' NOT NULL DEFAULT CURRENT_TIMESTAMP';
  } else {
    line = finishNullability(line, ctx.field);
  }

  ctx.cols.push(line);
}

function emitDateColumn(ctx: Ctx): void {
  ctx.cols.push(finishNullability(`${ctx.col} DATE`, ctx.field));
}

function emitTextColumn(ctx: Ctx): void {
  const schema = ctx.schema as TextSchema;
  const min = schema.minLength ?? 1;
  const max = schema.maxLength ?? 1000;

  const parts: string[] = [
    `${ctx.col} ${min === max ? `CHAR(${max})` : `VARCHAR(${max})`}`,
  ];

  // ---- SHORT CODE STUB ----
  // parts.push(shortCodeCheck(table, col, values));

  if (schema.regex && ENABLE_TEXT_REGEX_CHECK) {
    parts.push(`-- regex check stub`);
  }

  ctx.cols.push(finishNullability(parts.join(' '), ctx.field));
}

function emitDecimalColumn(ctx: Ctx): void {
  const schema = ctx.schema as DecimalSchema;
  const d = schema.nbrDecimalPlaces ?? 2;
  const min = schema.minValue ?? 0;
  const max = schema.maxValue ?? Number.MAX_SAFE_INTEGER;
  const n = Math.floor(Math.log10(Math.max(Math.abs(max), Math.abs(min)))) + 1;

  ctx.cols.push(finishNullability(`${ctx.col} NUMERIC(${n},${d})`, ctx.field));
  ctx.cols.push(
    `CONSTRAINT chk_${ctx.table}_${ctx.col}_range CHECK (${ctx.col} >= ${min} AND ${ctx.col} <= ${max})`,
  );
}

function emitIntegerColumn(ctx: Ctx): void {
  const schema = ctx.schema as IntegerSchema;
  const min = schema.minValue ?? 0;
  const max = schema.maxValue ?? Number.MAX_SAFE_INTEGER;
  const type =
    Math.max(Math.abs(max), Math.abs(min)) > INT32_MAX ? 'BIGINT' : 'INTEGER';

  ctx.cols.push(finishNullability(`${ctx.col} ${type}`, ctx.field));
  if (!ctx.field.foreignKey) {
    //foreign keys do not need range checks as they refer to PKs that are already constrained
    ctx.cols.push(
      `CONSTRAINT chk_${ctx.table}_${ctx.col}_range CHECK (${ctx.col} >= ${min} AND ${ctx.col} <= ${max})`,
    );
  }
}

function emitBooleanColumn(ctx: Ctx): void {
  ctx.cols.push(`${ctx.col} SMALLINT NOT NULL DEFAULT 0`);
  ctx.cols.push(
    `CONSTRAINT chk_${ctx.table}_${ctx.col}_bool CHECK (${ctx.col} IN (0,1))`,
  );
}
