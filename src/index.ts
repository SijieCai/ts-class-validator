import 'reflect-metadata';
import * as Validator from 'validator';

const METADATA_KEY = 'validate';

type RuleValidate = (target: object, key: string) => boolean | string;
type RuleMessage = string | ((target: object, key: string) => string);

class Rule {
  private _validate: RuleValidate;
  private _onlyIf: RuleValidate;
  private _message: RuleMessage;
  constructor(
    validate: RuleValidate,
    message?: RuleMessage,
    condition?: RuleValidate
  ) {
    if (typeof validate !== 'function') {
      throw new Error('validate must be function type')
    }

    if (condition && typeof condition !== 'function') {
      throw new Error('condition must be function type')
    }
    this._validate = validate;
    this._message = message;
    this._onlyIf = condition;
  }

  // Validate value with current rule, ctx normally is the class instance
  validate(target: object, key: string): boolean | string {
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
  private getMessage(target: object, key: string): string {
    if (typeof (this._message) === 'function') {
      return this._message(target, key);
    }
    return this._message;
  }
  // copy a new Rule with specified message
  message(message: RuleMessage): Rule {
    return new Rule(this._validate, message, this._onlyIf);
  }
  // copy a new Rule with specified onlyIf condition
  onlyIf(condition: RuleValidate): Rule {
    return new Rule(this._validate, this._message, condition)
  }
}

class RuleCreator {
  isNot: boolean;
  private proxyCallValidator(validatorMethod: keyof ValidatorJS.ValidatorStatic, ...rest: any[]) {
    let isNot = this.isNot;
    return function (target: object, key: string) {
      let v = (Validator[validatorMethod] as any)(target[key], ...rest);
      return isNot ? !v : v;
    }
  }

  private proxyGetLocaleMessage(method: string, ...rest: any[]) {
    let isNot = this.isNot;
    return function (target: object, key: string) {
      return LocaleMessages[method][isNot ? 'not' : 'is'](target, key, rest);
    }
  }

  // check if the string contains the seed.
  contains(seed: string): Rule {
    return new Rule(
      this.proxyCallValidator('contains', seed),
      this.proxyGetLocaleMessage('contains', seed)
    );
  }

  // check if the string is a date that's after the specified date (true means after now).
  after(date?: string): Rule {
    return new Rule(
      this.proxyCallValidator('isAfter', date),
      this.proxyGetLocaleMessage('after', date)
    );
  }

  alpha(locale?: ValidatorJS.AlphaLocale): Rule {
    return new Rule(
      this.proxyCallValidator('isAlpha', locale),
      this.proxyGetLocaleMessage('alpha', locale)
    );
  }

