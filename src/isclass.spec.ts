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
  expect(isClass({ id: ['111'] }, IdClass)).toBe(true);
  expect(isClass({ id: ['111', '3'] }, IdClass)).not.toBe(true);
});

test('is string', () => {
  expect(isClass({ name: '360sdfsdf' }, NameClass)).toBe(true);
  expect(isClass({ name: '360' }, NameClass)).not.toBe(true);
  expect(isClass({ name: '13602545698' }, NameClass)).not.toBe(true);
  expect(isClass({ name: 'sdfsdfs' }, NameClass)).not.toBe(true);
});

test('nexted class', () => {
  expect(isClass({ id: { id: ['122'] } }, NestedClass)).toBe(true);
  expect(isClass({ id: 111 }, NestedClass)).not.toBe(true);
});

test('deeply nested class', () => {
  let target1 = {
    value: {
      id: {
        id: ['122']
      }
    }
  }
  expect(isClass(target1, DeeplyNestedClass)).toBe(true);
  let target2 = {
    value: {
      id: {
        id: ['122', '3']
      }
    }
  }
  expect(isClass(target2, DeeplyNestedClass)).not.toBe(true);
})

test('and or logic', () => {
  expect(isClass({ value: 1 }, AndOrClass)).toBe(true)
  expect(isClass({ value: 2 }, AndOrClass)).toBe(true)
  expect(isClass({ value: 3 }, AndOrClass)).toBe(true)
  expect(isClass({ value: 4 }, AndOrClass)).toBe(true)
  expect(isClass({ value: 5 }, AndOrClass)).not.toBe(true)
  expect(isClass({ value: 6 }, AndOrClass)).toBe(true)
  expect(isClass({ value: 7 }, AndOrClass)).not.toBe(true)
})

test('onlyIf', () => {
  expect(isClass({ status: 4 }, OnlyIfClass)).toBe(true);
  expect(isClass({ status: 4, value2: 1 }, OnlyIfClass)).not.toBe(true);
  expect(isClass({ status: 1, value2: 1 }, OnlyIfClass)).toBe(true);
  expect(isClass({ status: 2, value2: 1 }, OnlyIfClass)).toBe(true);
  expect(isClass({ status: 3, value2: 1 }, OnlyIfClass)).toBe(true);
  expect(isClass({ status: 3, value2: 'sdk' }, OnlyIfClass)).not.toBe(true);
});

test('customize message', () => {
  expect(isClass({}, CustomizeMessageClass)).toBe('field is required!!');
  expect(isClass({ field: 'other value' }, CustomizeMessageClass)).toBe('field must equals to some vlaue!!');
  expect(isClass({ field: 'some value' }, CustomizeMessageClass)).toBe('field must be 1,2 or 3, just kidding LOL.');
});

test('mixin', () => {
  expect(isClass({ id: [1], name: '360name' }, MixinClass)).toBe(true);
  expect(isClass({ id: [1, '3'], name: '360name' }, MixinClass)).not.toBe(true);
  expect(isClass({ id: [1], name: '234name' }, MixinClass)).not.toBe(true);
  expect(isClass({ id: [1], name: '234namesd too long' }, MixinClass)).not.toBe(true);
  expect(isClass({ id: [1], name: 'sfa' }, MixinClass)).not.toBe(true);
})