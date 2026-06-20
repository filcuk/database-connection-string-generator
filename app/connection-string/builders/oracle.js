import {
  formatDriverName,
  joinConnectionString,
  oracleAuthPairs,
  oracleDataSource,
  timeoutPair,
  withDsnOrPairs,
} from "../format.js";

/**
 * @param {import("../index.js").ConnectionValues} values
 * @param {"odbc" | "oledb" | "adonet"} format
 */
export function buildOracle(values, format) {
  const dataSource = oracleDataSource(values);
  const timeout = timeoutPair(values, format);
  const auth = oracleAuthPairs(format, values.osAuth, {
    odbc: { Uid: values.username, Pwd: values.password },
    oledb: { "User Id": values.username, Password: values.password },
    adonet: { "User Id": values.username, Password: values.password },
  });

  if (format === "odbc") {
    const connectKey = values.oracleConnectMode === "tns" ? "Server" : "Dbq";
    return withDsnOrPairs(values, {
      Driver: formatDriverName(values.driverName),
      [connectKey]: dataSource,
      ...auth,
      ...timeout,
    });
  }

  if (format === "oledb") {
    return joinConnectionString({
      Provider: values.driverName,
      "Data Source": dataSource,
      ...auth,
      ...timeout,
    });
  }

  return joinConnectionString({
    "Data Source": dataSource,
    ...auth,
    ...timeout,
  });
}
