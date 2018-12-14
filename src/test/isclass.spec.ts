import { and, each, is, isClass, mixins, not, or, validate } from "../index";

class IdClass {
  @validate(each(
    is.int(),
    not.in([3]),
    is.required(),
  ))
  public id: number[];
}

class Id2Class {
  @validate(each(
    each(is.int(), is.required(), not.doubleEquals(2)),
  ))
  public id: number[][];
}

class NameClass {
  @validate(is.length(4, 10), is.contains("360"))
  public name: string;
}

class NestedClass {
  @validate(is.class(IdClass))
  public id: IdClass;
}

class DeeplyNestedClass {
  @validate(is.class(NestedClass))
  public value: NestedClass;
}

class AndOrClass {
  @validate(or(
    is.in([1, 2, 3]),
    and(
      is.in([4, 5, 6]),
      is.divisibleBy(2),
    ),
  ))
  public value: number;
}

class OnlyIfClass {
  @validate(is.in([1, 2, 3]).onlyIf((target) => (target as any).value2 !== undefined))
  public status: number;
  @validate(is.int())
  public value2: number;
}

class CustomizeMessageClass {
  @validate(
    is.required().message("field is required!!"),
    is.equals("some value").message("field must equals to some vlaue!!"),
    or(
      is.in([1, 2]),
      is.equals(3),
    ).message("field must be 1,2 or 3, just kidding LOL."),
  )
  public field: string;
}

// 组合复用
@mixins(IdClass, NameClass)
class MixinClass implements IdClass, NameClass {
  public name: string;
  public id: number[];
  @validate(
    is.int(),
    is.required(),
  )
  public numberValue: number;
}

class ValidateIsClass {
  @validate(is.after())
  public after: string;

  @validate(is.alpha())
  public alpha: string;

  @validate(is.alphanumeric())
  public alphanumeric: string;

  @validate(is.ascii())
  public ascii: string;

  @validate(is.base64())
  public base64: string;

  @validate(is.before())
  public before: string;

  @validate(is.byteLength(4, 12))
  public byteLength: string;

  @validate(is.creditCard())
  public creditCard: string;

  @validate(is.currency({
    symbol: '$',
    require_symbol: true,
    allow_space_after_symbol: false,
  }))
  public currency: string;

  @validate(is.dataURI())
  public dataURI: string;

  @validate(is.email())
  public email: string;

  @validate(is.FQDN())
  public FQDN: string;

  @validate(is.fullWidth())
  public fullWidth: string;

  @validate(is.halfWidth())
  public halfWidth: string;

  @validate(
    is.hash('md5'),
    or(
      is.hash('sha256')
    )
  )
  public hash: string;

  @validate(is.hexColor())
  public hexColor: string;

  @validate(is.hexadecimal())
  public hexadecimal: string;

  @validate(is.IP())
  public IP: string;

  @validate(is.ISBN())
  public ISBN: string;

  @validate(is.ISSN())
  public ISSN: string;

  @validate(is.ISIN())
  public ISIN: string;

  @validate(is.ISO8601())
  public ISO8601: string;

  @validate(is.ISO31661Alpha2())
  public ISO31661Alpha2: string;

  @validate(is.ISRC())
  public ISRC: string;

  @validate(is.JSON())
  public JSON: string;

  @validate(is.latLong())
  public latLong: string;

  @validate(is.length(2, 4))
  public length: string;

  @validate(is.lowercase())
  public lowercase: string;

  @validate(is.MACAddress())
  public MACAddress: string;

  @validate(is.MD5())
  public MD5: string;

  @validate(is.mimeType())
  public mimeType: string;

  @validate(is.mobilePhone("zh-CN"))
  public mobilePhone: string;

  @validate(is.mongoId())
  public mongoId: string;

  @validate(is.port())
  public port: string;

}

// 不支持继承复用

test("each", () => {
  expect(isClass(IdClass, { id: [111] })).toBe(true);
  expect(isClass(IdClass, { id: [111, 3] })).not.toBe(true);
});

