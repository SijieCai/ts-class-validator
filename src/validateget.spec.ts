import { validate, is, not, and, or, each, isClass, validateGet, mixins } from '../src/index';

class IdClass {
  @validate(each(
    is.int(),
    not.in([3]),
    is.required()
  ))
  id: number[];
}

class NameClass {
  @validate(
    is.length(4, 10).message('The length of name must between 4 to 10'),
    is.contains('360'))
  name: string;
}

class NestedClass {
  @validate(is.class(IdClass).message('id must be type of IdClass'))
  id: IdClass;
}

class DeeplyNestedClass {
  @validate(is.class(NestedClass).message('value must be of NestedClass'))
  value: NestedClass;
}

class AndOrClass {
  @validate(or(
    is.in([1, 2, 3]),
    and(
      is.in([4, 5, 6]),
      is.divisibleBy(2)
    )
  ))
  value: number;
}

class OnlyIfClass {
  @validate(is.in([1, 2, 3]).onlyIf(target => target['value2'] !== undefined))
  status: number;
  @validate(is.int())
  value2: number;
}

class CustomizeMessageClass {
  @validate(
    is.required().message('field is required!!'),
    is.equals('some value').message('field must equals to some vlaue!!'),
    or(
      is.in([1, 2]),
      is.equals(3)
    ).message('field must be 1,2 or 3, just kidding LOL.')
  )
  field: string;
}

@mixins(IdClass, NameClass)
class MixinClass implements IdClass, NameClass {
  name: string;
  id: number[];
}

test('validateGet default', () => {
  let array = ['111']
  let result = validateGet(IdClass, { id: array, dangerValue: 'as@#$%%wdskjf' });
  expect(result.instance).toEqual({ id: array });
  expect(result.message).toBe(undefined);
});

test('validateGet filter un-validate values', () => {
  let array = ['111']
  let result = validateGet(IdClass, { id: array, dangerValue: 'as@#$%%wdskjf' }, { filterUnvalidateFields: true });
  expect(result.instance).toEqual({ id: array });
  expect(result.message).toBe(undefined);
});


test('validateGet not filter un-validate values', () => {
  let array = ['111']
  let result = validateGet(IdClass, { id: array, dangerValue: 'as@#$%%wdskjf' }, { filterUnvalidateFields: false });
  expect(result.instance).toEqual({ id: array, dangerValue: 'as@#$%%wdskjf' });
  expect(result.message).toBe(undefined);
});

test('validateGet message', () => {
  expect(validateGet(NameClass, { name: '360sdfsdf' })).toEqual({ instance: { name: '360sdfsdf' } });
  expect(validateGet(NameClass, { name: '360' })).toEqual({ message: 'The length of name must between 4 to 10' });
})

test('validateGet nested class', () => {
  let array = ['122']
  expect(validateGet(NestedClass, { id: { id: array, nestedUnvalidate: 'some value' } })).toEqual({
    instance: { id: { id: array } }
  });
  expect(validateGet(NestedClass, { id: 111 })).toEqual({ message: 'id must be type of IdClass' });
});



test('validateGet deeply nested class', () => {
  let array = ['122']
  let target1 = {
    value: {
      id: {
        id: array,
        thisWillBeFilteredToo: 'DB inject'
      }
    },
    thisWillBeFilterd: 'DB inject'
  }
  expect(validateGet(DeeplyNestedClass, target1)).toEqual({
    instance: {
      value: {
        id: {
          id: array
        }
      }
    }
  });
  let target2 = {
    value: {
      id: {
        id: ['122', '3']
      }
    }
  }
  expect(validateGet(DeeplyNestedClass, target2)).toEqual({message: 'value must be of NestedClass'});
});