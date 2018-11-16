import 'reflect-metadata';
import * as Validator from 'validator';

interface ValidatorOptions {
  message?: string;
  context?: any;
}

type ValidatorSwitcher = boolean | [boolean, ValidatorOptions?];
type ValidatorSwitcherWithParams<P> = P | [P, ValidatorOptions?]

interface Addtional {
  message?: string | Function,
  each?: boolean;
}


interface RuleCreator {

  // **************
  // * Validators *
  // **************
  readonly not: RuleCreator;


  // **************
  // * Sanitizers *
  // **************

  // remove characters that appear in the blacklist. The characters are used in a RegExp and so you will need
  // to escape some chars, e.g. blacklist(input, '\\[\\]').
  blacklist(chars: string): string;

  // replace <, >, &, ', " and / with HTML entities.
  escape(): string;

  // replaces HTML encoded entities with <, >, &, ', " and /.
  unescape(): string;

  // trim characters from the left-side of the input.
  ltrim(chars?: string): string;

  // canonicalize an email address.
  normalizeEmail(options?: ValidatorJS.NormalizeEmailOptions): string | false;

  // trim characters from the right-side of the input.
  rtrim(chars?: string): string;

  // remove characters with a numerical value < 32 and 127, mostly control characters. If keep_new_lines is true,
  // newline characters are preserved (\n and \r, hex 0xA and 0xD). Unicode-safe in JavaScript.
  stripLow(keep_new_lines?: boolean): string;

  // convert the input to a boolean. Everything except for '0', 'false' and '' returns true. In strict mode only '1'
  // and 'true' return true.
  toBoolean(strict?: boolean): boolean;

  // convert the input to a date, or null if the input is not a date.
  toDate(): Date; // Date or null

  // convert the input to a float, or NaN if the input is not a float.
  toFloat(): number; // number or NaN

  // convert the input to an integer, or NaN if the input is not an integer.
  toInt(radix?: number): number; // number or NaN

  // trim characters (whitespace by default) from both sides of the input.
  trim(chars?: string): string;

  // remove characters that do not appear in the whitelist. The characters are used in a RegExp and so you will
  // need to escape some chars, e.g. whitelist(input, '\\[\\]').
  whitelist(chars: string): string;

  toString(input: any | any[]): string;
}

interface CommonValidator {
  // check if the string matches the comparison.
  equals(comparison: any): Rule;

  not: this;
  // check if the string has a length of zero or undefined.
  empty(): Rule;
  required(): Rule;

  // check if the string is in a array of allowed values.
  in(values: any[]): Rule;

}

interface NumberValidator {
  // check if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.
  decimal(options?: ValidatorJS.IsDecimalOptions): Rule;

  // check if the string is a number that's divisible by another.
  divisibleBy(number: number): Rule;


  // check if the string is a float.
  float(options?: ValidatorJS.IsFloatOptions): Rule;

  // check if the string is an integer.
  int(options?: ValidatorJS.IsIntOptions): Rule;

  // check if the string is a valid port number.
  port(): Rule;
}

interface StringValidator {

  // check if the string contains the seed.
  contains(seed: string): Rule;

  // check if the string is a date that's after the specified date (true means after now).
  after(date?: string): Rule;

  // check if the string contains only letters (a-zA-Z). Locale is one of ['ar', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG',
  // 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MA', 'ar-QA', 'ar-QM', 'ar-SA', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-YE',
  // 'bg-BG', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'en-ZM',
  // 'es-ES', 'fr-FR', 'hu-HU', 'it-IT', 'nb-NO', 'nl-NL', 'nn-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ru-RU', 'sk-SK', 'sr-RS',
  // 'sr-RS@latin', 'sv-SE', 'tr-TR', 'uk-UA']) and defaults to en-US
  alpha(locale?: ValidatorJS.AlphaLocale): Rule;

  // check if the string contains only letters and numbers. Locale is one of ['ar', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG',
  // 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MA', 'ar-QA', 'ar-QM', 'ar-SA', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-YE',
  // 'bg-BG', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'en-ZM',
  // 'es-ES', 'fr-FR', 'hu-HU', 'it-IT', 'nb-NO', 'nl-NL', 'nn-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ru-RU', 'sk-SK', 'sr-RS',
  // 'sr-RS@latin', 'sv-SE', 'tr-TR', 'uk-UA']) and defaults to en-US
  alphanumeric(locale?: ValidatorJS.AlphanumericLocale): Rule;


  // check if the string contains ASCII chars only.
  ascii(): Rule;

