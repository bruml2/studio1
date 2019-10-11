<template>
  <div class="timelineViewContainer"
       :style="{ width: tvcWidth + 'px' }"
  >
    <div class="prolog"> <!-- this prolog is temporary: dev only -->
      <div>This green-bordered prolog containing the properties and values of tl is temporary.</div>
      <ul>
        <li v-for="(value, key) in tl" :key="key">
          <b>{{ key }}:</b> {{ value }}
        </li>
      </ul>
    </div>

    <div class="tvHeader">
      <span class="title">{{ tl.title }}</span> &nbsp; &nbsp;
      <span class="subtitle">{{ tl.subtitle }}</span>
    </div>
    <div class="tvTimeline">
      <!--
      <svg class="svg" :width="tl.svgWidth" :height="svgHeight"  xmlns="http://www.w3.org/2000/svg">
      svg: the height of the svg determines the height of the tvTimeline
      -->
      <svg class="svg" width="1200px" height="420px" xmlns="http://www.w3.org/2000/svg">
        <g class="erasGrp"></g>
        /* goes last to be topmost drawn */
        <g class="timeAxisGrp"></g>
      </svg>
      <!-- class="eraLabel" divs will be added here -->
    </div>
    <div class="tvFooter">
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
      },
      // used in computed property 'styleObject';
      tvcWidth: {
        type: Number,
        required: false,
        default: 1300
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
          // next 2 widths are default;
          "tvTimelineClientWidth": 1268,
          "svgWidth":       1228,
          "svgSideMargin":  20,
          "eraTopMargin":   30,
          // eraHeight is default;
          "eraHeight":      316, 
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
            /* {label: "Era Area", start: 1900, stop: 2000, bgcolor: "#FFFFE0"}, */
            {label: "Great War", start: 1914, stop: 1918, bgcolor: "#A9BCF5"},
            {label: "WWII", start: 1939, stop: 1945, bgcolor: "#A9E2F3"},
            {label: "Korean War", start: 1950, stop: 1953, bgcolor: "#D0D1E6"},
            {label: "Vietnam War", start: 1963, stop: 1975,
              topY: 0.5, height: 0.5, bgcolor: "#FFF8DC"},
            {label: "Gulf War", start: 1990, stop: 1991, bgcolor: "#ECE7F2"},
          ],
          "eraLabelsFontSize": "16px",
        },
        componentEl: null,
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
      timeline: function(newVal) {
      // merge new value of prop into this.tl; note that an assignment must be
      // made to this.tl; having this.tl as the target object (1st param) does
      // not cause a re-render.
      this.tl = Object.assign({}, this.tl, newVal)
      this.drawTimeline()
      }
    },
    created: function() {
      // merge prop into this.tl as target;
      Object.assign(this.tl, this.timeline)
    },
    mounted: function() {
      /* do I need to wrap this in this.$nextTick()?? */
      let numComponents = document.getElementsByClassName("timelineViewContainer").length
      if (numComponents == 1) {
        this.componentEl = document.getElementsByClassName("timelineViewContainer")[0]
      } else { throw new Error("multiple components")}
      this.drawTimeline(this.tl)
    },
    methods: {
      removeEmptyHeaderFooter(tl) {
        if (tl.title.trim().length + 
             tl.subtitle.trim().length === 0) {
          this.componentEl.getElementsByClassName("tvHeader")[0].remove()
        }
        if (tl.footerText.trim().length === 0) {
          this.componentEl.getElementsByClassName("tvFooter")[0].remove()
        }
      },
      drawTimeline() {
        this.removeEmptyHeaderFooter(this.tl)
        this.initDimensions(this.tl)
        this.normalizeEras(this.tl)
        this.drawTimeAxis(this.tl) /* need tl.timeScaleFn() */
        this.drawEras(this.tl)
        // console.log("before labels")
        this.drawEraLabelsAsHTML(this.tl)
      },
      initDimensions(tl) {
        const tvTimelineClientWidth = this.componentEl.getElementsByClassName("tvTimeline")[0].clientWidth
        // other calculations depend on this tl.svgWidth value;
        tl.svgWidth = tvTimelineClientWidth - (2 * tl.svgSideMargin)
        const svgEl = this.componentEl.getElementsByClassName("svg")[0]
        console.log("tvTimeline clientWidth is: " + tvTimelineClientWidth)
        console.log("svg width is: " + svgEl.clientWidth)
        console.log("svg height is: " + svgEl.clientHeight)

        svgEl.setAttribute("width", tl.svgWidth)
        svgEl.setAttribute("height", this.svgHeight)
        console.log("new svg width is: " + svgEl.clientWidth)
        console.log("new svg height is: " + svgEl.clientHeight)
      },
      normalizeEras(tl) {
        // add topY, height, and voffset defaults;
        tl.erasArr = tl.erasArr.map(
          obj => Object.assign({}, {topY:0,height:1,voffset:0}, obj)
        )
        tl.erasArr.forEach( obj => { if (Object.keys(obj).length !== 7) throw new Error("bad key count in era") })
      },
      drawTimeAxis(tl) {
        // generate tick values;
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
        d3.select(".timeAxisGrp")
            // default position is at top of SVG; move to bottom;
            .attr("transform",
                  "translate(0, " + (tl.eraTopMargin + tl.eraHeight +
                                     tl.timeAxisVerticalOffset) + ")")
            .call(timeAxis);

        d3.selectAll(".timeAxisGrp line, .timeAxisGrp path")
            .attr("stroke", tl.timeAxisStroke)
            .attr("stroke-width", tl.timeAxisStrokeWidth)
            .attr("fill", "none")
            .attr("shape-rendering", "crispEdges");

        d3.selectAll(".timeAxisGrp text")
            .attr("font-family", tl.timeAxisFontFamily)
            .attr("font-size", tl.timeAxisFontSize)
            .attr("text-rendering", "optimizeLegibility");
      },
      drawEras(tl) {
        /* typical era object: {label: "Great War", start: 1914, stop: 1918,
              topY: 0, height: 1.0, bgcolor: "#A9BCF5", voffset: 0} */
        d3.select(".erasGrp").selectAll("rect").data(tl.erasArr).enter()
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
      },
      drawEraLabelsAsHTML(tl) {
        // const eraLabelsFontSize = "16px"; // add to tl;
        // eraLabels as **HTML divs** to take advantage of text wrapping;
        // if widest word is wider than the era itself, then it overflows;
        // in such a case, we want to make the <div> wide enough and place
        // in evenly straddling the era.
        // create hidden dummy span;
        const widthSpan = d3.select("body")
            .append("span")
            .attr("class", "overflowSpan")
            .style("position", "absolute")
            .style("visibility", "hidden");
        // nested function ============================== 
        const getLeftAndStoreWidthVoffset = function(d) {
          // does widest word overflow? Sort by length descending;
          let words = d.label.split(/ /);
          let longestWord = words.sort((a,b) => b.length - a.length)[0];
          // console.log("Longest: " + longestWord);
          // put the longest word into the span;
          widthSpan.text(longestWord);
          // console.log("widthSpan clientWidth: ", widthSpan.property("clientWidth"))
          let longestWordWidth = widthSpan.property("clientWidth")
          console.log("Width of \"" + longestWord + "\": " + longestWordWidth);
          let widthOfEra = tl.timeScaleFn(d.stop) - tl.timeScaleFn(d.start);
          console.log("Width of " + d.label + " era: " + widthOfEra);
          if (widthOfEra > longestWordWidth) {
            /* If the longest word will fit in era, set width to that of era
               and position div at start year; */
            d.width = widthOfEra
            return tl.timeScaleFn(d.start) + 20 + "px";
          } else {
            /* Else, div has width of longest word and is positioned to the
               left of start year; */
            d.width = longestWordWidth + 2;
            // left is to the left of start by half of excess width + 2;
            let left = tl.timeScaleFn(d.start) + 20 - 
                            ((longestWordWidth - widthOfEra + 2) / 2);
            console.log("  startYearX: " + (tl.timeScaleFn(d.start) + tl.svgSideMargin))
            console.log("  left: " + left);
            return left + "px";
          }
        }; // end of function def;
        //======================================
        d3.select(".tvTimeline")
            .selectAll("div")
            .data(tl.erasArr)
            .enter()
          .append("div")
            .attr("class", "eraLabel")
            .attr("id", d => d.label.replace(/\W/g, "") + "Label")
            .style("left", d => getLeftAndStoreWidthVoffset(d))
            .style("top", d => tl.eraTopMargin + 10 + (d.topY * tl.eraHeight) + d.voffset + "px")
            .style("width", d => d.width + "px")
            .text(d => d.label)
            .style("font-size", this.eraLabelsFontSize)
        widthSpan.remove();
      },
    }    
  }