  alphanumeric(locale?: ValidatorJS.AlphaLocale): Rule {
    return new Rule(
      this.proxyCallValidator('isAlphanumeric', locale),
      this.proxyGetLocaleMessage('alphanumeric', locale)
    );
  }
  ascii(): Rule {
    return new Rule(
      this.proxyCallValidator('isAscii'),
      this.proxyGetLocaleMessage('ascii')
    );
  }
  base64(): Rule {
    return new Rule(
      this.proxyCallValidator('isBase64'),
      this.proxyGetLocaleMessage('base64')
    );
  }
  before(date?: string): Rule {
    return new Rule(
      this.proxyCallValidator('isBefore', date),
      this.proxyGetLocaleMessage('before', date)
    );
  }
  byteLength(options: ValidatorJS.IsByteLengthOptions): Rule;
  byteLength(min: number, max?: number): Rule;
  byteLength(min: any, max?: any): Rule {
    return new Rule(
      this.proxyCallValidator('isByteLength', min, max),
      this.proxyGetLocaleMessage('byteLength', min, max)
    );
  }
  creditCard(): Rule {
    return new Rule(
      this.proxyCallValidator('isCreditCard'),
      this.proxyGetLocaleMessage('creditCard')
    );
  }
  currency(options?: ValidatorJS.IsCurrencyOptions): Rule {
    return new Rule(
      this.proxyCallValidator('isCurrency', options),
      this.proxyGetLocaleMessage('currency', options)
    );
  }
  dataURI(): Rule {
    return new Rule(
      this.proxyCallValidator('isDataURI'),
      this.proxyGetLocaleMessage('dataURI')
    );
  }
  email(options?: ValidatorJS.IsEmailOptions): Rule {
    return new Rule(
      this.proxyCallValidator('isEmail', options),
      this.proxyGetLocaleMessage('email', options)
    );
  }
  FQDN(options?: ValidatorJS.IsFQDNOptions): Rule {
    return new Rule(
      this.proxyCallValidator('isFQDN', options),
      this.proxyGetLocaleMessage('FQDN', options)
    );
  }
  fullWidth(): Rule {
    return new Rule(
      this.proxyCallValidator('isFullWidth'),
      this.proxyGetLocaleMessage('fullWidth')
    );
  }
  halfWidth(): Rule {
    return new Rule(
      this.proxyCallValidator('isHalfWidth'),
      this.proxyGetLocaleMessage('halfWidth')
    );
  }
  hash(algorithm: ValidatorJS.HashAlgorithm): Rule {
    return new Rule(
      this.proxyCallValidator('isHash', algorithm),
      this.proxyGetLocaleMessage('hash', algorithm)
    );
  }
  hexColor(): Rule {
    return new Rule(
      this.proxyCallValidator('isHexColor'),
      this.proxyGetLocaleMessage('hexColor')
    );
  }
  hexadecimal(): Rule {
    return new Rule(
      this.proxyCallValidator('isHexadecimal'),
      this.proxyGetLocaleMessage('hexadecimal')
    );
  }
  IP(version?: number): Rule {
    return new Rule(
      this.proxyCallValidator('isIP', version),
      this.proxyGetLocaleMessage('IP', version)
    );
  }
  ISBN(version?: number): Rule {
    return new Rule(
      this.proxyCallValidator('isISBN', version),
      this.proxyGetLocaleMessage('ISBN', version)
    );
  }
  ISSN(options?: ValidatorJS.IsISSNOptions): Rule {
    return new Rule(
      this.proxyCallValidator('isISSN', options),
      this.proxyGetLocaleMessage('ISSN', options)
    );
  }
  ISIN(): Rule {
    return new Rule(
      this.proxyCallValidator('isISIN'),
      this.proxyGetLocaleMessage('ISIN')
    );
  }
  ISO8601(): Rule {
    return new Rule(
      this.proxyCallValidator('isISO8601'),
      this.proxyGetLocaleMessage('ISO8601')
    );
  }
  ISO31661Alpha2(): Rule {
    return new Rule(
      this.proxyCallValidator('isISO31661Alpha2'),
      this.proxyGetLocaleMessage('ISO31661Alpha2')
    );
  }
  ISRC(): Rule {
    return new Rule(
      this.proxyCallValidator('isISRC'),
      this.proxyGetLocaleMessage('ISRC')
    );
  }
  JSON(): Rule {
    return new Rule(
      this.proxyCallValidator('isJSON'),
      this.proxyGetLocaleMessage('JSON')
    );
  }
  latLong(): Rule {
    return new Rule(
      this.proxyCallValidator('isLatLong'),
      this.proxyGetLocaleMessage('latLong')
    );
  }
  length(options: ValidatorJS.IsLengthOptions): Rule;
  length(min: number, max?: number): Rule;
  length(min: any, max?: any): Rule {
    return new Rule(
      this.proxyCallValidator('isLength', min, max),
      this.proxyGetLocaleMessage('length', min, max)
    );
  }
  lowercase(): Rule {
    return new Rule(
      this.proxyCallValidator('isLowercase'),
      this.proxyGetLocaleMessage('lowercase')
    );
  }
  MACAddress(): Rule {
    return new Rule(
      this.proxyCallValidator('isMACAddress'),
      this.proxyGetLocaleMessage('MACAddress')
    );
  }
  MD5(): Rule {
    return new Rule(
      this.proxyCallValidator('isMD5'),
      this.proxyGetLocaleMessage('MD5')
    );
  }
  mimeType(): Rule {
    return new Rule(
      this.proxyCallValidator('isMimeType'),
      this.proxyGetLocaleMessage('mimeType')
    );
  }
  mobilePhone(locale: ValidatorJS.MobilePhoneLocale, options?: ValidatorJS.IsMobilePhoneOptions): Rule {
    return new Rule(
      this.proxyCallValidator('isMobilePhone', locale, options),
      this.proxyGetLocaleMessage('mobilePhone', locale, options)
    );
  }
  mongoId(): Rule {
    return new Rule(
      this.proxyCallValidator('isMongoId'),
      this.proxyGetLocaleMessage('mongoId')
    );
  }
  multibyte(): Rule {
    return new Rule(
      this.proxyCallValidator('isMultibyte'),
      this.proxyGetLocaleMessage('multibyte')
    );
  }
  numeric(options?: ValidatorJS.IsNumericOptions): Rule {
    return new Rule(
      this.proxyCallValidator('isNumeric', options),
      this.proxyGetLocaleMessage('numeric', options)
    );
  }
  postalCode(locale: ValidatorJS.PostalCodeLocale): Rule {
    return new Rule(
      this.proxyCallValidator('isPostalCode', locale),
      this.proxyGetLocaleMessage('postalCode', locale)
    );
  }
  surrogatePair(): Rule {
    return new Rule(
      this.proxyCallValidator('isSurrogatePair'),
      this.proxyGetLocaleMessage('surrogatePair')
    );
  }
  URL(options?: ValidatorJS.IsURLOptions): Rule {
    return new Rule(
      this.proxyCallValidator('isURL', options),
      this.proxyGetLocaleMessage('URL', options)
    );
  }
  UUID(version?: 3 | 4 | 5 | "3" | "4" | "5" | "all"): Rule {
    return new Rule(
      this.proxyCallValidator('isUUID', version),
      this.proxyGetLocaleMessage('UUID', version)
    );
  }
  uppercase(): Rule {
    return new Rule(
      this.proxyCallValidator('isUppercase'),
      this.proxyGetLocaleMessage('uppercase')
    );
  }
  variableWidth(): Rule {
    return new Rule(
      this.proxyCallValidator('isVariableWidth'),
      this.proxyGetLocaleMessage('variableWidth')
    );
  }
  whitelisted(chars: string | string[]): Rule {
    return new Rule(
      this.proxyCallValidator('isWhitelisted', chars),
      this.proxyGetLocaleMessage('whitelisted', chars)
    );
  }
  matches(pattern: string | RegExp, modifiers?: string): Rule {
    return new Rule(
      this.proxyCallValidator('matches', pattern, modifiers),
      this.proxyGetLocaleMessage('matches', pattern, modifiers)
    );
  }

