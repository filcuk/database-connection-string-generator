import { formatDriverName, joinConnectionString, sslPairs, timeoutPair, withDsnOrPairs } from "../format.js";

/**
 * @param {import("../index.js").ConnectionValues} values
 * @param {"odbc" | "adonet"} format
 */
export function buildPostgresql(values, format) {
  const timeout = timeoutPair(values, format);
  const ssl = sslPairs(values, format);

  if (format === "odbc") {
    return withDsnOrPairs(values, {
      Driver: formatDriverName(values.driverName),
      Server: values.host,
      Port: values.port,
      Database: values.database,
      Uid: values.username,
      Pwd: values.password,
      ...ssl,
      ...timeout,
    });
  }

  return joinConnectionString({
    Host: values.host,
    Port: values.port,
    Database: values.database,
    Username: values.username,
    Password: values.password,
    ...ssl,
    ...timeout,
  });
}
