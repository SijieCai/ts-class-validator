# ts-class-validator
Declarative typescript validator with nested logic operator support.

## Installation

```
npm install ts-class-validator --save
```

## Usage

``` typescript
import { validate, is, not, and, or, each, isClass, validateGet, mixins } from 'ts-class-validator';

```

### Primitive type validation

Each validate default is not required, which means value of `null` or `undefined` will always passed validation, unless you put a `is.required()` on top.

``` typescript 
class PrimitiveClass {
  @validate(
    is.length(4, 10),
    is.contains('111')
  )
  name: string;

  @validate(
    is.required(),
    is.int({min: 1})
  )
  age: number;
}

isClass(PrimitiveClass, { name: '111abced', age: 5 }) // true
isClass(PrimitiveClass, { name: '360', age: 5 }) // 'error message here'

validateGet(PrimitiveClass, { name: '111abced', age: '5' }) 
// { instance: PrimitiveClass { name: '111abced', age: 5 } }
validateGet(PrimitiveClass, { name: '360', age: 5 }) 
// { message: 'error message here' }
 
```



### Array validation
Use `each` to validate array, you can even nested `each` to validate two-dimensional array.
``` typescript 
class ArrayClass {
  @validate(
    is.required(),
    each(
      is.required(),
      is.int()
    )
  )
  value: number[];

  @validate(
    each(
      each(
        is.int();
      )
    )
  )
  value2: number[][];
}

validateGet(ArrayClass, {value: [1,2,3]})  // { instance: ArrayClass { value: [1,2,3] } }

validateGet(ArrayClass, {value: [1,2,null]}) // { message: 'error message here' }

validateGet(ArrayClass, {value: '1,2,3,4'})
// { instance: ArrayClass {value: [1,2,3,4] } }

validateGet(ArrayClass, {value: '1,2,3,4'}, {parseArray: false}) 
// { instance: ArrayClass {value: '1,2,3,4'} }

validateGet(ArrayClass, {value: '1,2,3,4'}, {parseNumber: false}) 
// { instance: ArrayClass {value: ['1','2','3','4']} }

validateGet(ArrayClass, {value: '1,2', value2: [[1, 2],[3, '4']]})
// { instance: ArrayClass {value: ['1','2'], value2: [[1,2], [3,4]]} }

```

### Nested class validation

``` typescript 

class NestedClass {
  @validate(is.class(IdClass))
  id: IdClass;
}

class DeeplyNestedClass {
  @validate(is.class(NestedClass))
  value: NestedClass;
}

```

### Logical operator
You can use `and`, `or` logical operator, they can be nested to work as expected.
All ValidateRule can specify `onlyIf` conditional to enable/disable this validation.
``` typescript
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
  @validate(
    is.in([1, 2, 3]).onlyIf(
      (target: object, key: string) => target['value2'] !== undefined
    )
  )
  status: number;
  @validate(is.int())
  value2: number;
}
```

### Customize error message
``` typescript
class CustomizeMessageClass {
  @validate(
    is.required().message('field is required!!'),
    is.equals('some value').message('field must equals to some value!!'),
    or(
      is.in([1, 2]),
      is.equals(3)
    ).message('field must be 1,2 or 3, just kidding LOL.')
  )
  field: string;
}
```

### Extends validation class

``` typescript 

class IdClass {
  @validate(is.required(), is.int())
  id: number;

  getId() {return 'prefix-' + this.id ; }
}
 
class ExtendClass extends IdClass {
  name: string; 
}

let instance = validateGet(MixinClass, {id: 1, name: 'name'}).instance;
console.log(instance.getId()); // 'prefix-1'

```


### Mixin validation class

``` typescript 

class IdClass {
  @validate(is.required(), is.int())
  id: number;

  getId() {return 'prefix-' + this.id ; }
}

class NameClass {
  @validate(is.required(), is.length(3,10))
  name: string;

  @validate() // validate without rules is used to whitelisting a field for validateGet
  whitelist: any
}

@mixins(IdClass, NameClass)
class MixinClass implements IdClass, NameClass {
  name: string;
  id: number[];
  getId: ()=>string
}

let instance = validateGet(MixinClass, {id: 1, name: 'name'}).instance;
console.log(instance.getId()); // 'prefix-1'


```

### Validate rules
`is` and `not` are buildin rule creator which support all [validator.js](https://github.com/chriso/validator.js) static methods(exclude sanitizer methods), in addition we add bellow methods:
- func(customValidator: (target: any, key: string) => boolean | string): to defined customValidator logic, basically you are able to write anything here.
- class(TClass: new () => any, fieldsPattern?: string): similar to isClass, is to validate nested class type.
- required(): value with `null` or `undefined` will failed here, while success in all other validate rules.
- tripleEquals(value: any): compare target === value
- doubleEquals(value: any): compare target == value

### Create your own rule creator
You can define your own rule creator which return a Rule, it can be compose and reused. For example, you want to perform a JSON parse on some fields on validation, like this:
``` typescript

class Person {/* .... */}

class SomeClass {
  @validate(
    jsonParse(
      is.class(Person)
    ).message('person is not a valid JSON')
  )
  person: Person;
}

validateGet(SomeClass, {person: '{"person":{"name":"","age":40}}'}, {parseJSON: true})
// SomeClass { person: Person {name: '', age: 40} }

```
To implement jsonParse as bellow:
``` typescript
import { Rule, and } from 'ts-class-validation';
function jsonParse(...rules: Rule[]) {
  return new Rule(
    function validate(target: object, key: string) {
      let value = target[key];

      try { value = JSON.parse(value); }
      catch (e) { return false; }

      target = Object.assign({}, target, { [key]: value });

      return and(...rules).validate(target, key);
    },
    function getMessage(target, key) { return `target.${key} is not a validate json` },
    function validateGetParser(value, options) {
      if (options.parseJSON) { // parseJSON passed in by validateGet(a, b, options)
        return JSON.parse(value);
      }
      return value;
    }
  );
}
```

### validateGet options
`validateGet` accept a third optional params 

``` typescript

interface ValidateGetOptions {
  filterUnvalidateFields?: boolean; // default true
  parseNumber?: boolean;      // default true
  parseArray?: boolean;       // default true
  [name: string]: any         // for user defined rule 
}

```
## Localization
Each failed validation will display a buildin error message, you can override each rule by use `.message()` method, or you can override the default message:
``` typescript
import { setErrorMessage } from 'ts-class-validator';
setErrorMessage({
  contains: {
    is: (target: object, key: string, ...rest: any[]) => `customized: ${target[key]} contains ${rest.join(', ')}`,
    not: (target: object, key: string, ...rest: any[]) => `customized: ${target[key]} not contains ${rest.join(', ')}`
  },
  after: {
    is: (target: object, key: string, ...rest: any[]) => `customized: ${target[key]} date is after date ${rest.join(', ')}`,
    not: (target: object, key: string, ...rest: any[]) => `customized: ${target[key]} date is not after date ${rest.join(', ')}`
  },
  // other settings
})

```

## Async Support
No async validate method support for now!
Async validation mixed with sync ones may cause performance issues. why? Most of the time async validation is time consuming, we normally want to success all the sync validations first, and then do the async ones; one after another, or parallelly, depends on real situation. If we design the interface to support all above scenarios, it may end up ugly. Let me know if you have better idea.