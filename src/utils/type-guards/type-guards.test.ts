import { hasStringField } from '@/utils/type-guards/type-guards'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'

BddTest().given('a hasStringField checker', () => {
  BddTest().when('the field exists', () => {
    BddTest().and('is a string', () => {
      BddTest().then('it should return true', () => {
        const obj = { name: 'Alice' }
        expect(hasStringField(obj, 'name')).toBe(true)
      })
    })

    BddTest().and('is not a string', () => {
      BddTest().then('it should return false', () => {
        const obj = { age: 30 }
        expect(hasStringField(obj, 'age')).toBe(false)
      })
    })
  })

  BddTest().when('the field does not exist', () => {
    BddTest().then('it should return false', () => {
      const obj = { age: 30 }
      expect(hasStringField(obj, 'name')).toBe(false)
    })
  })

  BddTest().when('the obj is null', () => {
    BddTest().then('it should return false', () => {
      expect(hasStringField(null, 'name')).toBe(false)
    })
  })

  BddTest().when('the obj is not an object', () => {
    BddTest().then('it should return false', () => {
      expect(hasStringField(42, 'name')).toBe(false)
      expect(hasStringField('test', 'name')).toBe(false)
      expect(hasStringField(undefined, 'name')).toBe(false)
    })
  })
})
