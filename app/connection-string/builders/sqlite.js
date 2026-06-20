import { formatDriverName, joinConnectionString, timeoutPair } from "../format.js";

/**
 * @param {import("../index.js").ConnectionValues} values
 * @param {"odbc" | "adonet"} format
 */
export function buildSqlite(values, format) {
  const timeout = timeoutPair(values, format);
  const dataSource = values.sqliteInMemory ? ":memory:" : values.database;

  if (format === "odbc") {
    return joinConnectionString({
      Driver: formatDriverName(values.driverName),
      Database: dataSource,
      ...timeout,
    });
  }

  return joinConnectionString({
    "Data Source": dataSource,
    Version: values.sqliteVersion || "3",
    ...(values.sqliteInMemory ? { New: "True" } : {}),
    ...(values.password ? { Password: values.password } : {}),
    ...timeout,
  });
}