</script>

<style>
/* the prolog is temporary */
.prolog {
  padding: 8px 15px;
  background: wheat;
  border: 8px solid palegreen;
}
.prolog div {
  font-weight: bold;

}
.prolog ul {
  text-align: left;
  columns: 3 auto;
}
/* this is the root of the final component: it's
   1300 wide by default or set by parent with a prop;
   it's horiz-centered within a too-wide parent and
   scrolls if parent is too narrow;
*/
.timelineViewContainer {
  font-family: Palatino, Times, "Times New Roman", Georgia, serif;
  box-sizing: border-box;
  margin: 0 auto;
  overflow-x: auto;
  border: 1px solid blue;  /* temp */
}
.tvHeader, .tvTimeline, .tvFooter {
  position: relative; /* parent container for positioning */
  box-sizing: border-box;
  width: 98%;
  margin: 20px auto;
  border: 3px solid #C11B17;
}
.tvHeader, .tvFooter {
  padding: 15px 30px;
  text-align: left;
}
.tvHeader {
  font-weight: bold;
}
.title {
  font-size: 24px;
  color: #0404B4;
}
.subtitle {
  font-size: 18px;
}
.tvTimeline {
  background-color: bisque;
  overflow-x: auto;
}
svg {
  margin: 0 auto;
}
.eraLabel {
  position: absolute;
  z-index: 1;
  text-align: center;
  font-size: 16px; /* default */
  color: black;
  pointer-events: none;
}
</style>