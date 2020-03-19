// eslint-disable-next-line
const getTickValues = function (startYear, stopYear, tickInterval) {
  let firstTick = undefined
  // is startYear on a tickInterval-year boundary?
  if (startYear % tickInterval != 0) {
    firstTick = startYear
    startYear += tickInterval - (startYear % tickInterval)
  }
  const numTicks = Math.floor((stopYear - startYear)/tickInterval) + 1
  const usualTicks = Array(numTicks).fill(startYear).map((start, index) => start + (index * tickInterval))
  // is stopYear on a 5-year boundary?
  if (!Number.isInteger((stopYear - startYear)/tickInterval)) { usualTicks.push(stopYear) }
  if (firstTick) usualTicks.unshift(firstTick)
  return usualTicks
}

module.exports = getTickValues // works 

/*
export default {    // works
  methods: {
    getTickValues(startYear, stopYear, tickInterval) {
      return getTickValues(startYear, stopYear, tickInterval)
    }
  }
}
*/