import "reflect-metadata";
import * as Validator from "validator";

const METADATA_KEY = "validate";

export type RuleValidate = (target: object, key: string) => boolean | string;
export type RuleMessage = string | ((target: object, key: string) => string);
export type RuleParser = (value: any, options: ValidateGetOptions) => any;
export interface ValidateGetOptions {
  filterUnvalidateFields?: boolean;
  parseNumber?: boolean;
  parseArray?: boolean;
  [name: string]: any;
}

const defaultValidateGetOptions: ValidateGetOptions = { filterUnvalidateFields: true, parseArray: true, parseNumber: true };

function intParser(value: any, options: ValidateGetOptions) {
  if (options.parseNumber) {
    return parseInt(value, 10);
  }
  return value;
}

function floatParser(value: any, options: ValidateGetOptions) {
  if (options.parseNumber) { return parseFloat(value); }
  return value;
}

export class Rule {
  private _validate: RuleValidate;
  private _onlyIf: RuleValidate;
  private _message: RuleMessage;
  private _parser: RuleParser = null;

  constructor(
    validate: RuleValidate,
    parser?: RuleParser,
  ) {
    if (typeof validate !== "function") {
      throw new Error("validate must be function type");
    }

    this._validate = validate;
    this._parser = parser;
  }

  // Validate value with current rule, ctx normally is the class instance
  public validate(target: object, key: string): boolean | string {
    const rest = Array.prototype.slice.call(arguments, 2);
    if (this._onlyIf && !this._onlyIf(target, key)) {
      return true;
    }
    const result = this._validate(target, key);
    // 校验失败且自定义错误消息
    if (result !== true && this._message !== undefined) {
      return this.getMessage(target, key);
    }
    return result;
  }
  public message(message: RuleMessage): Rule {
    this._message = message;
    return this;
  }
  public onlyIf(condition: RuleValidate): Rule {
    if (condition && typeof condition !== "function") {
      throw new Error("condition must be function type");
    }
    this._onlyIf = condition;
    return this;
  }
  private getMessage(target: object, key: string): string {
    if (typeof (this._message) === "function") {
      return this._message(target, key);
    }
    return this._message;
  }
}

export class RuleCreator {
  constructor(private isNot: boolean = false) { }

  // check if the string contains the seed.
  public contains(seed: string): Rule {
    return new Rule(
      this.proxyCallValidator("contains", seed),
    ).message(this.proxyGetLocaleMessage("contains", seed));
  }

  // check if the string is a date that's after the specified date (true means after now).
  public after(date?: string): Rule {
    return new Rule(
      this.proxyCallValidator("isAfter", date)
    ).message(
      this.proxyGetLocaleMessage("after", date)
    );
  }

  public alpha(locale?: ValidatorJS.AlphaLocale): Rule {
    return new Rule(
      this.proxyCallValidator("isAlpha", locale)
    ).message(
      this.proxyGetLocaleMessage("alpha", locale),
    );
  }

