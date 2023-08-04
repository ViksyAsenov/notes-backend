const reverse = (text) => {
  return text
    .split('')
    .reverse()
    .join('')
}

const average = (arr) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return arr.length === 0
    ? 0
    : arr.reduce(reducer, 0) / arr.length
}

module.exports = {
  reverse,
  average
}