test("is string", () => {
  expect(isClass(NameClass, { name: "360sdfsdf" })).toBe(true);
  expect(isClass(NameClass, { name: "360" })).not.toBe(true);
  expect(isClass(NameClass, { name: "13602545698" })).not.toBe(true);
  expect(isClass(NameClass, { name: "sdfsdfs" })).not.toBe(true);
});

test("is after", () => {
  expect(isClass(ValidateIsClass, { after: "2099-12-10 11:11:10" })).toBe(true);
  expect(isClass(ValidateIsClass, { after: "2011-12-10 11:11:10" })).not.toBe(true);
});

test("is alpha", () => {
  expect(isClass(ValidateIsClass, { alpha: "abcd" })).toBe(true);
  expect(isClass(ValidateIsClass, { alpha: "ab-cd" })).not.toBe(true);
  expect(isClass(ValidateIsClass, { alpha: "abcd123" })).not.toBe(true);
});

test("is alphanumeric", () => {
  expect(isClass(ValidateIsClass, { alphanumeric: "abcd" })).toBe(true);
  expect(isClass(ValidateIsClass, { alphanumeric: "1234" })).toBe(true);
  expect(isClass(ValidateIsClass, { alphanumeric: "abcd123" })).toBe(true);
  expect(isClass(ValidateIsClass, { alphanumeric: "abcd-123" })).not.toBe(true);
});

test("is ascii", () => {
  expect(isClass(ValidateIsClass, { ascii: "74" })).toBe(true);
  expect(isClass(ValidateIsClass, { ascii: "u4f60u597d" })).toBe(true);
  expect(isClass(ValidateIsClass, { ascii: "\u4f60\u597d" })).not.toBe(true);
});

test("is base64", () => {
  expect(isClass(ValidateIsClass, { base64: "i am not base64" })).not.toBe(true);
});

test("is before", () => {
  expect(isClass(ValidateIsClass, { before: "2011-12-10 11:11:10" })).toBe(true);
  expect(isClass(ValidateIsClass, { before: "2099-12-10 11:11:10" })).not.toBe(true);
});

test("byteLength", () => {
  expect(isClass(ValidateIsClass, { byteLength: "hello" })).toBe(true);
  expect(isClass(ValidateIsClass, { byteLength: "你好" })).toBe(true);
  expect(isClass(ValidateIsClass, { byteLength: "hi" })).not.toBe(true);
});

test("is creditCard", () => {
  expect(isClass(ValidateIsClass, { creditCard: '5105105105105100' })).toBe(true);
  expect(isClass(ValidateIsClass, { creditCard: 'string' })).not.toBe(true);
});

test("is currency", () => {
  expect(isClass(ValidateIsClass, { currency: '$12' })).toBe(true);
  expect(isClass(ValidateIsClass, { currency: '$ 12' })).not.toBe(true);
  expect(isClass(ValidateIsClass, { currency: '12' })).not.toBe(true);
});