  // check if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.
  decimal(options?: ValidatorJS.IsDecimalOptions): Rule {
    return new Rule(
      this.proxyCallValidator('isDecimal', options),
      this.proxyGetLocaleMessage('decimal', options)
    );
  }

  // check if the string is a number that's divisible by another.
  divisibleBy(number: number): Rule {
    return new Rule(
      this.proxyCallValidator('isDivisibleBy', number),
      this.proxyGetLocaleMessage('divisibleBy', number)
    );
  }


  // check if the string is a float.
  float(options?: ValidatorJS.IsFloatOptions): Rule {
    return new Rule(
      this.proxyCallValidator('isFloat', options),
      this.proxyGetLocaleMessage('float', options)
    );
  }

  // check if the string is an integer.
  int(options?: ValidatorJS.IsIntOptions): Rule {
    return new Rule(
      this.proxyCallValidator('isInt', options),
      this.proxyGetLocaleMessage('int', options)
    );
  }

  // check if the string is a valid port number.
  port(): Rule {
    return new Rule(
      this.proxyCallValidator('isPort'),
      this.proxyGetLocaleMessage('port')
    );
  }

  // check if the string matches the comparison.
  equals(comparison: any): Rule {
    return new Rule(
      this.proxyCallValidator('equals', comparison),
      this.proxyGetLocaleMessage('equals', comparison)
    );
  }

  // check if the string has a length of zero or undefined.
  empty(): Rule {
    return new Rule(
      this.proxyCallValidator('isEmpty'),
      this.proxyGetLocaleMessage('empty')
    );
  }

  // check if value is not undefined
  required(): Rule {
    return new Rule(
      (target, key) => target[key] !== undefined,
      this.proxyGetLocaleMessage('required')
    );
  }