  // check if a string is base64 encoded.
  base64(): Rule;

  // check if the string is a date that's before the specified date.
  before(date?: string): Rule;

  // check if the string's length (in bytes) falls in a range.
  byteLength(options: ValidatorJS.IsByteLengthOptions): Rule;
  byteLength(min: number, max?: number): Rule;

  // check if the string is a credit card.
  creditCard(): Rule;

  // check if the string is a valid currency amount.
  currency(options?: ValidatorJS.IsCurrencyOptions): Rule;

  // check if the string is a data uri format (https://developer.mozilla.org/en-US/docs/Web/HTTP/data_URIs)
  dataURI(): Rule;

  // check if the string is an email.
  email(options?: ValidatorJS.IsEmailOptions): Rule;

  // check if the string is a fully qualified domain name (e.g. domain.com).
  FQDN(options?: ValidatorJS.IsFQDNOptions): Rule;

  // check if the string contains any full-width chars.
  fullWidth(): Rule;

  // check if the string contains any half-width chars.
  halfWidth(): Rule;

  // check if the string is a hash of type algorithm.
  // Algorithm is one of ['md4', 'md5', 'sha1', 'sha256', 'sha384', 'sha512', 'ripemd128', 'ripemd160', 'tiger128',
  // 'tiger160', 'tiger192', 'crc32', 'crc32b']
  hash(algorithm: ValidatorJS.HashAlgorithm): Rule;

  // check if the string is a hexadecimal color.
  hexColor(): Rule;

  // check if the string is a hexadecimal number.
  hexadecimal(): Rule;

  // check if the string is an IP (version 4 or 6).
  IP(version?: number): Rule;

  // check if the string is an ISBN (version 10 or 13).
  ISBN(version?: number): Rule;

  // check if the string is an ISSN (https://en.wikipedia.org/wiki/International_Standard_Serial_Number).
  ISSN(options?: ValidatorJS.IsISSNOptions): Rule;

  // check if the string is an ISIN (https://en.wikipedia.org/wiki/International_Securities_Identification_Number)
  // (stock/security identifier).
  ISIN(): Rule;

  // check if the string is a valid ISO 8601 (https://en.wikipedia.org/wiki/ISO_8601) date.
  ISO8601(): Rule;

  // check if the string is a valid ISO 3166-1 alpha-2 (https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) officially assigned
  // country code.
  ISO31661Alpha2(): Rule;

  // check if the string is a ISRC (https://en.wikipedia.org/wiki/International_Standard_Recording_Code).
  ISRC(): Rule;

  // check if the string is valid JSON (note: uses JSON.parse).
  JSON(): Rule;

  // check if the string is a valid latitude-longitude coordinate in the format lat,long or lat, long.
  latLong(): Rule;

  // check if the string's length falls in a range.
  // Note: this function takes into account surrogate pairs.
  length(options: ValidatorJS.IsLengthOptions): Rule;
  length(min: number, max?: number): Rule;

  // check if the string is lowercase.
  lowercase(): Rule;

  // check if the string is a MAC address.
  MACAddress(): Rule;

  // check if the string is a MD5 hash.
  MD5(): Rule;

  // check if the string matches to a valid MIME type (https://en.wikipedia.org/wiki/Media_type) format
  mimeType(): Rule;

  // check if the string is a mobile phone number, (locale is one of
  // ['ar-AE', ar-DZ', 'ar-EG', 'ar-JO', 'ar-SA', 'ar-SY', 'be-BY', 'bg-BG', 'cs-CZ', 'de-DE',
  // 'da-DK', 'el-GR', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-KE', 'en-NG', 'en-NZ', 'en-UG',
  // 'en-RW', 'en-SG', 'en-TZ', 'en-PK', 'en-US', 'en-CA', 'en-ZA', 'en-ZM', 'es-ES', 'fa-IR',
  // 'fi-FI', 'fo-FO', 'fr-FR', 'he-IL', 'hu-HU', 'id-ID', 'it-IT', 'ja-JP', 'kk-KZ', 'kl-GL',
  // 'ko-KR', 'lt-LT', 'ms-MY', 'nb-NO', 'nn-NO', 'pl-PL', 'pt-PT', 'ro-RO', 'ru-RU', 'sk-SK',
  // 'sr-RS', 'th-TH', 'tr-TR', 'uk-UA', 'vi-VN', 'zh-CN', 'zh-HK', 'zh-TW']).
  mobilePhone(locale: ValidatorJS.MobilePhoneLocale, options?: ValidatorJS.IsMobilePhoneOptions): Rule;

