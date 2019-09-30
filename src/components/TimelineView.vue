<template>
  <div id="timelineViewContainer">
    <div id="prolog">
      <div>The TimelineView component has been rendered <span style="color: red">{{ renderCount }}</span> times.</div>
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
        <g id="eras"></g>
        /* goes last to be topmost drawn */
        <g id="timeAxis"></g>
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
          "tickInterval":   20,
          "svgWidth":       1200,
          "svgSideMargin":  25,
          "eraTopMargin":   30,
          "eraHeight":      300,
          "timeAxisHeight": 50,
          "borderColor":    "#C11B17",
          "bgColor":        "bisque",
        },
        renderCount: 0
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
        Object.assign(this.tl, val)
      }
    },
    created: function() {
      // merge prop into this.tl;
      Object.assign(this.tl, this.timeline)
    },
    mounted: function() {
      this.removeEmptyHeaderFooter(this.tl)
    },
    methods: {
      removeEmptyHeaderFooter(tl) {
        if (tl.title.trim().length + 
             tl.subtitle.trim().length === 0) {
          // eslint-disable-next-line
          console.log("header removed")
          document.getElementById("tlHeader").remove()
        }
        if (tl.footerText.trim().length === 0) {
          // eslint-disable-next-line
          console.log("footer removed")
          document.getElementById("tlFooter").remove()
        }
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