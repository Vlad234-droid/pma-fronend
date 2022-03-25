import rfdc from 'rfdc';
import dateformat from 'dateformat';
import stringifySafe from 'fast-safe-stringify';
import { isMatch } from 'micromatch';

import { defaultColorizeLevel, getTheme, HighlightTheme } from './themes';
import {
   DATE_FORMAT,
   ERROR_LIKE_KEYS,
   MESSAGE_KEY,
   LEVEL_KEY,
   LEVEL_LABEL,
   TIMESTAMP_KEY,
   LOGGER_KEYS,
   LEVELS
} from './constants';

const clone = rfdc({ circles: true });

const defaultTheme: HighlightTheme = getTheme();

/**
 * Converts a given `epoch` to a desired display format.
 *
 * @param {number|string} epoch The time to convert. May be any value that is
 * valid for `new Date()`.
 * @param {boolean|string} [translateTime=false] When `false`, the given `epoch`
 * will simply be returned. When `true`, the given `epoch` will be converted
 * to a string at UTC using the `DATE_FORMAT` constant. If `translateTime` is
 * a string, the following rules are available:
 *
 * - `<format string>`: The string is a literal format string. This format
 * string will be used to interpret the `epoch` and return a display string
 * at UTC.
 * - `SYS:STANDARD`: The returned display string will follow the `DATE_FORMAT`
 * constant at the system's local timezone.
 * - `SYS:<format string>`: The returned display string will follow the given
 * `<format string>` at the system's local timezone.
 * - `UTC:<format string>`: The returned display string will follow the given
 * `<format string>` at UTC.
 *
 * @returns {number|string} The formatted time.
 */
function formatTime (epoch: number | string, translateTime: boolean | string = false): number|string {
   if (translateTime === false) {
      return epoch;
   }

   const instant = createDate(epoch);

   // If the Date is invalid, do not attempt to format
   if (!isValidDate(instant)) {
      return epoch
   }

   if (translateTime === true) {
      return dateformat(instant, 'UTC:' + DATE_FORMAT)
   }

   const upperFormat = translateTime.toUpperCase()
   if (upperFormat === 'SYS:STANDARD') {
      return dateformat(instant, DATE_FORMAT)
   }

   const prefix = upperFormat.substr(0, 4)
   if (prefix === 'SYS:' || prefix === 'UTC:') {
      if (prefix === 'UTC:') {
         return dateformat(instant, translateTime)
      }
      return dateformat(instant, translateTime.slice(4))
   }

   return dateformat(instant, `UTC:${translateTime}`)
}

/**
 * Constructs a JS Date from a number or string. Accepts any single number
 * or single string argument that is valid for the Date() constructor,
 * or an epoch as a string.
 *
 * @param {string|number} epoch The representation of the Date.
 *
 * @returns {Date} The constructed Date.
 */
function createDate (epoch: string | number): Date {
   // If epoch is already a valid argument, return the valid Date
   let date = new Date(epoch);
   if (isValidDate(date)) {
      return date;
   }

   // Convert to a number to permit epoch as a string
   date = new Date(+epoch);
   return date;
}

/**
 * Checks if the argument is a JS Date and not 'Invalid Date'.
 *
 * @param {Date} date The date to check.
 *
 * @returns {boolean} true if the argument is a JS Date and not 'Invalid Date'.
 */
function isValidDate (date: Date): boolean {
   return date instanceof Date && !Number.isNaN(date.getTime());
}
 
/**
* 
* @param input 
* @returns 
*/
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function isObject (input: any): boolean {
   return Object.prototype.toString.apply(input) === '[object Object]';
}
 
 
type PJoinLinesWithIndentation = { input: string, ident: string, eol: string };
 
/**
 * Given a string with line separators, either `\r\n` or `\n`, add indentation
 * to all lines subsequent to the first line and rejoin the lines using an
 * end of line sequence.
 *
 * @param {object} input
 * @param {string} input.input The string to split and reformat.
 * @param {string} [input.ident] The indentation string. Default: `    ` (4 spaces).
 * @param {string} [input.eol] The end of line sequence to use when rejoining
 * the lines. Default: `'\n'`.
 *
 * @returns {string} A string with lines subsequent to the first indented
 * with the given indentation sequence.
 */