  public alphanumeric(locale?: ValidatorJS.AlphaLocale): Rule {
    return new Rule(
      this.proxyCallValidator("isAlphanumeric", locale)
    ).message(
      this.proxyGetLocaleMessage("alphanumeric", locale)
    );
  }
  public ascii(): Rule {
    return new Rule(
      this.proxyCallValidator("isAscii")
    ).message(
      this.proxyGetLocaleMessage("ascii")
    );
  }
  public base64(): Rule {
    return new Rule(
      this.proxyCallValidator("isBase64")
    ).message(
      this.proxyGetLocaleMessage("base64")
    );
  }
  public before(date?: string): Rule {
    return new Rule(
      this.proxyCallValidator("isBefore", date)
    ).message(
      this.proxyGetLocaleMessage("before", date)
    );
  }
  public byteLength(options: ValidatorJS.IsByteLengthOptions): Rule;
  public byteLength(min: number, max?: number): Rule;
  public byteLength(min: any, max?: any): Rule {
    return new Rule(
      this.proxyCallValidator("isByteLength", min, max)
    ).message(
      this.proxyGetLocaleMessage("byteLength", min, max)
    );
  }
  public creditCard(): Rule {
    return new Rule(
      this.proxyCallValidator("isCreditCard")
    ).message(
      this.proxyGetLocaleMessage("creditCard")
    );
  }
  public currency(options?: ValidatorJS.IsCurrencyOptions): Rule {
    return new Rule(
      this.proxyCallValidator("isCurrency", options)
    ).message(
      this.proxyGetLocaleMessage("currency", options)
    );
  }
  public dataURI(): Rule {
    return new Rule(
      this.proxyCallValidator("isDataURI")
    ).message(
      this.proxyGetLocaleMessage("dataURI")
    );
  }
  public email(options?: ValidatorJS.IsEmailOptions): Rule {
    return new Rule(
      this.proxyCallValidator("isEmail", options)
    ).message(
      this.proxyGetLocaleMessage("email", options)
    );
  }
  public FQDN(options?: ValidatorJS.IsFQDNOptions): Rule {
    return new Rule(
      this.proxyCallValidator("isFQDN", options)
    ).message(
      this.proxyGetLocaleMessage("FQDN", options)
    );
  }
  public fullWidth(): Rule {
    return new Rule(
      this.proxyCallValidator("isFullWidth")
    ).message(
      this.proxyGetLocaleMessage("fullWidth")
    );
  }
  public halfWidth(): Rule {
    return new Rule(
      this.proxyCallValidator("isHalfWidth")
    ).message(
      this.proxyGetLocaleMessage("halfWidth")
    );
  }
  public hash(algorithm: ValidatorJS.HashAlgorithm): Rule {
    return new Rule(
      this.proxyCallValidator("isHash", algorithm)
    ).message(
      this.proxyGetLocaleMessage("hash", algorithm)
    );
  }
  public hexColor(): Rule {
    return new Rule(
      this.proxyCallValidator("isHexColor")
    ).message(
      this.proxyGetLocaleMessage("hexColor")
    );
  }
  public hexadecimal(): Rule {
    return new Rule(
      this.proxyCallValidator("isHexadecimal")
    ).message(
      this.proxyGetLocaleMessage("hexadecimal")
    );
  }
  public IP(version?: number): Rule {
    return new Rule(
      this.proxyCallValidator("isIP", version)
    ).message(
      this.proxyGetLocaleMessage("IP", version)
    );
  }
  public ISBN(version?: number): Rule {
    return new Rule(
      this.proxyCallValidator("isISBN", version)
    ).message(
      this.proxyGetLocaleMessage("ISBN", version)
    );
  }
  public ISSN(options?: ValidatorJS.IsISSNOptions): Rule {
    return new Rule(
      this.proxyCallValidator("isISSN", options)
    ).message(
      this.proxyGetLocaleMessage("ISSN", options)
    );
  }
  public ISIN(): Rule {
    return new Rule(
      this.proxyCallValidator("isISIN")
    ).message(
      this.proxyGetLocaleMessage("ISIN")
    );
  }
  public ISO8601(): Rule {
    return new Rule(
      this.proxyCallValidator("isISO8601")
    ).message(
      this.proxyGetLocaleMessage("ISO8601")
    );
  }
  public ISO31661Alpha2(): Rule {
    return new Rule(
      this.proxyCallValidator("isISO31661Alpha2")
    ).message(
      this.proxyGetLocaleMessage("ISO31661Alpha2")
    );
  }
  public ISRC(): Rule {
    return new Rule(
      this.proxyCallValidator("isISRC")
    ).message(
      this.proxyGetLocaleMessage("ISRC")
    );
  }
  public JSON(): Rule {
    return new Rule(
      this.proxyCallValidator("isJSON")
    ).message(
      this.proxyGetLocaleMessage("JSON")
    );
  }
  public latLong(): Rule {
    return new Rule(
      this.proxyCallValidator("isLatLong")
    ).message(
      this.proxyGetLocaleMessage("latLong")
    );
  }
  public length(options: ValidatorJS.IsLengthOptions): Rule;
  public length(min: number, max?: number): Rule;
  public length(min: any, max?: any): Rule {
    return new Rule(
      this.proxyCallValidator("isLength", min, max)
    ).message(
      this.proxyGetLocaleMessage("length", min, max)
    );
  }
  public lowercase(): Rule {
    return new Rule(
      this.proxyCallValidator("isLowercase")
    ).message(
      this.proxyGetLocaleMessage("lowercase")
    );
  }
  public MACAddress(): Rule {
    return new Rule(
      this.proxyCallValidator("isMACAddress")
    ).message(
      this.proxyGetLocaleMessage("MACAddress")
    );
  }
  public MD5(): Rule {
    return new Rule(
      this.proxyCallValidator("isMD5")
    ).message(
      this.proxyGetLocaleMessage("MD5")
    );
  }
  public mimeType(): Rule {
    return new Rule(
      this.proxyCallValidator("isMimeType")
    ).message(
      this.proxyGetLocaleMessage("mimeType")
    );
  }
  public mobilePhone(locale: ValidatorJS.MobilePhoneLocale, options?: ValidatorJS.IsMobilePhoneOptions): Rule {
    return new Rule(
      this.proxyCallValidator("isMobilePhone", locale, options)
    ).message(
      this.proxyGetLocaleMessage("mobilePhone", locale, options)
    );
  }
  public mongoId(): Rule {
    return new Rule(
      this.proxyCallValidator("isMongoId")
    ).message(
      this.proxyGetLocaleMessage("mongoId")
    );
  }
  public multibyte(): Rule {
    return new Rule(
      this.proxyCallValidator("isMultibyte")
    ).message(
      this.proxyGetLocaleMessage("multibyte")
    );
  }
  public numeric(options?: ValidatorJS.IsNumericOptions): Rule {
    return new Rule(
      this.proxyCallValidator("isNumeric", options)
    ).message(
      this.proxyGetLocaleMessage("numeric", options)
    );
  }
  public postalCode(locale: ValidatorJS.PostalCodeLocale): Rule {
    return new Rule(
      this.proxyCallValidator("isPostalCode", locale)
    ).message(
      this.proxyGetLocaleMessage("postalCode", locale)
    );
  }
  public surrogatePair(): Rule {
    return new Rule(
      this.proxyCallValidator("isSurrogatePair")
    ).message(
      this.proxyGetLocaleMessage("surrogatePair")
    );
  }
  public URL(options?: ValidatorJS.IsURLOptions): Rule {
    return new Rule(
      this.proxyCallValidator("isURL", options)
    ).message(
      this.proxyGetLocaleMessage("URL", options)
    );
  }
  public UUID(version?: 3 | 4 | 5 | "3" | "4" | "5" | "all"): Rule {
    return new Rule(
      this.proxyCallValidator("isUUID", version)
    ).message(
      this.proxyGetLocaleMessage("UUID", version)
    );
  }
  public uppercase(): Rule {
    return new Rule(
      this.proxyCallValidator("isUppercase")
    ).message(
      this.proxyGetLocaleMessage("uppercase")
    );
  }
  public variableWidth(): Rule {
    return new Rule(
      this.proxyCallValidator("isVariableWidth")
    ).message(
      this.proxyGetLocaleMessage("variableWidth")
    );
  }
  public whitelisted(chars: string | string[]): Rule {
    return new Rule(
      this.proxyCallValidator("isWhitelisted", chars)
    ).message(
      this.proxyGetLocaleMessage("whitelisted", chars)
    );
  }
  public matches(pattern: string | RegExp, modifiers?: string): Rule {
    return new Rule(
      this.proxyCallValidator("matches", pattern, modifiers)
    ).message(
      this.proxyGetLocaleMessage("matches", pattern, modifiers)
    );
  }

