/**
 * Test Setup File
 */

/** Disable Loglevels */
type loglevels = "debug" | "error" | "info" | "log" | "trace" | "warn";
const disabledConsoleLevels: loglevels[] = ["log", "info", "trace", "warn"];

disabledConsoleLevels.forEach((lvl: loglevels) => {
  jest.spyOn(global.console, lvl).mockImplementation(() => jest.fn());
});