function joinLinesWithIndentation (params: Partial<PJoinLinesWithIndentation>): string {
   const defaultParams: Omit<PJoinLinesWithIndentation, 'input'> = { 
      ident: '    ', 
      eol: '\n',
   };

   const { input, ident, eol } = Object.assign({}, defaultParams, params);

   if (input === undefined || input === null) {
      return '';
   }

   const lines = input.split(/\r?\n/);
   for (let i = 1; i < lines.length; i += 1) {
     lines[i] = ident + lines[i];
   }
 
   return lines.join(eol);
}
 

export type LogDescriptor = Record<string, unknown>;
// type LogDescriptor = Record<string, object | string | number>;

export type PPrettifyErrorLog = {
   log: LogDescriptor,
   messageKey: string,
   ident: string,
   eol: string,
   errorLikeKeys: string[],
   errorProperties: string[],
};
 
/**
 * Given a log object that has a `type: 'Error'` key, prettify the object and
 * return the result. In other
 *
 * @param {object} input
 * @param {object} input.log The error log to prettify.
 * @param {string} [input.messageKey] The name of the key that contains a
 * general log message. This is not the error's message property but the logger
 * messsage property. Default: `MESSAGE_KEY` constant.
 * @param {string} [input.ident] The sequence to use for indentation. Default: `'    '`.
 * @param {string} [input.eol] The sequence to use for EOL. Default: `'\n'`.
 * @param {string[]} [input.errorLikeKeys] A set of keys that should be considered
 * to have error objects as values. Default: `ERROR_LIKE_KEYS` constant.
 * @param {string[]} [input.errorProperties] A set of specific error object
 * properties, that are not the value of `messageKey`, `type`, or `stack`, to
 * include in the prettified result. The first entry in the list may be `'*'`
 * to indicate that all sibiling properties should be prettified. Default: `[]`.
 *
 * @returns {string} A sring that represents the prettified error log.
 */
export function prettifyErrorLog (params: Partial<PPrettifyErrorLog>): string {
   const defaultParams: Omit<PPrettifyErrorLog, 'log'> = {
      messageKey: MESSAGE_KEY,
      ident: '    ',
      eol: '\n',
      errorLikeKeys:  ERROR_LIKE_KEYS,
      errorProperties: []
   };

   const {
      log,
      messageKey,
      ident,
      eol,
      errorLikeKeys,
      errorProperties
   } = Object.assign({}, defaultParams, params);
 
   if (log === undefined || log == null) {
      return '';
   }

   const stack = log.stack && typeof log.stack === 'string' ? log.stack : '';
   const joinedLines = joinLinesWithIndentation({ input: stack, ident, eol });
   let result = `${ident}${joinedLines}${eol}`;
 
   if (errorProperties.length > 0) {
      const excludeProperties = LOGGER_KEYS.concat(messageKey, 'type', 'stack');
      let propertiesToPrint;
      if (errorProperties[0] === '*') {
         // Print all sibling properties except for the standard exclusions.
         propertiesToPrint = Object.keys(log).filter(k => excludeProperties.includes(k) === false);
      } else {
         // Print only sepcified properties unless the property is a standard exclusion.
         propertiesToPrint = errorProperties.filter(k => excludeProperties.includes(k) === false);
      }
 
      for (let i = 0; i < propertiesToPrint.length; i += 1) {
         const key = propertiesToPrint[i];
         if (key in log === false) continue;
         if (isObject(log[key]) && typeof log[key] === 'object') {
            // The nested object may have "logger" type keys but since they are not
            // at the root level of the object being processed, we want to print them.
            // Thus, we invoke with `excludeLoggerKeys: false`.
            const prettifiedObject = prettifyObject({ 
               input: log[key], 
               errorLikeKeys, 
               excludeLoggerKeys: false, 
               eol, 
               ident,
            });
            result = `${result}${key}: {${eol}${prettifiedObject}}${eol}`;
            continue;
         }
         result = `${result}${key}: ${log[key]}${eol}`;
      }
   }
 
   return result;
}
 

