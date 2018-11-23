# ts-class-validator
Declarative typescript validator with nested logic operator support.

## Installation

```
npm install class-validator --save
```

## Usage
``` typescript
import { validate, is, not, and, or, each, isClass, mixins } from 'ts-class-validator';

class IdClass {
  @validate(each(
    is.required(),
    is.int(),
    not.in([3])
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
  @validate(
    is.in([1, 2, 3]).onlyIf(
      (target: object, key: string) => target['value2'] !== undefined
    )
  )
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

```


## Validate Methods
`is` and `not` are rule creator which support all [validator.js](https://github.com/chriso/validator.js) static methods(exclude sanitizer methods), in addition we add bellow methods:
- func(customValidator: (target: any, key: string) => boolean | string): to defined customValidator logic, basiclly you are able to write anything here.
- class(TClass: new () => any, fieldsPattern?: string): similar to isClass, is to validate nested class type.
- required(): value with `null` or `undifined` will failed here, while success in all other validate rules.
- tribleEquals(value: any): compare target === value
- doubleEquals(value: any): compare target == value

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
No async method validate support for now!
Async method is technically reachable, but may mislead user to write low performance code, expecially in server. most of time async validation is time consuming so we normally want to run all the sync validations successful, and then do the async task one by one, or parallelly, depends on real situation. If we want to eable all situation, it may end up with a very ugly and complecated design. Let me know if you have better idea so we can add async feature with minimum user overhead.