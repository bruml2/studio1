import { mount } from '@vue/test-utils'
import { TimeAxisMixin } from '../mixins/TimeAxisMixin.js'



describe('getTickValues', () => {
  test('on boundaries', () => {
    const ret = getTickValues(1900, 2000, 10)
    expect(ret).toEqual([1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000])
  }),
  test('on odd start', () => {
    const ret = getTickValues(1902, 2000, 10)
    expect(ret).toEqual([1902, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000])
  }),
  test('on odd stop', () => {
    const ret = getTickValues(1900, 1997, 10)
    expect(ret).toEqual([1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 1997])
  }),
  test('on odd start and stop', () => {
    const ret = getTickValues(1902, 2006, 10)
    expect(ret).toEqual([1902, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2006])
  }),
  test('on short extent', () => {
    const ret = getTickValues(1902, 1916, 5)
    expect(ret).toEqual([1902, 1905, 1910, 1915, 1916])
  }),
  test('on improbable extent', () => {
    const ret = getTickValues(1902, 1906, 5)
    expect(ret).toEqual([1902, 1905, 1906])
  })
})