  // check if the string is a valid hex-encoded representation of a MongoDB ObjectId
  // (http://docs.mongodb.org/manual/reference/object-id/).
  mongoId(): Rule;

  // check if the string contains one or more multibyte chars.
  multibyte(): Rule;

  // check if the string contains only numbers.
  numeric(options?: ValidatorJS.IsNumericOptions): Rule;

  // check if the string is a postal code, (locale is one of
  // [ 'AT', 'AU', 'BE', 'BG', 'CA', 'CH', 'CZ', 'DE', 'DK', 'DZ', 'ES', 'FI', 'FR', 'GB', 'GR',
  // 'IL', 'IN', 'IS', 'IT', 'JP', 'KE', 'LI', 'MX', 'NL', 'NO', 'PL', 'PT', 'RO', 'RU', 'SA',
  // 'SE', 'TW', 'US', 'ZA', 'ZM' ]) OR 'any'. If 'any' is used, function will check if any of the
  // locales match).
  postalCode(locale: ValidatorJS.PostalCodeLocale): Rule;

  // check if the string contains any surrogate pairs chars.
  surrogatePair(): Rule;

  // check if the string is an URL.
  URL(options?: ValidatorJS.IsURLOptions): Rule;

  // check if the string is a UUID. Must be one of ['3', '4', '5', 'all'], default is all.
  UUID(version?: 3 | 4 | 5 | "3" | "4" | "5" | "all"): Rule;

  // check if the string is uppercase.
  uppercase(): Rule;

  // check if the string contains a mixture of full and half-width chars.
  variableWidth(): Rule;

  // checks characters if they appear in the whitelist.
  whitelisted(chars: string | string[]): Rule;

  // check if string matches the pattern.
  matches(pattern: RegExp | string, modifiers?: string): Rule;
}

interface ClassValidator {
  type(TClass: new () => any, fieldsPattern?: string): Rule;
}

interface IValidateTarget extends CommonValidator, NumberValidator, ClassValidator {
  func(f: (target: any, ctx: any) => Promise<boolean> | boolean): Rule
}

type RuleValidate = (target: object, key: string) => boolean | Promise<boolean>;
type RuleMessage = string | ((target: object, key: string) => string);
export class Rule {
  private _validate: RuleValidate;
  private _async: boolean;
  private _message: RuleMessage;
  private _condition: (o: any) => boolean;
  constructor(
    validate: RuleValidate,
    isAsync: boolean = false,
    message?: RuleMessage,
    condition?: (o: any) => boolean
  ) {
    if (typeof validate !== 'function') {
      throw new Error('validate must be function type')
    }
    this._validate = validate;
    this._async = isAsync;
    this._message = message;
    this._condition = condition;
  }

  get isAsync(): boolean { return this._async; }

  // Validate value with current rule, ctx normally is the class instance
  validate(target: object, key: string): boolean | Promise<boolean> {
    return this._validate(target, key);
  }
  // copy a new Rule with specified message
  message(message: RuleMessage): Rule {
    return new Rule(this._validate, this._async, message, this._condition);
  }
  // copy a new Rule with specified onlyIf condition
  onlyIf(condition: (o: any) => boolean): Rule {
    return new Rule(this._validate, this._async, this._message, condition)
  }

}

class IS implements StringValidator {
  sync(f: RuleValidate): Rule {
    return new Rule(f);
  }
  async(f: RuleValidate): Rule {
    return new Rule(f, true);
  }

  // check if the string contains the seed.
  contains(seed: string): Rule {
    return new Rule(
      (target, key) => Validator.contains(target[key], seed),
      false,
      (target, key) => ''
    );
  }

