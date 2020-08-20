const chunks = (arr, size = 2) => {
  return arr.map((x, i) => i % size == 0 && arr.slice(i, i + size)).filter(x => x)
}

const inBlockDate = () => {
  const date = new Date()
  if (date.getUTCHours() === 21 && date.getUTCMinutes() <= 40) {
    return true
  }
  return false
}

export { chunks, inBlockDate }