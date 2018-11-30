import { and, each, is, not, or, validate, validateGet, Rule } from "../index";

class EachClass {
  @validate(each(
    is.int()
  ))
  public id: number[];
}

class OrClass {
  @validate(or(
    is.length(3, 6),
    is.int(),
    each(
      is.int()
    )
  ))
  public id: number[];
}

const setValueRule = (value: any) => new Rule(() => true, () => value);

class AndClass {
  @validate(and(
    is.int(),
    setValueRule(null)
  ))
  public id: number[];
}

// 不支持继承复用

test("each parser", () => {
  expect(validateGet(EachClass, { id: '1,2,3' })).toEqual({ instance: { id: [1, 2, 3] } });
  expect(validateGet(EachClass, { id: ['1', '2', '3'] })).toEqual({ instance: { id: [1, 2, 3] } });
});
test("or parser", () => {
  expect(validateGet(OrClass, { id: '1' })).toEqual({ instance: { id: 1 } });
});

test("or parser return the first success rule", () => {
  expect(validateGet(OrClass, { id: 'sdfsf' })).toEqual({ instance: { id: 'sdfsf' } });
});

test('or parser only run on on validate success rules', () => {
  expect(validateGet(OrClass, { id: '1,2,3' })).toEqual({ instance: { id: '1,2,3' } });
  expect(validateGet(OrClass, { id: '1,2,3,4,5' })).toEqual({ instance: { id: [1, 2, 3, 4, 5] } });
});

test("and parser", () => {
  expect(validateGet(AndClass, { id: '1' })).toEqual({ instance: { id: null } });
});