  // check if the string is a date that's after the specified date (true means after now).
  after(date?: string): Rule {
    return new Rule(
      (target, key) => Validator.isAfter(target[key], date),
      false,
      (target, key) => ''
    );
  }
  alpha(locale?: ValidatorJS.AlphaLocale): Rule {
    return new Rule(
      (target, key) => Validator.isAlpha(target[key], locale),
      false,
      (target, key) => ''
    );
  }
  alphanumeric(locale?: ValidatorJS.AlphaLocale): Rule {
    return new Rule(
      (target, key) => Validator.isAlphanumeric(target[key], locale),
      false,
      (target, key) => ''
    );
  }
  ascii(): Rule {
    return new Rule(
      (target, key) => Validator.isAscii(target[key]),
      false,
      (target, key) => ''
    );
  }
  base64(): Rule {
    return new Rule(
      (target, key) => Validator.isBase64(target[key]),
      false,
      (target, key) => ''
    );
  }
  before(date?: string): Rule {
    return new Rule(
      (target, key) => Validator.isBefore(target[key], date),
      false,
      (target, key) => ''
    );
  }
  byteLength(options: ValidatorJS.IsByteLengthOptions): Rule;
  byteLength(min: number, max?: number): Rule;
  byteLength(min: any, max?: any): Rule {
    return new Rule(
      (target, key) => Validator.isByteLength(target[key], min, max),
      false,
      (target, key) => ''
    );

  }
  creditCard(): Rule {
    return new Rule(
      (target, key) => Validator.isCreditCard(target[key]),
      false,
      (target, key) => ''
    );
  }
  currency(options?: ValidatorJS.IsCurrencyOptions): Rule {
    return new Rule(
      (target, key) => Validator.isCurrency(target[key], options),
      false,
      (target, key) => ''
    );
  }
  dataURI(): Rule {
    return new Rule(
      (target, key) => Validator.isDataURI(target[key]),
      false,
      (target, key) => ''
    );
  }
  email(options?: ValidatorJS.IsEmailOptions): Rule {
    return new Rule(
      (target, key) => Validator.isEmail(target[key], options),
      false,
      (target, key) => ''
    );
  }
  FQDN(options?: ValidatorJS.IsFQDNOptions): Rule {
    return new Rule(
      (target, key) => Validator.isFQDN(target[key], options),
      false,
      (target, key) => ''
    );
  }
  fullWidth(): Rule {
    return new Rule(
      (target, key) => Validator.isFullWidth(target[key]),
      false,
      (target, key) => ''
    );
  }
  halfWidth(): Rule {
    return new Rule(
      (target, key) => Validator.isHalfWidth(target[key]),
      false,
      (target, key) => ''
    );
  }
  hash(algorithm: ValidatorJS.HashAlgorithm): Rule {
    return new Rule(
      (target, key) => Validator.isHash(target[key], algorithm),
      false,
      (target, key) => ''
    );
  }
  hexColor(): Rule {
    return new Rule(
      (target, key) => Validator.isHexColor(target[key]),
      false,
      (target, key) => ''
    );
  }
  hexadecimal(): Rule {
    return new Rule(
      (target, key) => Validator.isHexadecimal(target[key]),
      false,
      (target, key) => ''
    );
  }
  IP(version?: number): Rule {
    return new Rule(
      (target, key) => Validator.isIP(target[key], version),
      false,
      (target, key) => ''
    );
  }
  ISBN(version?: number): Rule {
    return new Rule(
      (target, key) => Validator.isISBN(target[key], version),
      false,
      (target, key) => ''
    );
  }
  ISSN(options?: ValidatorJS.IsISSNOptions): Rule {
    return new Rule(
      (target, key) => Validator.isISSN(target[key], options),
      false,
      (target, key) => ''
    );
  }
  ISIN(): Rule {
    return new Rule(
      (target, key) => Validator.isISIN(target[key]),
      false,
      (target, key) => ''
    );
  }
  ISO8601(): Rule {
    return new Rule(
      (target, key) => Validator.isISO8601(target[key]),
      false,
      (target, key) => ''
    );
  }
  ISO31661Alpha2(): Rule {
    return new Rule(
      (target, key) => Validator.isISO31661Alpha2(target[key]),
      false,
      (target, key) => ''
    );
  }
  ISRC(): Rule {
    return new Rule(
      (target, key) => Validator.isISRC(target[key]),
      false,
      (target, key) => ''
    );
  }
  JSON(): Rule {
    return new Rule(
      (target, key) => Validator.isJSON(target[key]),
      false,
      (target, key) => ''
    );
  }
  latLong(): Rule {
    return new Rule(
      (target, key) => Validator.isLatLong(target[key]),
      false,
      (target, key) => ''
    );
  }
  length(options: ValidatorJS.IsLengthOptions): Rule;
  length(min: number, max?: number): Rule;
  length(min: any, max?: any): Rule {
    return new Rule(
      (target, key) => Validator.isLength(target[key], min, max),
      false,
      (target, key) => ''
    );
  }
  lowercase(): Rule {
    return new Rule(
      (target, key) => Validator.isLowercase(target[key]),
      false,
      (target, key) => ''
    );
  }
  MACAddress(): Rule {
    return new Rule(
      (target, key) => Validator.isMACAddress(target[key]),
      false,
      (target, key) => ''
    );
  }
  MD5(): Rule {
    return new Rule(
      (target, key) => Validator.isMD5(target[key]),
      false,
      (target, key) => ''
    );
  }
  mimeType(): Rule {
    return new Rule(
      (target, key) => Validator.isMimeType(target[key]),
      false,
      (target, key) => ''
    );
  }
  mobilePhone(locale: ValidatorJS.MobilePhoneLocale, options?: ValidatorJS.IsMobilePhoneOptions): Rule {
    return new Rule(
      (target, key) => Validator.isMobilePhone(target[key], locale, options),
      false,
      (target, key) => ''
    );
  }
  mongoId(): Rule {
    return new Rule(
      (target, key) => Validator.isMongoId(target[key]),
      false,
      (target, key) => ''
    );
  }
  multibyte(): Rule {
    return new Rule(
      (target, key) => Validator.isMultibyte(target[key]),
      false,
      (target, key) => ''
    );
  }
  numeric(options?: ValidatorJS.IsNumericOptions): Rule {
    return new Rule(
      (target, key) => Validator.isNumeric(target[key], options),
      false,
      (target, key) => ''
    );
  }
  postalCode(locale: ValidatorJS.PostalCodeLocale): Rule {
    return new Rule(
      (target, key) => Validator.isPostalCode(target[key], locale),
      false,
      (target, key) => ''
    );
  }
  surrogatePair(): Rule {
    return new Rule(
      (target, key) => Validator.isSurrogatePair(target[key]),
      false,
      (target, key) => ''
    );
  }
  URL(options?: ValidatorJS.IsURLOptions): Rule {
    return new Rule(
      (target, key) => Validator.isURL(target[key], options),
      false,
      (target, key) => ''
    );
  }
  UUID(version?: 3 | 4 | 5 | "3" | "4" | "5" | "all"): Rule {
    return new Rule(
      (target, key) => Validator.isUUID(target[key], version),
      false,
      (target, key) => ''
    );
  }
  uppercase(): Rule {
    return new Rule(
      (target, key) => Validator.isUppercase(target[key]),
      false,
      (target, key) => ''
    );
  }
  variableWidth(): Rule {
    return new Rule(
      (target, key) => Validator.isVariableWidth(target[key]),
      false,
      (target, key) => ''
    );
  }
  whitelisted(chars: string | string[]): Rule {
    return new Rule(
      (target, key) => Validator.isWhitelisted(target[key], chars),
      false,
      (target, key) => ''
    );
  }
  matches(pattern: string | RegExp, modifiers?: string): Rule {
    return new Rule(
      (target, key) => Validator.matches(target[key], pattern, modifiers),
      false,
      (target, key) => ''
    );
  }
}

