import { validate, is, not, and, or, each, isClass, mixins } from '../src/index';

class IdClass {
  @validate(each(
    is.int(),
    not.in([3]),
    is.required()
  ))
  id: number[];
}

class NameClass {
  @validate(is.length(4, 10), is.contains('360'))
  name: string;
}

class NestedClass {
  @validate(is.class(IdClass))
  id: IdClass;
}

class DeeplyNestedClass {
  @validate(is.class(NestedClass))
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

// 组合复用
@mixins(IdClass, NameClass)
class MixinClass implements IdClass, NameClass {
  name: string;
  id: number[];
}

// 不支持继承复用

test('each', () => {
  expect(isClass(IdClass, { id: ['111'] })).toBe(true);
  expect(isClass(IdClass, { id: ['111', '3'] })).not.toBe(true);
});

test('is string', () => {
  expect(isClass(NameClass, { name: '360sdfsdf' })).toBe(true);
  expect(isClass(NameClass, { name: '360' })).not.toBe(true);
  expect(isClass(NameClass, { name: '13602545698' })).not.toBe(true);
  expect(isClass(NameClass, { name: 'sdfsdfs' })).not.toBe(true);
});

test('nexted class', () => {
  expect(isClass(NestedClass, { id: { id: ['122'] } })).toBe(true);
  expect(isClass(NestedClass, { id: 111 })).not.toBe(true);
});

test('deeply nested class', () => {
  let target1 = {
    value: {
      id: {
        id: ['122']
      }
    }
  }
  expect(isClass(DeeplyNestedClass, target1)).toBe(true);
  let target2 = {
    value: {
      id: {
        id: ['122', '3']
      }
    }
  }
  expect(isClass(DeeplyNestedClass, target2)).not.toBe(true);
})

test('and or logic', () => {
  expect(isClass(AndOrClass, { value: 1 })).toBe(true)
  expect(isClass(AndOrClass, { value: 2 })).toBe(true)
  expect(isClass(AndOrClass, { value: 3 })).toBe(true)
  expect(isClass(AndOrClass, { value: 4 })).toBe(true)
  expect(isClass(AndOrClass, { value: 5 })).not.toBe(true)
  expect(isClass(AndOrClass, { value: 6 })).toBe(true)
  expect(isClass(AndOrClass, { value: 7 })).not.toBe(true)
})

test('onlyIf', () => {
  expect(isClass(OnlyIfClass, { status: 4 })).toBe(true);
  expect(isClass(OnlyIfClass, { status: 4, value2: 1 })).not.toBe(true);
  expect(isClass(OnlyIfClass, { status: 1, value2: 1 })).toBe(true);
  expect(isClass(OnlyIfClass, { status: 2, value2: 1 })).toBe(true);
  expect(isClass(OnlyIfClass, { status: 3, value2: 1 })).toBe(true);
  expect(isClass(OnlyIfClass, { status: 3, value2: 'sdk' })).not.toBe(true);
});

test('customize message', () => {
  expect(isClass(CustomizeMessageClass, {})).toBe('field is required!!');
  expect(isClass(CustomizeMessageClass, { field: 'other value' })).toBe('field must equals to some vlaue!!');
  expect(isClass(CustomizeMessageClass, { field: 'some value' })).toBe('field must be 1,2 or 3, just kidding LOL.');
});

test('mixin', () => {
  expect(isClass(MixinClass, { id: [1], name: '360name' })).toBe(true);
  expect(isClass(MixinClass, { id: [1, '3'], name: '360name' })).not.toBe(true);
  expect(isClass(MixinClass, { id: [1], name: '234name' })).not.toBe(true);
  expect(isClass(MixinClass, { id: [1], name: '234namesd too long' })).not.toBe(true);
  expect(isClass(MixinClass, { id: [1], name: 'sfa' })).not.toBe(true);
})