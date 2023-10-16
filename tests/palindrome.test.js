const { palindrome } = require('../utils/for_testing')

test('palindrome of Orey', () => {
  const result = palindrome('Orey')
  expect(result).toBe('yerO')
})

test('palindrome of empty string', () => {
  const result = palindrome('')
  expect(result).toBe('')
})

test('palindrome of undefinde', () => {
  const result = palindrome()
  expect(result).toBeUndefined()
})