export type PPrettifyLevel = { 
   log: LogDescriptor, 
   theme: HighlightTheme, 
   levelKey: string 
};

/**
 * Checks if the passed in log has a `level` value and returns a prettified
 * string for that level if so.
 *
 * @param {object} input
 * @param {object} input.log The log object.
 * @param {function} [input.theme] A theme function that accepts a level
 * value and returns a colorized string. Default: a no-op theme.
 * @param {string} [levelKey='level'] The key to find the level under.
 *
 * @returns {undefined|string} If `log` does not have a `level` property then
 * `undefined` will be returned. Otherwise, a string from the specified
 * `theme` is returned.
 */
export function prettifyLevel ({ log, theme = defaultTheme, levelKey = LEVEL_KEY }: PPrettifyLevel): string | undefined {
   if (levelKey in log === false) {
      return undefined;
   }
   if (typeof log[levelKey] === 'string' || typeof log[levelKey] === 'number') {
      return theme.colorizeLevel
         ? theme.colorizeLevel(log[levelKey] as string | number)
         : defaultColorizeLevel(log[levelKey] as string | number, theme);
   }
   return undefined;
}


export type MessageFormatFunc = (log: LogDescriptor, messageKey: string, levelLabel: string) => string;

export type PPrettifyMessage = { 
   log: LogDescriptor, 
   messageFormat: false | string | MessageFormatFunc, 
   messageKey: string, 
   theme: HighlightTheme, 
   levelLabel: string, 
}


/**
 * Prettifies a message string if the given `log` has a message property.
 *
 * @param {object} input
 * @param {object} input.log The log object with the message to colorize.
 * @param {string} [input.messageKey='msg'] The property of the `log` that is the
 * message to be prettified.
 * @param {string|function} [input.messageFormat=undefined] A format string or function that defines how the
 *  logged message should be formatted, e.g. `'{level} - {pid}'`.
 * @param {function} [input.theme] A theme function that has a
 * `.message(str)` method attached to it. This function should return a colorized
 * string which will be the "prettified" message. Default: a no-op theme.
 *
 * @returns {undefined|string} If the message key is not found, or the message
 * key is not a string, then `undefined` will be returned. Otherwise, a string
 * that is the prettified message.
 */
export function prettifyMessage (params: Partial<PPrettifyMessage>): string | undefined {
   const defaultParams: Omit<PPrettifyMessage, 'log' | 'messageFormat'> = { 
      messageKey: MESSAGE_KEY, 
      theme: defaultTheme, 
      levelLabel: LEVEL_LABEL 
   };

   const {
      log, 
      messageFormat, 
      messageKey, 
      theme, 
      levelLabel,
   } = Object.assign({}, defaultParams, params);
   
   if (log == null || log == undefined) {
      return undefined;
   }

   if (messageFormat && typeof messageFormat === 'string') {
      const message = String(messageFormat).replace(/{([^{}]+)}/g, (match, p1) => {
         // return log level as string instead of int
         if (p1 === levelLabel && log[LEVEL_KEY]) {
            return LEVELS[log[LEVEL_KEY] as number | 'default'];
         }
         // Parse nested key access, e.g. `{keyA.subKeyB}`.
         return p1.split('.').reduce((prev: string[], curr: number) => {
            if (prev && prev[curr]) {
               return prev[curr];
            }
            return '';
         }, log);
      })
      return theme.message(message);
   }

   if (messageFormat && typeof messageFormat === 'function') {
     const msg = messageFormat(log, messageKey, levelLabel);
     return theme.message(msg);
   }

   if (messageKey in log === false) {
      return undefined;
   }
   
   if (typeof log[messageKey] !== 'string') {
      return undefined;
   }

   return theme.message(log[messageKey] as string);
}
 

