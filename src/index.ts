export interface SwitchConditionEvaluater<T> {
  (value: T): boolean;
}

/**
 * Represents the result of an fswitch tree expression. Allows retrieving the value returned
 * from the callback of the matched case.
 * @param T The type of the value returned from the callback of the matched case.
 */
export interface SwitchResult<T> {
  /**
   * Returns the value from the callback of the matched case, if any.
   */
  match: () => T;
}

/**
 * Reprensents an fswitch tree. Allows chaining conditions to the fswtich.
 * @param T {any} The type of the value that will be matched against each condition.
 * @param U {any} The type of the value returned from the callback of the matched condition.
 */
export interface Switch<T, U> {
  /**
   * Adds a new case to the fswitch tree.
   * @param condition Indicates whether this case should be matched and the @callback executed.
   * @param callback Executed if the @condition evaluates to true.
   */
  when: (condition: T | Array<T> | SwitchConditionEvaluater<T>, callback: (value: T) => U) => Switch<T, U>;
  /**
   * Adds a default case to the fswitch tree to be executed when no other case is matched.
   * @param callback Executed if the default case is matched.
   */
  default: (callback: (value: T) => U) => SwitchResult<U>;
}

const arrayOf = (array: any[], expected: any): boolean => {
  return (
    !!array &&
    Array.isArray(array) &&
    array.every(item => item.constructor.name === expected.constructor.name)
  )
}

const equals = (a: any, b: any): boolean => {
  if (typeof a !== typeof b) return false
  else if (
    a === null ||
    a === undefined ||
    b === null ||
    b === undefined ||
    typeof a === 'bigint' ||
    typeof a === 'boolean' ||
    typeof a === 'symbol' ||
    typeof a === 'string' ||
    typeof a === 'number'
  ) return a === b
  else if (typeof a === 'object' && Array.isArray(a)) return (
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((element, index) => element === b[index])
  )
  else if (typeof a === 'function') return a() === b()
  else if (typeof a === 'object') return JSON.stringify(a) === JSON.stringify(b)
  else return false
}

const invokeSafe = <T>(func: (...args: any[]) => T, ...args: any[]): T => {
  if (func instanceof Function) return func(args)
}

/**
 * Creates an fswitch tree.
 * @param value The value to be matched against each condition.
 * @param T {any} The type of the value that will be matched against each condition.
 * @param U {any} The type of the value returned from the callback of the matched condition.
 */
export default function $switch <T, U>(value: T): Switch<T, U> {
  let _value = value
  let _matched = false
  let _result: U

  return {
    when: function (condition, callback) {
      if (_matched) return this

      const matched = (
        (condition instanceof Function && condition(_value) === true) ||
        (Array.isArray(condition) && arrayOf(condition, _value) && condition.some((item) => equals(_value, item))) ||
        equals(_value, condition)
      )

      if (matched) {
        _matched = true
        _result = invokeSafe(callback, _value)
      }
      
      return this
    },
    default: function (callback) {
      if (!_matched) _result = invokeSafe(callback, _value)
      return {
        match: () => _result,
      }
    },
  }
}