  // check if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.
  public decimal(options?: ValidatorJS.IsDecimalOptions): Rule {
    return new Rule(
      this.proxyCallValidator("isDecimal", options),
      floatParser
    ).message(
      this.proxyGetLocaleMessage("decimal", options)
    );
  }

  // check if the string is a number that's divisible by another.
  public divisibleBy(number: number): Rule {
    return new Rule(
      this.proxyCallValidator("isDivisibleBy", number),
      floatParser
    ).message(
      this.proxyGetLocaleMessage("divisibleBy", number)
    );
  }

  // check if the string is a float.
  public float(options?: ValidatorJS.IsFloatOptions): Rule {
    return new Rule(
      this.proxyCallValidator("isFloat", options),
      floatParser
    ).message(
      this.proxyGetLocaleMessage("float", options)
    );
  }

  // check if the string is an integer.
  public int(options?: ValidatorJS.IsIntOptions): Rule {
    return new Rule(
      this.proxyCallValidator("isInt", options),
      intParser
    ).message(
      this.proxyGetLocaleMessage("int", options)
    );
  }

  // check if the string is a valid port number.
  public port(): Rule {
    return new Rule(
      this.proxyCallValidator("isPort")
    ).message(
      this.proxyGetLocaleMessage("port")
    );
  }