export type PPrettifyMetadata = { 
   log: LogDescriptor 
};

/**
 * Prettifies metadata that is usually present in a Pino log line. It looks for
 * fields `name`, `pid`, `hostname`, and `caller` and returns a formatted string using
 * the fields it finds.
 *
 * @param {object} input
 * @param {object} input.log The log that may or may not contain metadata to
 * be prettified.
 *
 * @returns {undefined|string} If no metadata is found then `undefined` is
 * returned. Otherwise, a string of prettified metadata is returned.
 */
export function prettifyMetadata ({ log }: PPrettifyMetadata): string | undefined {
   let line = '';
 
   if (log.name || log.pid || log.hostname) {
      line += '(';
  
      if (log.name) {
         line += log.name;
      }
 
      if (log.name && log.pid) {
         line += '/' + log.pid;
      } else if (log.pid) {
         line += log.pid;
      }
 
      if (log.hostname) {
         // If `pid` and `name` were in the ignore keys list then we don't need
         // the leading space.
         line += `${line === '(' ? 'on' : ' on'} ${log.hostname}`;
      }
 
      line += ')';
   }
 
   if (log.caller) {
      line += `${line === '' ? '' : ' '}<${log.caller}>`;
   }
 
   if (line === '') {
      return undefined;
   } else {
      return line;
   }
 }
 
 export type CustomPrettifierFunc = (v: string | object, k: string, inputData: string | object) => string;

 export type PPrettifyObject = {
   input: unknown,
   ident: string,
   eol: string,
   skipKeys: string[],
   customPrettifiers: Record<string, CustomPrettifierFunc>,
   errorLikeKeys: string[],
   excludeLoggerKeys: boolean,
   singleLine: boolean,
   theme: HighlightTheme,
}

/**
 * Prettifies a standard object. Special care is taken when processing the object
 * to handle child objects that are attached to keys known to contain error
 * objects.
 *
 * @param {object} input
 * @param {object} input.input The object to prettify.
 * @param {string} [input.ident] The identation sequence to use. Default: `'    '`.
 * @param {string} [input.eol] The EOL sequence to use. Default: `'\n'`.
 * @param {string[]} [input.skipKeys] A set of object keys to exclude from the
 * prettified result. Default: `[]`.
 * @param {Object<string, function>} [input.customPrettifiers] Dictionary of
 * custom prettifiers. Default: `{}`.
 * @param {string[]} [input.errorLikeKeys] A set of object keys that contain
 * error objects. Default: `ERROR_LIKE_KEYS` constant.
 * @param {boolean} [input.excludeLoggerKeys] Indicates if known logger specific
 * keys should be excluded from prettification. Default: `true`.
 * @param {boolean} [input.singleLine] Should non-error keys all be formatted
 * on a single line? This does NOT apply to errors, which will still be
 * multi-line. Default: `false`
 *
 * @returns {string} The prettified string. This can be as little as `''` if
 * there was nothing to prettify.
 */
