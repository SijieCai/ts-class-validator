import { validate, is, not, and, or, each, isClass } from '../src/index';

class IdClass {
  @validate(each(
    is.int(),
    not.in(['3']),
    is.required()
  ))
  id: number[];
}

class NameClass {
  @validate(
    is.length(4, 10),
    is.contains('360')
  )
  name: string;
}

class NestedClass {
  @validate(
    is.class(IdClass)
  )
  id: IdClass;
}

class DeeplyNestedClass {
  @validate(
    is.class(NestedClass)
  )
  value: NestedClass;
}

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
test('and or logic', ()=>{
  expect(isClass({value: 1}, AndOrClass)).toBe(true)
  expect(isClass({value: 2}, AndOrClass)).toBe(true)
  expect(isClass({value: 3}, AndOrClass)).toBe(true)
  expect(isClass({value: 4}, AndOrClass)).toBe(true)
  expect(isClass({value: 5}, AndOrClass)).not.toBe(true)
  expect(isClass({value: 6}, AndOrClass)).toBe(true)
  expect(isClass({value: 7}, AndOrClass)).not.toBe(true)
})

test('onlyIf', ()=>{
  
});