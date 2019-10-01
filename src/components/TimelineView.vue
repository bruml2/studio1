<template>
  <div id="timelineViewContainer">
    <div id="prolog">
      <div>This green-bordered prolog containing the properties and values of tl is temporary.</div>
      <ul>
        <li v-for="(value, key) in tl" :key="key">
          <b>{{ key }}:</b> {{ value }}
        </li>
      </ul>
    </div>

    <div id="tlHeader">
      <span id="tlTitle">{{ tl.title }}</span> &nbsp; &nbsp;
      <span id="tiSubtitle">{{ tl.subtitle }}</span>
    </div>
    <div id="tlTimeline">
      <svg id="svg" :width="tl.svgWidth" :height="svgHeight"  xmlns="http://www.w3.org/2000/svg">
        <g id="erasGrp"></g>
        /* goes last to be topmost drawn */
        <g id="timeAxisGrp"></g>
      </svg>
    </div>
    <div id="tlFooter">
      {{ tl.footerText }}
    </div>
  </div>
</template>

<script>
  import * as d3 from 'd3'

  export default {
    props: {
      timeline: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        tl: {
          "name": "defaultTimeline",
          "dbKey": null,
          "title":        "AP United States History",
          "subtitle":     "(twentieth century)",
          "footerText":   "Sample Footer Text",
          "startYear":      1900,
          "stopYear":       2000,
          "tickInterval":   10,
          "svgWidth":       1200,
          "svgSideMargin":  25,
          "eraTopMargin":   30,
          "eraHeight":      300,
          "timeAxisHeight": 50,
          "timeAxisVerticalOffset": 20,
          "timeAxisStroke": "black",
          "timeAxisStrokeWidth": 2,
          "timeAxisFontFamily": "sans-serif",
          "timeAxisFontSize": "13",
          "borderColor":    "#C11B17",
          "bgColor":        "bisque",
          "colorWheel": ["FFF7FB", "ECE7F2", "D0D1E6", "A6BDDB",
                         "74A9CF", "3690C0", "0570B0", "045A8D", "023858"],
          "erasArr": [
            /* start and stop are years; topY(0 to 1) placement of top within
              eraHeight; height is fraction of height(0 to 1); optional:
              voffset is additional distance down for label; */
            {label: "Era Area", start: 1900, stop: 2000,
              topY: 0, height: 1.0, bgcolor: "#FFFFE0"},
            {label: "Great War", start: 1914, stop: 1918,
              topY: 0, height: 1.0, bgcolor: "#A9BCF5"},
            {label: "WWII", start: 1939, stop: 1945,
              topY: 0, height: 1.0, bgcolor: "#A9E2F3"},
          ],

        },
        numRenders: 0
      }
    },
    computed: {
      svgHeight: function () {
        return this.tl.eraTopMargin + 
               this.tl.eraHeight +
               this.tl.timeAxisHeight
      } 
    },
    watch: {
      timeline: function(val) {
        this.tl = Object.assign({}, this.tl, val)
      }
    },
    created: function() {
      // merge prop into this.tl;
      Object.assign(this.tl, this.timeline)
    },
    mounted: function() {
      this.numRenders++
      this.removeEmptyHeaderFooter(this.tl)
      this.renderCircle(this.tl)
      this.drawTimeAxis(this.tl) /* need tl.timeScaleFn() */
      this.drawEras(this.tl)
    },
    methods: {
      removeEmptyHeaderFooter(tl) {
        if (tl.title.trim().length + 
             tl.subtitle.trim().length === 0) {
          document.getElementById("tlHeader").remove()
        }
        if (tl.footerText.trim().length === 0) {
          document.getElementById("tlFooter").remove()
        }
      },
      renderCircle(tl) {
        d3.select('#svg')
          .append("circle")
          .attr("cx", 1170).attr("cy", 40).attr("r", 20).style("fill", "red")
        tl.new = 'added by renderCircle()'
      },
      drawTimeAxis(tl) {
        // get tick values;
        const numTicks = Math.floor((tl.stopYear - tl.startYear)/tl.tickInterval) + 1
        const tickValues = Array(numTicks).fill(tl.startYear).map((start, index) => start + (index * tl.tickInterval))
        // a function which converts a year to an x coordinate;
        tl.timeScaleFn = d3.scaleLinear()
            .domain([tl.startYear, tl.stopYear])
            .rangeRound([tl.svgSideMargin,
                         tl.svgWidth - tl.svgSideMargin])
            .nice();
        // a function which returns the SVG for the axis;
        const timeAxis = d3.axisBottom(tl.timeScaleFn)
                .tickValues(tickValues)
                .tickFormat(d3.format(".4"));
                // .tickPadding(tl.timeAxisTickPadding)
                // .tickSize(tl.timeAxisTickSize);
        d3.select("#timeAxisGrp")
            // default position is at top of SVG; move to bottom;
            .attr("transform",
                  "translate(0, " + (tl.eraTopMargin + tl.eraHeight +
                                     tl.timeAxisVerticalOffset) + ")")
            .call(timeAxis);

        d3.selectAll("#timeAxisGrp line, #timeAxisGrp path")
            .attr("stroke", tl.timeAxisStroke)
            .attr("stroke-width", tl.timeAxisStrokeWidth)
            .attr("fill", "none")
            .attr("shape-rendering", "crispEdges");

        d3.selectAll("#timeAxisGrp text")
            .attr("font-family", tl.timeAxisFontFamily)
            .attr("font-size", tl.timeAxisFontSize)
            .attr("text-rendering", "optimizeLegibility");
      },
      drawEras(tl) {
        /* typical era object: {label: "Great War", start: 1914, stop: 1918,
              topY: 0, height: 1.0, bgcolor: "#A9BCF5"} */
        d3.select("#erasGrp").selectAll("rect").data(tl.erasArr).enter()
          // one rect for each object in the array;
          .append("rect")
            // the id is the label, e.g., "UnitedKingdom" (alphanum only);
            .attr("id", function(d){ return d.label.replace(/\W/g, "") })
            .attr("x", function(d){ return tl.timeScaleFn(d.start) })
            .attr("y", function(d){ return tl.eraTopMargin + (d.topY * tl.eraHeight) })
            // slightly rounded corners;
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", function(d){ return tl.timeScaleFn(d.stop) -
                                              tl.timeScaleFn(d.start) })
            .attr("height", function(d){ return d.height * tl.eraHeight })
            .style("fill", function(d){ return d.bgcolor })
            .style("stroke-width", 1)
            .style("stroke", "black")
            // show the two dates and the infoPanel;
            .on("mouseover", function(){
            })
            .on("mouseout", function(){
            });

      }
    }    
  }
</script>

<style>
/* the prolog is temporary */
#prolog {
  padding: 8px 15px;
  background: wheat;
  border: 8px solid palegreen;
}
#prolog div {
  font-weight: bold;

}
#prolog ul {
  text-align: left;
  columns: 3 auto;
}
/* this is the root of the final component:
   it's horiz-centered within its parent and
   scrolls if parent is too narrow;
*/
#timelineViewContainer {
  font-family: Palatino, Times, "Times New Roman", Georgia, serif;
  box-sizing: border-box;
  width: 1300px;
  margin: 0 auto;
  overflow-x: auto;
  border: 2px solid blue;
}
#tlHeader, #tlTimeline, #tlFooter {
  position: relative; /* parent container for positioning */
  box-sizing: border-box;
  width: 96%;
  margin: 20px auto;
  border: 3px solid #C11B17;
}
#tlHeader, #tlFooter {
  padding: 15px 30px;
}
#tlHeader {
  font-weight: bold;
  text-align: left;
}
#tlTitle {
  font-size: 24px;
  color: #0404B4;
}
#tlSubtitle {
  font-size: 18px;
}
#tlTimeline {
  background-color: bisque;
  overflow-x: auto;
}
</style>