export function validate(...rules: Array<Rule | Rule[]>) {
  return function (target: any, key: string | symbol) {
    target.__validators = target.__validators || [];
    target.__validators.push(key);
    return Reflect.metadata('validate', rules)(target, key);
  }
}

validate.each = function (...rules: Array<Rule | Rule[]>) {
  return function (target: any, key: string | symbol) {
    target.__validators = target.__validators || [];
    target.__validators.push(key);
    return Reflect.metadata('validate', rules)(target, key);
  }
}

export function and(...rules: Array<Rule | Rule[]>): Rule { return null; }
export function or(...rules: Array<Rule | Rule[]>): Rule { return null; }

export declare var is: IS;
is = new IS();


export function mixins(...args: any[]) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    args.forEach(baseCtor => {
      // copy property methods and values
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
        if (name === '__validators') {
          return constructor.prototype[name] = (constructor.prototype[name] || []).concat(baseCtor.prototype[name]);
        }
        constructor.prototype[name] = baseCtor.prototype[name];
      });
      // copy decorators
      (baseCtor.prototype.__validators || []).forEach((name: string) => {
        var m = Reflect.getMetadata('validate', baseCtor.prototype, name)
        if (m) {
          Reflect.metadata('validate', m)(constructor.prototype, name);
        }
      })
    });
  }

}

export function getRules<T>(TClass: new () => T, method: string = 'get') {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    var tInstance = new TClass();
    const rules = {};
    TClass.prototype.__validators.forEach((key: string) => {
      rules[key] = { method, ...Reflect.getMetadata('validate', TClass.prototype, key) };
    })
    console.log(rules);
    descriptor.value = function () {
      this.allowMethods = method;
      this.rules = rules;
    }
  }
}

function validateGet<T>(TClass: new () => T): T {
  var fields = Object.keys(TClass.prototype.__validators).join(',');
  var instance = new TClass();
  return Object.assign(instance, this.get(fields));
}
