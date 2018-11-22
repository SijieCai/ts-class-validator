
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