  // check if the string is in a array of allowed values.
  in(values: any[]): Rule {
    return new Rule(
      this.proxyCallValidator('isIn', values),
      this.proxyGetLocaleMessage('in', values)
    );
  }
  func(f: (target: any, key: string) => boolean): Rule {
    return new Rule(
      (target, key) => f(target, key),
      this.proxyGetLocaleMessage('func')
    );
  }
  type(TClass: new () => any, fieldsPattern?: string): Rule {
    return new Rule(
      (target, key) => isClass(target[key], TClass, fieldsPattern),
      this.proxyGetLocaleMessage('type', TClass)
    );
  }
}

class LocaleMessages {
  contains: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  after: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  alpha: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  alphanumeric: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  ascii: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  base64: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  before: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  byteLength: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  creditCard: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  currency: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  dataURI: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  email: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  FQDN: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  fullWidth: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  halfWidth: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  hash: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  hexColor: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  hexadecimal: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  IP: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  ISBN: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  ISSN: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  ISIN: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  ISO8601: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  ISO31661Alpha2: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  ISRC: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  JSON: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  latLong: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  length: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  lowercase: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  MACAddress: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  MD5: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  mimeType: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  mobilePhone: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  mongoId: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  multibyte: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  numeric: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  postalCode: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  surrogatePair: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  URL: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  UUID: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  uppercase: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  variableWidth: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  whitelisted: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  matches: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  decimal: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  divisibleBy: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  float: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  int: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  port: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  equals: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  empty: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  required: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  in: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  func: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
  type: {
    is: (target: object, key: string, ...rest: any[]) => ``,
    not: (target: object, key: string, ...rest: any[]) => ``
  }
}

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
        var m = Reflect.getMetadata(METADATA_KEY, baseCtor.prototype, name)
        if (m) {
          Reflect.metadata(METADATA_KEY, m)(constructor.prototype, name);
        }
      })
    });
  }

}

export function getRules<T>(TClass: new () => T): { [name: string]: Array<Rule> } {
  const rules = {};
  TClass.prototype.__validators.forEach((key: string) => {
    rules[key] = Reflect.getMetadata(METADATA_KEY, TClass.prototype, key);
  })
  return rules;
}

function validateGet<T>(TClass: new () => T): T {
  var fields = Object.keys(TClass.prototype.__validators).join(',');
  var instance = new TClass();
  return Object.assign(instance, this.get(fields));
}

export function and(...rules: Array<Rule>): Rule {
  if (rules.length === 0) throw new Error('and must accept at lease one rule');
  if (rules.length === 1) return rules[0];
  return new Rule(function (target, key) {
    for (let r of rules) {
      let result = r.validate(target, key);
      if (result !== true) {
        if (this._message !== undefined) return this.getMessage(target, key);
        return result;
      }
    }
    return true;
  });
}
export function or(...rules: Array<Rule>): Rule {
  if (rules.length === 0) throw new Error('or must accept at lease one rule');
  if (rules.length === 1) return rules[0];
  return new Rule(function (target, key) {
    let messages = [];
    for (let r of rules) {
      let eachResult = r.validate(target, key);
      if (eachResult === true) return true;
      messages.push(eachResult);
    }
    if (this._message !== undefined) {
      return this.getMessage(target, key);
    }
    return messages.join(' 或者 ');
  });
}

export function each(...rules: Array<Rule>): Rule {
  let rule = and(...rules);
  return new Rule(function (target, key) {
    let value = target[key] as Array<any>;
    if (!Array.isArray(value)) {
      return `target.${key} is not array`;
    }
    for (let v in value) {
      let result = rule.validate(value, v);
      if (result !== true) {
        if (this._message !== undefined) {
          return this.getMessage(value, v);
        }
        return result;
      }
    }
    return true;
  });
}

export function isClass(target: any, TClass: new () => any, fieldsPattern?: string): boolean | string {
  const keyRules = getRules(TClass);
  for (let key in keyRules) {
    for (let rule of keyRules[key]) {
      if (Array.isArray(rule)) {
        rule = and(rule);
      }
      let each = rule.validate(target, key);
      if (each !== true) {
        return each;
      }
    }
  }
  return true;
}

export function validate(...rules: Array<Rule>) {
  return function (target: any, key: string | symbol) {
    target.__validators = target.__validators || [];
    target.__validators.push(key);
    return Reflect.metadata(METADATA_KEY, rules)(target, key);
  }
}

export declare var is: IS;
export declare var not: IS
is = new IS();
not = new IS();

