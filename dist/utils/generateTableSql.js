/**
 * constraint naming conventions
 * pk_<table>
 * fk_<table>_<col>
 * chk_<table>_<col>_...
 */
const INT32_MAX = 2147483647;
const ENABLE_TEXT_REGEX_CHECK = false;
/**
 * Generates SQL to create table for the given record.
 * Sql to add foreign key constraints, if any, are returned separately,
 * so that they can be executed after all tables are created.
 * @param record
 * @param schemas that has value-schemas
 * @returns
 */
export function generateTableSqls(record, schemas, createSql, fkSql) {
    const table = record.nameInDb;
    const cols = [];
    const pks = [];
    for (const field of record.fields) {
        const col = field.nameInDb;
        const schema = schemas[field.valueSchema];
        emitColumn({ schema, cols, fkSql, pks, table, col, field });
    }
    // composite PK (non-generated)
    if (pks.length > 1) {
        cols.push(`CONSTRAINT pk_${table} PRIMARY KEY (${pks.join(', ')})`);
    }
    createSql.push(`\nCREATE TABLE ${table} (\n  ${cols.join(',\n  ')}\n);`);
    return;
}
function emitColumn(ctx) {
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
        ctx.fkSql.push(`ALTER TABLE ${ctx.table} ADD CONSTRAINT fk_${ctx.table}_${ctx.col} ` +
            `FOREIGN KEY (${ctx.col}) REFERENCES ${ctx.field.foreignKey.recordName}(${ctx.field.foreignKey.fieldName});`);
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
export function shortCodeCheck(table, column, values, isNumber) {
    const name = `chk_${table}_${column}_code`;
    const list = isNumber
        ? values.join(', ')
        : values.map((v) => `'${v}'`).join(', ');
    return `CONSTRAINT ${name} CHECK (${column} IN (${list}))`;
}
function finishNullability(base, field) {
    const optional = field.fieldType === 'optionalData' && field.initialValue === undefined;
    return optional ? base : `${base} NOT NULL`;
}
function emitTimestampColumn(ctx) {
    let line = `${ctx.col} TIMESTAMP`;
    if (ctx.field.fieldType === 'createdAt' ||
        ctx.field.fieldType === 'modifiedAt') {
        line += ' NOT NULL DEFAULT CURRENT_TIMESTAMP';
    }
    else {
        line = finishNullability(line, ctx.field);
    }
    ctx.cols.push(line);
}
function emitDateColumn(ctx) {
    ctx.cols.push(finishNullability(`${ctx.col} DATE`, ctx.field));
}
function emitTextColumn(ctx) {
    const schema = ctx.schema;
    const min = schema.minLength ?? 1;
    const max = schema.maxLength ?? 1000;
    const parts = [
        `${ctx.col} ${min === max ? `CHAR(${max})` : `VARCHAR(${max})`}`,
    ];
    // ---- SHORT CODE STUB ----
    // parts.push(shortCodeCheck(table, col, values));
    if (schema.regex && ENABLE_TEXT_REGEX_CHECK) {
        parts.push(`-- regex check stub`);
    }
    ctx.cols.push(finishNullability(parts.join(' '), ctx.field));
}
function emitDecimalColumn(ctx) {
    const schema = ctx.schema;
    const d = schema.nbrDecimalPlaces ?? 2;
    const min = schema.minValue ?? 0;
    const max = schema.maxValue ?? Number.MAX_SAFE_INTEGER;
    const n = Math.floor(Math.log10(Math.max(Math.abs(max), Math.abs(min)))) + 1;
    ctx.cols.push(finishNullability(`${ctx.col} NUMERIC(${n},${d})`, ctx.field));
    ctx.cols.push(`CONSTRAINT chk_${ctx.table}_${ctx.col}_range CHECK (${ctx.col} >= ${min} AND ${ctx.col} <= ${max})`);
}
function emitIntegerColumn(ctx) {
    const schema = ctx.schema;
    const min = schema.minValue ?? 0;
    const max = schema.maxValue ?? Number.MAX_SAFE_INTEGER;
    const type = Math.max(Math.abs(max), Math.abs(min)) > INT32_MAX ? 'BIGINT' : 'INTEGER';
    ctx.cols.push(finishNullability(`${ctx.col} ${type}`, ctx.field));
    if (!ctx.field.foreignKey) {
        //foreign keys do not need range checks as they refer to PKs that are already constrained
        ctx.cols.push(`CONSTRAINT chk_${ctx.table}_${ctx.col}_range CHECK (${ctx.col} >= ${min} AND ${ctx.col} <= ${max})`);
    }
}
function emitBooleanColumn(ctx) {
    ctx.cols.push(`${ctx.col} SMALLINT NOT NULL DEFAULT 0`);
    ctx.cols.push(`CONSTRAINT chk_${ctx.table}_${ctx.col}_bool CHECK (${ctx.col} IN (0,1))`);
}
//# sourceMappingURL=generateTableSql.js.map