/**
 * Choose Mssql DateTime TYPE Binding between:
 * - MSSQL_DATE_BINDING_TEMPORAL
 * - MSSQL_DATE_BINDING_DATE
 *
 * [Default MSSQL_DATE_BINDING_TEMPORAL]
 */
export const MSSQL_DATE_BINDING = 'MSSQL_DATE_BINDING';
/**
 * Mssql DateTime TYPE Binding use Temporal Instant.
 */
export const MSSQL_DATE_BINDING_TEMPORAL = 0b00000000000000001;
/**
 * Mssql DateTime TYPE Binding use Date.
 */
export const MSSQL_DATE_BINDING_DATE = 0b00000000000000010;

/**
 * Param type SmallDateTime
 */
export const MSSQL_PARAM_SMALLDATETIME = 'MSSQL_PARAM_SMALLDATETIME';
