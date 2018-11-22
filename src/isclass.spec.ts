import { validate, is, not, and, or, each, isClass } from '../src/index';
async function queryDatabase(v: any) { return v; }

class IdParam {
  @validate(each(
    is.int(),
    is.required()
  ))
  id: number[];
}

class NameParam {
  @validate(
    is.length(4, 10),
    is.contains('360')
  )
  name: string;
}

test('each', () => {
  expect(isClass({ id: ['111'] }, IdParam)).toBe(true);
});


test('is string', () => {
  expect(isClass({name: '360sdfsdf'}, NameParam)).toBe(true);
  expect(isClass({name: '360'}, NameParam)).toBe(false);
  expect(isClass({name: '13602545698'}, NameParam)).toBe(false);
  expect(isClass({name: 'sdfsdfs'}, NameParam)).toBe(false);
});