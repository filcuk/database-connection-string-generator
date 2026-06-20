import { formatDriverName, joinConnectionString, timeoutPair, withDsnOrPairs } from "../format.js";

/**
 * @param {import("../index.js").ConnectionValues} values
 * @param {"odbc" | "oledb" | "adonet"} format
 */
export function buildTeradata(values, format) {
  const timeout = timeoutPair(values, format);

  if (format === "odbc") {
    return withDsnOrPairs(values, {
      Driver: formatDriverName(values.driverName),
      DBCName: values.host,
      Database: values.database,
      Uid: values.username,
      Pwd: values.password,
      ...timeout,
    });
  }

  if (format === "oledb") {
    if (values.driverName === "Teradata") {
      return joinConnectionString({
        Provider: values.driverName,
        DBCName: values.host,
        Database: values.database,
        Uid: values.username,
        Pwd: values.password,
        ...timeout,
      });
    }

    return joinConnectionString({
      Provider: values.driverName,
      "Data Source": values.host,
      "User ID": values.username,
      Password: values.password,
      "Session Mode": "ANSI",
      ...timeout,
    });
  }

  return joinConnectionString({
    "Data Source": values.host,
    "User ID": values.username,
    Password: values.password,
    ...timeout,
  });
}
