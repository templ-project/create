/**
 * This is just a copy of the normalize-path module
 * (since the actual module is not available for ESM)
 *
 * See code and copyright notice below.
 * Also see lint-staged's transcription of the module, hence it is better documented
 * @link https://github.com/lint-staged/lint-staged/blob/master/lib/normalizePath.js
 */

/*!
 * normalize-path <https://github.com/jonschlinkert/normalize-path>
 *
 * Copyright (c) 2014-2018, Jon Schlinkert.
 * Released under the MIT License.
 */

// eslint-disable-next-line import/prefer-default-export
export const normalize = (path: string, stripTrailing = false): string => {
  if (typeof path !== "string") {
    throw new TypeError("expected path to be a string");
  }

  if (path === "\\" || path === "/") {
    return "/";
  }

  const len = path.length;
  if (len <= 1) {
    return path;
  }

  // ensure that win32 namespaces has two leading slashes, so that the path is
  // handled properly by the win32 version of path.parse() after being normalized
  // https://msdn.microsoft.com/library/windows/desktop/aa365247(v=vs.85).aspx#namespaces
  let prefix = "";
  if (len > 4 && path[3] === "\\") {
    const ch = path[2];
    if ((ch === "?" || ch === ".") && path.slice(0, 2) === "\\\\") {
      path = path.slice(2);
      prefix = "//";
    }
  }

  const segments = path.split(/[/\\]+/);
  if (stripTrailing !== false && segments[segments.length - 1] === "") {
    segments.pop();
  }
  return prefix + segments.join("/");
};
