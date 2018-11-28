import { and, each, is, isClass, mixins, not, or, validate, validateGet } from "../index";

class IdClass {
  @validate(each(
    is.int(),
    not.in([3]),
    is.required(),
  ))
  public id: number[];

  public hello() {
    return "hello use minxin class";
  }
}

class NameClass {
  @validate(
    is.length(4, 10).message("The length of name must between 4 to 10"),
    is.contains("360"))
  public name: string;
}

class NestedClass {
  @validate(is.class(IdClass).message("id must be type of IdClass"))
  public id: IdClass;
}

class DeeplyNestedClass {
  @validate(is.class(NestedClass).message("value must be of NestedClass"))
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

class ParseIntClass {
  @validate(is.int(), is.required())
  public value: number;
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

@mixins(IdClass, NameClass)
class MixinClass implements IdClass, NameClass {
  public hello: () => string;
  public name: string;
  public id: number[];
}

test("validateGet default", () => {
  const array = ["111"];
  const result = validateGet(IdClass, { id: array, dangerValue: "as@#$%%wdskjf" });
  expect(result.instance).toEqual({ id: array });
  expect(result.message).toBe(undefined);
});

test("validateGet filter un-validate values", () => {
  const array = ["111"];
  const result = validateGet(IdClass, { id: array, dangerValue: "as@#$%%wdskjf" }, { filterUnvalidateFields: true });
  expect(result.instance).toEqual({ id: array });
  expect(result.message).toBe(undefined);
});

test("validateGet not filter un-validate values", () => {
  const array = ["111"];
  const result = validateGet(IdClass, { id: array, dangerValue: "as@#$%%wdskjf" }, { filterUnvalidateFields: false });
  expect(result.instance).toEqual({ id: array, dangerValue: "as@#$%%wdskjf" });
  expect(result.message).toBe(undefined);
});

test("validateGet message", () => {
  expect(validateGet(NameClass, { name: "360sdfsdf" })).toEqual({ instance: { name: "360sdfsdf" } });
  expect(validateGet(NameClass, { name: "360" })).toEqual({ message: "The length of name must between 4 to 10" });
});

test("validateGet nested class", () => {
  const array = ["122"];
  expect(validateGet(NestedClass, { id: { id: array, nestedUnvalidate: "some value" } })).toEqual({
    instance: { id: { id: array } },
  });
  expect(validateGet(NestedClass, { id: 111 })).toEqual({ message: "id must be type of IdClass" });
});

test("validateGet deeply nested class", () => {
  const array = ["122"];
  const target1 = {
    value: {
      id: {
        id: array,
        thisWillBeFilteredToo: "DB inject",
      },
    },
    thisWillBeFilterd: "DB inject",
  };
  expect(validateGet(DeeplyNestedClass, target1)).toEqual({
    instance: {
      value: {
        id: {
          id: array,
        },
      },
    },
  });
  const target2 = {
    value: {
      id: {
        id: ["122", "3"],
      },
    },
  };
  expect(validateGet(DeeplyNestedClass, target2)).toEqual({ message: "value must be of NestedClass" });
});

test("validateGet mixin", () => {
  expect(isClass(MixinClass, { id: [1], name: "360name" })).toBe(true);
  expect(isClass(MixinClass, { id: [1, "3"], name: "360name" })).not.toBe(true);
  expect(isClass(MixinClass, { id: [1], name: "234name" })).not.toBe(true);
  expect(isClass(MixinClass, { id: [1], name: "234namesd too long" })).not.toBe(true);
  expect(isClass(MixinClass, { id: [1], name: "sfa" })).not.toBe(true);
});

test("validateGet parseInt", () => {
  expect(validateGet(ParseIntClass, { value: "1234" }).instance).toEqual({ value: 1234 });
});

test("validateGet parseArray", () => {
  expect(validateGet(IdClass, { id: "1,2,3" })).toEqual({ message: "3 is not in [3]" });
  expect(validateGet(IdClass, { id: "1,2" })).toEqual({ instance: { id: [1, 2] } });
});
test("validateGet not parseArray", () => {
  expect(validateGet(IdClass, { id: "1,2,3" }, { parseArray: false })).toEqual({ message: "3 is not in [3]" });
  expect(validateGet(IdClass, { id: "1,2" }, { parseArray: false })).toEqual({ instance: { id: "1,2" } });
});

test("validateGet mixin", () => {
  expect(validateGet(MixinClass, { id: [1], name: "360name", numberValue: 1 }))
    .toEqual({ instance: { id: [1], name: "360name" } });
});

test("validateGet mixin class will get inherit method", () => {
  expect(validateGet(MixinClass, { id: [1], name: "360name" }).instance.hello())
    .toBe("hello use minxin class");

});
