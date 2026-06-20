import {
  formatDriverName,
  joinConnectionString,
  serverWithPort,
  timeoutPair,
  withDsnOrPairs,
} from "../format.js";

/**
 * @param {string} host
 * @param {string} port
 */
function azureServer(host, port) {
  const server = serverWithPort(host, port);
  if (!server) return "";
  if (server.startsWith("tcp:")) return server;
  return `tcp:${server}`;
}

/**
 * @param {import("../index.js").ConnectionValues} values
 * @param {"odbc" | "oledb" | "adonet"} format
 */
export function buildAzuresql(values, format) {
  const server = azureServer(values.host, values.port);
  const timeout = timeoutPair(values, format);
  const encryptOn = values.encrypt !== false;

  if (format === "odbc") {
    return withDsnOrPairs(values, {
      Driver: formatDriverName(values.driverName),
      Server: server,
      Database: values.database,
      Uid: values.username,
      Pwd: values.password,
      ...(encryptOn ? { Encrypt: "yes" } : {}),
      ...timeout,
    });
  }

  if (format === "oledb") {
    return joinConnectionString({
      Provider: values.driverName,
      "Data Source": server,
      "Initial Catalog": values.database,
      UID: values.username,
      PWD: values.password,
      ...(encryptOn ? { "Use Encryption for Data": "true" } : {}),
      ...timeout,
    });
  }

  return joinConnectionString({
    Server: server,
    Database: values.database,
    "User ID": values.username,
    Password: values.password,
    "Trusted_Connection": "False",
    ...(encryptOn ? { Encrypt: "True" } : {}),
    ...timeout,
  });
}