export function prettifyObject (params: Partial<PPrettifyObject>): string {
   const defaultParams: Omit<PPrettifyObject, 'input'> = {
      ident: '    ',
      eol: '\n',
      skipKeys: [],
      customPrettifiers: {},
      errorLikeKeys: ERROR_LIKE_KEYS,
      excludeLoggerKeys: true,
      singleLine: false,
      theme: defaultTheme,
   };

   const {
      input,
      ident,
      eol,
      skipKeys,
      customPrettifiers,
      errorLikeKeys,
      excludeLoggerKeys,
      singleLine,
      theme,
   } = Object.assign({}, defaultParams, params);
   
   const keysToIgnore = ([] as string[]).concat(skipKeys);
 
   if (excludeLoggerKeys === true) Array.prototype.push.apply(keysToIgnore, LOGGER_KEYS);
 
   let result = '';
 
   if (input === null || input === undefined || !isObject(input)) {
      return result;
   }

   // Split object keys into two categories: error and non-error
   const { plain, errors } = Object.entries(input as object).reduce(({ plain, errors }, [k, v]) => {
      if (keysToIgnore.includes(k) === false) {
         let pretty;
         const pretiefierSearch = Object.entries(customPrettifiers).find(([key]) => k === key) 
            || Object.entries(customPrettifiers).find(([key]) => isMatch(k, key));

         if (pretiefierSearch) {
            // Pre-apply custom prettifiers, because all 3 cases below will need this
            const [_, customPrettifier] = pretiefierSearch; 
            pretty = typeof input === 'object' ? customPrettifier(v, k, input as object) : input;
         } else {
            pretty = v;
         }

         if (errorLikeKeys.includes(k)) {
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            (errors as any)[k] = pretty;
         } else {
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            (plain as any)[k] = pretty;
         }
      }
      return { plain, errors };
   }, { plain: {}, errors: {} });
 
   if (singleLine) {
      // Stringify the entire object as a single JSON line
      if (Object.keys(plain).length > 0) {
         result += theme.greyMessage(stringifySafe(plain));
      }
      result += eol;
   } else {
      // Put each object entry on its own line
      Object.entries(plain).forEach(([keyName, keyValue]) => {
         // custom prettifiers are already applied above, so we can skip it now
         const pretiefierSearch = Object.entries(customPrettifiers).find(([key]) => isMatch(keyName, key));
         const lines: string | undefined = pretiefierSearch
            ? keyValue as string // just cast to string, as customPrettifier function returns string
            : stringifySafe(keyValue, undefined, 2);
 
         if (lines === undefined) return;
 
         const joinedLines = joinLinesWithIndentation({ input: lines, ident, eol });
         result += `${ident}${keyName}: ${joinedLines}${eol}`;
      })
   }
 
   // Errors
   Object.entries(errors).forEach(([keyName, keyValue]) => {
      // custom prettifiers are already applied above, so we can skip it now
      const pretiefierSearch = Object.entries(customPrettifiers).find(([key]) => isMatch(keyName, key));
      const lines: string | undefined = pretiefierSearch
         ? keyValue as string // just cast to string, as customPrettifier function returns string
         : stringifySafe(keyValue, undefined, 2);
 
      if (lines === undefined) return;
 
      result += prettifyError({ keyName, lines, eol, ident });
   })
 
   return result;
}
 

export type PPrettifyTime = { 
   log: LogDescriptor, 
   timestampKey: string, 
   translateFormat?: boolean | string,
   theme: HighlightTheme, 
};

/**
 * Prettifies a timestamp if the given `log` has either `time`, `timestamp` or custom specified timestamp
 * property.
 *
 * @param {object} input
 * @param {object} input.log The log object with the timestamp to be prettified.
 * @param {string} [input.timestampKey='time'] The log property that should be used to resolve timestamp value
 * @param {boolean|string} [input.translateFormat=undefined] When `true` the
 * timestamp will be prettified into a string at UTC using the default
 * `DATE_FORMAT`. If a string, then `translateFormat` will be used as the format
 * string to determine the output; see the `formatTime` function for details.
 *
 * @returns {undefined|string} If a timestamp property cannot be found then
 * `undefined` is returned. Otherwise, the prettified time is returned as a
 * string.
 */
export function prettifyTime (params: Partial<PPrettifyTime>): string | undefined {
   const defaultParams: Omit<PPrettifyTime, 'log'> = {
      timestampKey: TIMESTAMP_KEY, 
      translateFormat: undefined,
      theme: defaultTheme, 
   };

   const {
      log,
      timestampKey,
      translateFormat,
      theme,
   } = Object.assign({}, defaultParams, params);
   
   if (log === null || log === undefined) {
      return undefined;
   }

   let time: string | number | undefined = undefined;
 
   if (timestampKey in log) {
      time = log[timestampKey] as string | number;
   } else if ('timestamp' in log) {
      time = log.timestamp as string | number;
   }
 
   if (time === undefined) {
      return undefined;
   }

   if (translateFormat) {
      return theme.time('[' + formatTime(time, translateFormat) + ']');
   }
 
   return theme.time(`[${time}]`);
}
 

