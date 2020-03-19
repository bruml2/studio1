export const TimeAxisMixin{
  methods: {
    getTickValues(startYear, stopYear, tickInterval) {
      // todo: delete too-close first/last normal ticks;
      let firstTick = undefined
      // if startYear not on a tickInterval-year boundary;
      if (startYear % tickInterval != 0) {
        firstTick = startYear
        startYear += tickInterval - (startYear % tickInterval)
      }
      const numTicks = Math.floor((stopYear - startYear)/tickInterval) + 1
      const ticks = Array(numTicks).fill(startYear).map((start, index) => start + (index * tickInterval))
      if (firstTick) ticks.unshift(firstTick)
      // if stopYear is not on a boundary, add it;
      if (!Number.isInteger((stopYear - startYear)/tickInterval)) { ticks.push(stopYear) }
      return ticks
    }
  }
}