  // check if the string matches the comparison.
  public equals(comparison: any): Rule {
    return new Rule(
      this.proxyCallValidator("equals", comparison)
    ).message(
      this.proxyGetLocaleMessage("equals", comparison)
    );
  }

  // ===
  public tripleEquals(comparison: any): Rule {
    return new Rule(
      this.proxyCall((target, key) => target[key] === comparison)
    ).message(
      this.proxyGetLocaleMessage("tripleEquals", comparison)
    );
  }

  // ==
  public doubleEquals(comparison: any): Rule {
    return new Rule(
      this.proxyCall((target, key) => target[key] == comparison)
    ).message(
      this.proxyGetLocaleMessage("doubleEquals", comparison)
    );
  }

  // check if the string has a length of zero or undefined.
  public empty(): Rule {
    return new Rule(
      this.proxyCallValidator("isEmpty")
    ).message(
      this.proxyGetLocaleMessage("empty")
    );
  }

  // check if value is not undefined
  public required(): Rule {
    return new Rule(
      this.proxyCall((target, key) => (target[key] !== undefined && target[key] !== null))
    ).message(
      this.proxyGetLocaleMessage("required")
    );
  }

  // check if the string is in a array of allowed values.
  public in(values: any[]): Rule {
    return new Rule(
      this.proxyCallValidator("isIn", values)
    ).message(
      this.proxyGetLocaleMessage("in", values)
    );
  }
  public func(f: (target: any, key: string) => boolean | string): Rule {
    return new Rule(
      this.proxyCall((target, key) => f(target, key))
    ).message(
      this.proxyGetLocaleMessage("func")
    );
  }
  public class(TClass: new () => any): Rule {
    return new Rule(
      this.proxyCall((target, key, ...rest: any[]) => (isClass as any)(TClass, target[key], ...rest)),
      (value: any, options: ValidateGetOptions) => validateGet(TClass, value, options).instance,
    ).message(
      this.proxyGetLocaleMessage("class", TClass)
    );
  }
  private proxyCallValidator = (validatorMethod: keyof ValidatorJS.ValidatorStatic, ...rest: any[]) => {
    const isNot = this.isNot;
    return function(target: object, key: string) {
      let v = target[key];
      if (v === undefined || v === null) {
        return true;
      }

      if (typeof (v) === "number") { v = v.toString(); }
      if (typeof (v) === "string") {
        const r = (Validator[validatorMethod] as any)(v, ...rest);
        return (isNot ? !r : r);
      }
      return false;
    };
  }

  private proxyCall = (f: (target: object, key: string) => boolean | string) => {
    const isNot = this.isNot;
    return function(target: object, key: string) {
      const r = f(target, key);
      return (isNot ? !r : r);
    };
  }

  private proxyGetLocaleMessage = (method: string, ...rest: any[]) => {
    const isNot = this.isNot;
    return function(target: object, key: string) {
      return LocaleErrorMessages[method][isNot ? "not" : "is"](target, key, rest);
    };
  }
}