test("is dataURI", () => {
  expect(isClass(ValidateIsClass, { dataURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==' })).toBe(true);
  expect(isClass(ValidateIsClass, { dataURI: 'string' })).not.toBe(true);
});

test("is email", () => {
  expect(isClass(ValidateIsClass, { email: "jason@gmail.com" })).toBe(true);
  expect(isClass(ValidateIsClass, { email: 'jason@gmail' })).not.toBe(true);
});

test("is FQDN", () => {
  expect(isClass(ValidateIsClass, { FQDN: "domain.com" })).toBe(true);
  expect(isClass(ValidateIsClass, { FQDN: 'domain' })).not.toBe(true);
});

test("is fullWidth", () => {
  expect(isClass(ValidateIsClass, { fullWidth: "hello，" })).toBe(true);
  expect(isClass(ValidateIsClass, { fullWidth: 'hello,' })).not.toBe(true);
});

test("is halfWidth", () => {
  expect(isClass(ValidateIsClass, { halfWidth: "hello" })).toBe(true);
  expect(isClass(ValidateIsClass, { halfWidth: 'ア' })).not.toBe(true);
});

test("is hash", () => {
  // expect(isClass(ValidateIsClass, { hash: "bc4b2a76b9719d91" })).toBe(true);
  expect(isClass(ValidateIsClass, { hash: 'hello' })).not.toBe(true);
});

test("is hexColor", () => {
  expect(isClass(ValidateIsClass, { hexColor: "#f40059" })).toBe(true);
  expect(isClass(ValidateIsClass, { hexColor: 'rgba(0, 0, 0, .8)' })).not.toBe(true);
});

test("is hexadecimal", () => {
  expect(isClass(ValidateIsClass, { hexadecimal: "1111" })).toBe(true);
  expect(isClass(ValidateIsClass, { hexadecimal: 'hello' })).not.toBe(true);
});

test("is IP", () => {
  expect(isClass(ValidateIsClass, { IP: "127.0.0.1" })).toBe(true);
  expect(isClass(ValidateIsClass, { IP: 'hello' })).not.toBe(true);
});

test("is ISBN", () => {
  expect(isClass(ValidateIsClass, { ISBN: "978-3-16-148410-0" })).toBe(true);
  expect(isClass(ValidateIsClass, { ISBN: 'hel' })).not.toBe(true);
});

test("is ISSN", () => {
  expect(isClass(ValidateIsClass, { ISSN: "0317-8471" })).toBe(true);
  expect(isClass(ValidateIsClass, { ISSN: 'hello' })).not.toBe(true);
});

test("is ISIN", () => {
  expect(isClass(ValidateIsClass, { ISIN: "US5949181045" })).toBe(true);
  expect(isClass(ValidateIsClass, { ISIN: 'hello' })).not.toBe(true);
});

test("is ISO8601", () => {
  expect(isClass(ValidateIsClass, { ISO8601: "2008-09-15T15:53:00" })).toBe(true);
  expect(isClass(ValidateIsClass, { ISO8601: 'hello' })).not.toBe(true);
});

test("is ISO31661Alpha2", () => {
  expect(isClass(ValidateIsClass, { ISO31661Alpha2: "CN" })).toBe(true);
  expect(isClass(ValidateIsClass, { ISO31661Alpha2: 'hello' })).not.toBe(true);
});

test("is ISRC", () => {
  // expect(isClass(ValidateIsClass, { ISRC: "GB-LFP-16-12345" })).toBe(true);
  expect(isClass(ValidateIsClass, { ISRC: 'hello' })).not.toBe(true);
});

test("is JSON", () => {
  expect(isClass(ValidateIsClass, { JSON: '{"a": "1"}' })).toBe(true);
  expect(isClass(ValidateIsClass, { JSON: '{hello}' })).not.toBe(true);
});

test("is latLong", () => {
  // expect(isClass(ValidateIsClass, { latLong: '37.762030' })).toBe(true);
  expect(isClass(ValidateIsClass, { latLong: '100000' })).not.toBe(true);
});

test("is length", () => {
  expect(isClass(ValidateIsClass, { length: 'hel' })).toBe(true);
  expect(isClass(ValidateIsClass, { length: 'hello' })).not.toBe(true);
});

test("is lowercase", () => {
  expect(isClass(ValidateIsClass, { lowercase: 'hello' })).toBe(true);
  expect(isClass(ValidateIsClass, { lowercase: 'Hello' })).not.toBe(true);
});

test("is MACAddress", () => {
  expect(isClass(ValidateIsClass, { MACAddress: '00:0a:95:9d:68:16' })).toBe(true);
  expect(isClass(ValidateIsClass, { MACAddress: 'Hello' })).not.toBe(true);
});

test("is MD5", () => {
  expect(isClass(ValidateIsClass, { MD5: '5d41402abc4b2a76b9719d911017c592' })).toBe(true);
  expect(isClass(ValidateIsClass, { MD5: 'Hello' })).not.toBe(true);
});

test("is mimeType", () => {
  expect(isClass(ValidateIsClass, { mimeType: 'application/json' })).toBe(true);
  expect(isClass(ValidateIsClass, { mimeType: 'Hello' })).not.toBe(true);
});

test("is mobilePhone", () => {
  expect(isClass(ValidateIsClass, { mobilePhone: '13098971005' })).toBe(true);
  expect(isClass(ValidateIsClass, { mobilePhone: 'Hello' })).not.toBe(true);
});

test("is mongoId", () => {
  expect(isClass(ValidateIsClass, { mongoId: '507f191e810c19729de860ea' })).toBe(true);
  expect(isClass(ValidateIsClass, { mongoId: 'Hello' })).not.toBe(true);
});

test("is port", () => {
  expect(isClass(ValidateIsClass, { port: '8080' })).toBe(true);
  expect(isClass(ValidateIsClass, { port: '65536' })).toMatch('is port');
  expect(isClass(ValidateIsClass, { port: '65536' })).not.toBe(true);
});

test("is number", () => {
  expect(isClass(NameClass, { name: "360sdfsdf" })).toBe(true);
});

test("nexted class", () => {
  expect(isClass(NestedClass, { id: { id: ["122"] } })).toBe(true);
  expect(isClass(NestedClass, { id: 111 })).not.toBe(true);
});

test("deeply nested class", () => {
  const target1 = {
    value: {
      id: {
        id: ["122"],
      },
    },
  };
  expect(isClass(DeeplyNestedClass, target1)).toBe(true);
  const target2 = {
    value: {
      id: {
        id: ["122", "3"],
      },
    },
  };
  expect(isClass(DeeplyNestedClass, target2)).not.toBe(true);
});

test("and or logic", () => {
  expect(isClass(AndOrClass, { value: 1 })).toBe(true);
  expect(isClass(AndOrClass, { value: 2 })).toBe(true);
  expect(isClass(AndOrClass, { value: 3 })).toBe(true);
  expect(isClass(AndOrClass, { value: 4 })).toBe(true);
  expect(isClass(AndOrClass, { value: 5 })).not.toBe(true);
  expect(isClass(AndOrClass, { value: 6 })).toBe(true);
  expect(isClass(AndOrClass, { value: 7 })).not.toBe(true);
});

test("onlyIf", () => {
  expect(isClass(OnlyIfClass, { status: 4 })).toBe(true);
  expect(isClass(OnlyIfClass, { status: 4, value2: 1 })).not.toBe(true);
  expect(isClass(OnlyIfClass, { status: 1, value2: 1 })).toBe(true);
  expect(isClass(OnlyIfClass, { status: 2, value2: 1 })).toBe(true);
  expect(isClass(OnlyIfClass, { status: 3, value2: 1 })).toBe(true);
  expect(isClass(OnlyIfClass, { status: 3, value2: "sdk" })).not.toBe(true);
});

test("customize message", () => {
  expect(isClass(CustomizeMessageClass, {})).toBe("field is required!!");
  expect(isClass(CustomizeMessageClass, { field: "other value" })).toBe("field must equals to some vlaue!!");
  expect(isClass(CustomizeMessageClass, { field: "some value" })).toBe("field must be 1,2 or 3, just kidding LOL.");
});

test("mixin", () => {
  expect(isClass(MixinClass, { id: [1], name: "360name", numberValue: 1 })).toBe(true);
  expect(isClass(MixinClass, { id: [1, "3"], name: "360name", numberValue: 1 })).not.toBe(true);
  expect(isClass(MixinClass, { id: [1], name: "234name", numberValue: 1 })).not.toBe(true);
  expect(isClass(MixinClass, { id: [1], name: "234namesd too long", numberValue: 1 })).not.toBe(true);
  expect(isClass(MixinClass, { id: [1], name: "sfa", numberValue: 1 })).not.toBe(true);
});