type PPrettifyError = { 
   keyName: string, 
   lines: string, 
   eol: string, 
   ident: string 
};

/**
 * Prettifies an error string into a multi-line format.
 * @param {object} input
 * @param {string} input.keyName The key assigned to this error in the log object
 * @param {string} input.lines The STRINGIFIED error. If the error field has a
 *  custom prettifier, that should be pre-applied as well
 * @param {string} input.ident The indentation sequence to use
 * @param {string} input.eol The EOL sequence to use
 */
function prettifyError (params: PPrettifyError): string {
   const { 
      keyName, 
      lines, 
      eol, 
      ident 
   } = params;

   let result = '';
   const joinedLines = joinLinesWithIndentation({ input: lines, ident, eol });
   const splitLines = `${ident}${keyName}: ${joinedLines}${eol}`.split(eol);
 
   for (let j = 0; j < splitLines.length; j += 1) {
     if (j !== 0) result += eol;
 
     const line = splitLines[j];
     if (/^\s*"stack"/.test(line)) {
       const matches = /^(\s*"stack":)\s*(".*"),?$/.exec(line);
       /* istanbul ignore else */
       if (matches && matches.length === 3) {
         const indentSize = /^\s*/.exec(line)![0].length + 4;
         const indentation = ' '.repeat(indentSize);
         const stackMessage = matches[2];
         result += matches[1] + eol + indentation + JSON.parse(stackMessage).replace(/\n/g, eol + indentation);
       }
     } else {
       result += line;
     }
   }
 
   return result;
 }
 

 /**
  * Splits the input key delimited by a dot character but not when it is preceded
  * by a backslash.
  *
  * @param {string} key A string identifying the property.
  *
  * @returns {string[]} Returns a list of string containing each delimited property.
  * e.g. `'prop2\.domain\.corp.prop2'` should return [ 'prop2.domain.com', 'prop2' ]
  */
 function splitIgnoreKey (key: string): string[] {
   const result: string[] = [];
   let backslash = false;
   let segment = '';
 
   for (let i = 0; i < key.length; i++) {
     const c = key.charAt(i);
 
     if (c === '\\') {
       backslash = true;
       continue;
     }
 
     if (backslash) {
       backslash = false;
       segment += c;
       continue;
     }
 
     /* Non-escaped dot, push to result */
     if (c === '.') {
       result.push(segment);
       segment = '';
       continue;
     }
 
     segment += c;
   }
 
   /* Push last entry to result */
   if (segment.length) {
     result.push(segment);
   }
 
   return result;
 }
 
 /**
  * Deletes a specified property from a log object if it exists.
  * This function mutates the passed in `log` object.
  *
  * @param {object} log The log object to be modified.
  * @param {string} property A string identifying the property to be deleted from
  * the log object. Accepts nested properties delimited by a `.`
  * Delimiter can be escaped to preserve property names that contain the delimiter.
  * e.g. `'prop1.prop2'` or `'prop2\.domain\.corp.prop2'`
  */
 function deleteLogProperty (log: LogDescriptor, property: string): void {
   const props = splitIgnoreKey(property);
   const propToDelete = props.pop();
 
   if (propToDelete === undefined) {
      return;
   }

   props.forEach((prop) => {
     if (!Object.prototype.hasOwnProperty.call(log, prop)) {
       return;
     }
     log = log[prop] as LogDescriptor;
   })
 
   delete log[propToDelete];
 }
 
 /**
  * Filter a log object by removing any ignored keys.
  *
  * @param {object} log The log object to be modified.
  * @param {string[]} ignoreKeys An array of strings identifying the properties to be removed.
  *
  * @returns {object} A new `log` object instance that does not include the ignored keys.
  */
 export function filterLog (log: LogDescriptor, ignoreKeys: string[]): LogDescriptor {
   const logCopy = clone(log);

   ignoreKeys.forEach((ignoreKey) => {
     deleteLogProperty(logCopy, ignoreKey);
   })

   return logCopy;
 }