const LocaleErrorMessages = {
  contains: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} contains ${rest.join(", ")}`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} not contains ${rest.join(", ")}`,
  },
  after: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} date is after date ${rest.join(", ")}`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} date is not after date ${rest.join(", ")}`,
  },
  alpha: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is alpha`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not alpha`,
  },
  alphanumeric: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is alphanumeric`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not alphanumeric`,
  },
  ascii: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is ascii`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not ascii`,
  },
  base64: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is base64`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not base64`,
  },
  before: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} date is before date ${rest.join(", ")}`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} date is before date ${rest.join(", ")}`,
  },
  byteLength: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} byte length is ${rest.join(" ")}`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} byte length is ${rest.join(" ")}`,
  },
  creditCard: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is credit card`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not credit card`,
  },
  currency: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is currency`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not currency`,
  },
  dataURI: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is date URI`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not date URI`,
  },
  email: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is email`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not email`,
  },
  FQDN: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is FQDN`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not FQDN`,
  },
  fullWidth: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is full width`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not full width`,
  },
  halfWidth: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is half width`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not half width`,
  },
  hash: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is hash`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not hash`,
  },
  hexColor: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is hex color`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not hex color`,
  },
  hexadecimal: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is hex decimal`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not hex decimal`,
  },
  IP: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is IP`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not IP`,
  },
  ISBN: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is ISBN`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not ISBN`,
  },
  ISSN: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is ISSN`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not ISSN`,
  },
  ISIN: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is ISIN`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not ISIN`,
  },
  ISO8601: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is ISO8601`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not ISO8601`,
  },
  ISO31661Alpha2: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is after ISO31661Alpha2`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is after not ISO31661Alpha2`,
  },
  ISRC: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is after ${rest.join(", ")}`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is after ${rest.join(", ")}`,
  },
  JSON: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is JSON`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not JSON`,
  },
  latLong: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is latLong`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not latLong`,
  },
  length: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is lenght of ${rest.join(", ")}`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not lenght of ${rest.join(", ")}`,
  },
  lowercase: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is lowercase`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not lowercase`,
  },
  MACAddress: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is MAC address`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not MAC address`,
  },
  MD5: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is MD5`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not MD5`,
  },
  mimeType: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is minetype`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not minetype`,
  },
  mobilePhone: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is mobile phone`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not mobile phone`,
  },
  mongoId: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is mongoId`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not mongoId`,
  },
  multibyte: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is multi-byte`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not multi-byte`,
  },
  numeric: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is numeric`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not numeric`,
  },
  postalCode: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is postal code`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not postal code`,
  },
  surrogatePair: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is surrogate pair`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not surrogate pair`,
  },
  URL: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is URL`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not URL`,
  },
  UUID: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is UUID`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not UUID`,
  },
  uppercase: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is uppercase`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not uppercase`,
  },
  variableWidth: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is variable width`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not variable width`,
  },
  whitelisted: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} characters is white listed (${rest.join("")})`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} characters is white listed (${rest.join("")})`,
  },
  matches: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} matches ${rest.join("")}`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} not matches ${rest.join("")}`,
  },
  decimal: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is decimal`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not decimal`,
  },
  divisibleBy: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is divisible by ${rest[0]}`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not divisible by ${rest[0]}`,
  },
  float: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is float`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not float`,
  },
  int: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is int`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not int`,
  },
  port: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is port`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not port`,
  },
  equals: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} equals ${rest[0]}`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} not equals ${rest[0]}`,
  },
  doubleEquals: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} == ${rest[0]}`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} != ${rest[0]}`,
  },
  tripleEquals: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} === ${rest[0]}`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} !== ${rest[0]}`,
  },
  empty: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is empty`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not empty`,
  },
  required: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is required`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not required`,
  },
  in: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is in [${rest.join(", ")}]`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not in [${rest.join(", ")}]`,
  },
  func: {
    is: (target: object, key: string, ...rest: any[]) => `${target[key]} is func()`,
    not: (target: object, key: string, ...rest: any[]) => `${target[key]} is not func()`,
  },
  class: {
    is: (target: object, key: string, ...rest: any[]) => `${key} is type of ${rest[0].toString()}`,
    not: (target: object, key: string, ...rest: any[]) => `${key} is not type of ${rest[0].toString()}`,
  },
};

export function setErrorMessage(setting: any) {
  (Object as any).assign(LocaleErrorMessages, setting);
}

export function mixins(...args: any[]) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    args.forEach((baseCtor) => {
      // copy property methods and values
      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
        if (name === "__validateFields") {
          return constructor.prototype[name] = (constructor.prototype[name] || []).concat(baseCtor.prototype[name]);
        }
        constructor.prototype[name] = baseCtor.prototype[name];
      });
      // copy decorators
      (baseCtor.prototype.__validateFields || []).forEach((name: string) => {
        const m = Reflect.getMetadata(METADATA_KEY, baseCtor.prototype, name);
        if (m) {
          Reflect.metadata(METADATA_KEY, m)(constructor.prototype, name);
        }
      });
    });
  };

}

export function getRules<T>(TClass: new () => T): { [name: string]: Rule[] } {
  const rules = {};
  let proto = TClass.prototype;
  while (proto) {
    if (proto.__validateFields) {
      for (const key of proto.__validateFields) {
        rules[key] = Reflect.getMetadata(METADATA_KEY, proto, key);
      }
    }
    proto = proto.__proto__;
  }
  return rules;
}

