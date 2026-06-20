import { buildMysql } from "./mysql.js";

/**
 * @param {import("../index.js").ConnectionValues} values
 * @param {"odbc" | "adonet"} format
 */
export function buildMariadb(values, format) {
  return buildMysql(values, format);
}
