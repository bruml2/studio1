<template>
  <div id="timeAxisComponent">
    <svg class="svg" :width="timeAxisObj.svgWidth" height="50px" xmlns="http://www.w3.org/2000/svg">
      <g class="timeAxisGrp"></g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: "TimeAxisComponent",
  props: {
    // typcially: startYear, stopYear, tickInterval, svgWidth only;
    timeAxisPropObj: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      rootEl: undefined,
      timeAxisObj: {
        startYear: 1930,
        stopYear: 1990,
        tickInterval: 10,
        svgWidth: 1000,
        svgSideMargin: 20,
        eraTopMargin: 0,
        eraHeight: 0,
        timeAxisVerticalOffset: 25,
        timeAxisStroke: "black",
        timeAxisStrokeWidth: 2,
        timeAxisFontFamily: "sans-serif",
        timeAxisFontSize: 13
      }
    }
  },
  mounted: function() {
    this.rootEl = document.getElementById("timeAxisComponent")
    // console.log(`In mounted of ${this.timelineID}: `, this.tl)
    this.drawTimeAxis(this.timeAxisObj)
  },
  watch: {
    // NB that CHANGING a property of the prop will NOT cause a re-render!!
    //  i.e., deep: true is NOT working;
    // so, must assign to timeAxisPropObj:  this.timeAxisPropObj = Object.assign({}, this.timeAxisPropObj, {startYear: 1940})
    timeAxisPropObj: {
      deep: true,
      handler: function(newVal) {
        console.log("watch handler fired")
        console.log("newVal: ")
        console.dir(newVal)
        // should be the same:
        // Object.assign(this.timeAxisObj, newVal)
        console.log("this.timeAxisObj: ")
        console.dir(this.timeAxisObj)
        Object.assign(this.timeAxisObj, this.timeAxisPropObj)
        this.drawTimeAxis(this.timeAxisObj)
      }
    }
  },
  methods: {
    drawTimeAxis(tl) {
      console.log("in drawTimeAxis: tl: ")
      console.dir(tl)
      tl.timeScaleFn = d3.scaleLinear()
        .domain([tl.startYear, tl.stopYear])
        .rangeRound([tl.svgSideMargin,
                      tl.svgWidth - tl.svgSideMargin])
        .nice();
      // generate tick values;
      const numTicks = Math.floor((tl.stopYear - tl.startYear)/tl.tickInterval) + 1
      const tickValues = Array(numTicks).fill(tl.startYear).map((start, index) => start + (index * tl.tickInterval))
      // a function which returns the SVG for the axis;
      const timeAxisFn = d3.axisBottom(tl.timeScaleFn)
              .tickValues(tickValues)
              .tickFormat(d3.format(".4"));
              // .tickPadding(tl.timeAxisTickPadding)
              // .tickSize(tl.timeAxisTickSize);
      d3.select(this.rootEl).select(".timeAxisGrp")
          // default position is at top of SVG; move to bottom;
          .attr("transform",
                "translate(0, " + (tl.eraTopMargin + tl.eraHeight +
                                    tl.timeAxisVerticalOffset) + ")")
          .call(timeAxisFn);

      d3.select(this.rootEl).selectAll(".timeAxisGrp line, .timeAxisGrp path")
          .attr("stroke", tl.timeAxisStroke)
          .attr("stroke-width", tl.timeAxisStrokeWidth)
          .attr("fill", "none")
          .attr("shape-rendering", "crispEdges");

      d3.select(this.rootEl).selectAll(".timeAxisGrp text")
          .attr("font-family", tl.timeAxisFontFamily)
          .attr("font-size", tl.timeAxisFontSize)
          .attr("text-rendering", "optimizeLegibility");
    }
  }

}
</script>

<style scoped>
#timeAxisComponent {
  display: inline-block;
  box-sizing: border-box;
  margin: 20px auto;
  padding: 0 10px;
  background-color: bisque;
  border: 3px solid #C11B17;
  overflow-x: auto;
}
svg {
  margin: 0 auto;
}
</style>