export function validate(...rules: Rule[]) {
  return function(target: any, key: string | symbol) {
    // must ensure each class prototype has its own __validateFields instance;
    if (!target.__validateFields || (target.__proto__ && target.__proto__.__validateFields === target.__validateFields)) {
      target.__validateFields = [];
    }
    target.__validateFields.push(key);
    return Reflect.metadata(METADATA_KEY, rules)(target, key);
  };
}

export function and(...rules: Rule[]): Rule {
  if (rules.length === 0) { throw new Error("and must accept at lease one rule"); }
  if (rules.length === 1) { return rules[0]; }
  return new Rule(
    function(target, key) {
      for (const r of rules) {
        const result = r.validate(target, key);
        if (result !== true) {
          if (this._message !== undefined) { return this.getMessage(target, key); }
          return result;
        }
      }
      return true;
    },
    (value, options) => {
      for (const rule of rules) {
        const parser = (rule as any)._parser;
        if (parser) {
          value = parser(value, options);
        }
      }
      return value;
    });
}
export function or(...rules: Rule[]): Rule {
  if (rules.length === 0) { throw new Error("or must accept at lease one rule"); }
  if (rules.length === 1) { return rules[0]; }
  return new Rule(
    function(target, key) {
      const messages = [];
      for (const r of rules) {
        const eachResult = r.validate(target, key);
        if (eachResult === true) { return true; }
        messages.push(eachResult);
      }
      if (this._message !== undefined) {
        return this.getMessage(target, key);
      }
      return messages.join(" or ");
    },
    (value, options) => {
      for (const rule of rules) {
        const parser = (rule as any)._parser;
        if (rule.validate({ value }, 'value') === true) {
          if (parser) {
            return parser(value, options);
          }
          return value;
        }
      }
      return value;
    }
  );
}
function arrayParser(value: any, options: ValidateGetOptions): any[] {
  if (options.parseArray && !Array.isArray(value)) {
    if (typeof (value) === "string") {
      return value.split(",");
    }
    return [value];
  }
  return value;
}
export function each(...rules: Rule[]): Rule {
  const rule = and(...rules);
  function validateEach(target: object, key: string) {
    let value = target[key];

    value = arrayParser(value, { parseArray: true });
    if (!Array.isArray(value)) {
      return `target.${key} is not array`;
    }
    for (const v in value) {
      if (value.hasOwnProperty(v)) {
        const result = rule.validate(value, v);
        if (result !== true) {
          if (this._message !== undefined) {
            return this.getMessage(value, v);
          }
          return result;
        }
      }
    }
    return true;
  }
  return new Rule(
    validateEach,
    (value, options) => {
      value = arrayParser(value, options);
      if (options.parseArray) {
        for (let i = 0; i < value.length; i++) {
          for (const rule of rules) {
            const parser = (rule as any)._parser;
            if (parser) {
              value[i] = parser(value[i], options);
            }
          }
        }
      }
      return value;
    },
  );
}

export function isClass(TClass: new () => any, target: object): boolean | string {
  const keyRules = getRules(TClass);
  for (const key in keyRules) {
    if (keyRules.hasOwnProperty(key)) {
      for (let rule of keyRules[key]) {
        if (Array.isArray(rule)) {
          rule = and(rule);
        }
        const each = rule.validate(target, key);
        if (each !== true) {
          return each;
        }
      }
    }
  }
  return true;
}

export function validateGet<T>(
  TClass: new () => T, target: object,
  options?: ValidateGetOptions): { instance?: T, message?: string | boolean } {
  options = (Object as any).assign({}, defaultValidateGetOptions, options);
  const keyRules = getRules(TClass);
  const instance = new TClass();
  for (const key in keyRules) {
    if (keyRules.hasOwnProperty(key)) {
      let value = target[key];
      for (let rule of keyRules[key]) {
        if (Array.isArray(rule)) {
          rule = and(rule);
        }
        const each = rule.validate(target, key);
        if (each !== true) {
          return { message: each };
        }
        // if there is a parser
        const parser = (rule as any)._parser;
        if (parser) {
          value = parser(value, options);
        }
      }

      (Object as any).assign(instance, { [key]: value });
    }
  }
  if (!options.filterUnvalidateFields) {
    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        if (!keyRules[key]) {
          (instance as any)[key] = target[key];
        }
      }
    }
  }
  return { instance };
}

export declare var is: RuleCreator;
export declare var not: RuleCreator;
is = new RuleCreator(false);
not = new RuleCreator(true);
