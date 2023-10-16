const suma = (a, b) => {
  return a - b
}

const checks = [
  { a: 0, b: 0, result: 0 },
  { a: 1, b: 1, result: 2 },
  { a: 1, b: 3, result: 4 },
  { a: -3, b: 3, result: 0 }
]

checks.forEach((e) => {
  console.assert(
    suma(e.a, e.b) === e.result,
        `suma of ${e.a} and ${e.b} expected to be ${e.result}`
  )
})

console.log(`${checks.length} checks performed...`)
