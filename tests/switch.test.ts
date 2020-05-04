import $switch from '../src'
import { describe, it } from 'mocha'
import { assert, expect } from 'chai'

describe('$switch() tests', () => {
  describe('Matches simple types correctly', () => {
    describe('Matches numbers correctly', () => {
      it('integer', () => {
        const matched = $switch<any, string>(1)
          .when('1', () => 'string')
          .when(true, () => 'boolean')
          .when(1, () => 'ok')
          .default(() => 'default')
          .match()
        
        expect(matched).equals('ok', matched)
      })
  
      it('negative integer', () => {
        const matched = $switch<any, string>(-42)
          .when('-42', () => 'string')
          .when(false, () => 'boolean')
          .when(-42, () => 'ok')
          .default(() => 'default')
          .match()
        
        expect(matched).equals('ok', matched)
      })
  
      it('decimal', () => {
        const matched = $switch<any, string>(42.4567)
          .when('42.4567', () => 'string')
          .when(-42.4567, () => 'ok')
          .when(true, () => 'boolean')
          .when(42.4567, () => 'ok')
          .default(() => 'default')
          .match()
        
        expect(matched).equals('ok', matched)
      })

      it('zero', () => {
        const matched = $switch<any, string>(0)
          .when('0', () => 'string')
          .when(false, () => 'boolean')
          .when(0, () => 'ok')
          .default(() => 'default')
          .match()

        expect(matched).equals('ok', matched)
      })
    })
  
    describe('Matches strings correctly', () => {
      it('empty string', () => {
        const matched = $switch<any, string>('')
          .when(false, () => 'boolean')
          .when(' ', () =>'white space')
          .when('', () => 'ok')
          .default(() => 'default')
          .match()
  
        expect(matched).equals('ok', matched)
      })
      
      it('number-like', () => {
        const matched = $switch<any, string>('123')
          .when(true, () => 'boolean')
          .when(123, () => 'number')
          .when('123', () => 'ok')
          .default(() => 'default')
          .match()
  
        expect(matched).equals('ok', matched)
      })
  
      it('boolean-like (true)', () => {
        const matched = $switch<any, string>('true')
          .when(1, () => 'number')
          .when(true, () => 'boolean')
          .when('true', () => 'ok')
          .default(() => 'default')
          .match()
  
        expect(matched).equals('ok', matched)
      })
  
      it('boolean-like (false)', () => {
        const matched = $switch<any, string>('false')
          .when(0, () => 'number')
          .when(false, () => 'boolean')
          .when('false', () => 'ok')
          .default(() => 'default')
          .match()
  
        expect(matched).equals('ok', matched)
      })
    })
  
    describe('Matches booleans correctly', () => {
      it('true', () => {
        const matched = $switch<any, string>(true)
          .when(1, () => 'number')
          .when('true', () => 'string')
          .when(true, () => 'ok')
          .default(() => 'default')
          .match()
  
        expect(matched).equals('ok', matched)
      })
  
      it('false', () => {
        const matched = $switch<any, any>(false)
          .when(0, () => 'number')
          .when('false', () => 'string')
          .when(false, () => 'ok')
          .default(() => 'default')
          .match()
  
        expect(matched).equals('ok', matched)
      })
    })
  })
  
  describe('Matches functional cases correctly', () => {
    it('executes functional conditions', () => {
      const matched = $switch<any, string>(true)
        .when(() => true, () => 'ok')
        .default(() => 'default')
        .match()
  
      expect(matched).equals('ok', matched)
    })
  
    it('matches the first true condition only', () => {
      const matched = $switch<any, string>(false)
        .when((value) => value === false, () => 'ok')
        .when((value) => !value, () => 'second case')
        .default(() => 'default')
        .match()
  
      expect(matched).equals('ok', matched)
    })
  
    it('provides the switched value to the conditional function', () => {
      const matched = $switch<number, string>(2)
        .when((value) => value % 2 === 0, () => 'ok')
        .when((value) => value % 3 === 0, () => 'divisible by 3')
        .when((value) => value % 5 === 0, () => 'divisible by 5')
        .default(() => 'default')
        .match()
  
      expect(matched).equals('ok', matched)
    })
  })
  
  describe('Matches tuples correctly', () => {
    it('literal match', () => {
      const matched = $switch<any, string>([42 ,'42'])
        .when(['42', 42], () => 'flipped')
        .when(['42', '42'], () => 'strings')
        .when([42, '42'], () => 'ok')
        .default(() => 'default')
        .match()
  
      expect(matched).equals('ok', matched)
    })
  })
  
  describe('Matches one-of-many correctly', () => {
    it('numbers', () => {
      const matched = $switch<any, string>(42)
        .when(['24'], () => 'string')
        .when([24], () => 'flipped')
        .when([24, 42, -1], () => 'ok')
        .default(() => 'default')
        .match()
  
      expect(matched).equals('ok', matched)
    })
  
    it('tuples', () => {
      const matched = $switch<any, string>([42, 24])
        .when([[0, 5], [42, 24]], () => 'ok')
        .when([[24, 42], [1, 2]], () => 'fail')
        .default(() => 'default')
        .match()
  
      expect(matched).equals('ok', matched)
    })

    it('matches supports optional tuple values', () => {
      const tobject = { status: 200, }
      const matched = $switch<any, string>([tobject.status, (tobject as any).error])
        .when([200, undefined], () => 'ok')
        .default(() => 'default')
        .match()

      expect(matched).equals('ok', matched)
    })
  })
  
  it('returns undefined when matches don\'t return a value', () => {
    const result = $switch<number, any>(42)
      .when(42, () => { /* side effect function */ })
      .default(() => { })
      .match()

    assert.isUndefined(result)
  })

  it('returns undefined when default doesn\'t return a value', () => {
    const result = $switch<number, any>(10)
      .when(0, () => 'fail')
      .default(() => { })
      .match()

    assert.isUndefined(result)
  })
})