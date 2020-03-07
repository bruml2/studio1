<template>
  <div id="app">
    <div id="introbox" style="margin: 20px; padding: 4px; border: 3px solid teal;">
      <h3>This site demonstrates multiple timeline components (in blue borders) on one page. [{{ builddate }}]</h3>
    </div>

    <div id="btns">
      <span>Demonstrating that changes within parent affect the TimelineView component below: &nbsp; &nbsp; </span>
      <button class="button" @click="changeProperty">Change Title Value</button>
      &nbsp; &nbsp;
      <button class="button" @click="addProperty">Add a new property</button>
      &nbsp; &nbsp;
      <button class="button" @click="addEra">Add a new era</button>
    </div>

    <TimelineView timelineID="timelineA" :timeline="timelineA" :tvcWidth="tvcWidth" :showProlog="true" />
    <div style="height: 40px;"></div>

    <TimelineView timelineID="timelineB" :timeline="timelineB" :tvcWidth="tvcWidth" />
    <div style="height: 40px;"></div>

    <TimelineView timelineID="timelineC" :timeline="timelineC" :tvcWidth="tvcWidth" />
    <div style="height: 40px;"></div>

    <div style="padding: 20px 0 0; border: 3px solid green;">
      <span>This is the TimeAxis component used in the UI</span>
      <button @click="changeStartYear" style="margin-left: 20px;">change startYear</button>
      <TimeAxis :timeAxisPropObj="timeAxisPropObj" />
    </div>
    <div style="height: 40px;"></div>
  </div>
</template>

<script>
import TimelineView  from '@/components/TimelineView.vue'
import TimeAxis      from '@/components/TimeAxis.vue'
import { builddate } from './assets/builddate.js'

export default {
  name: 'app',
  components: {
    TimelineView,
    TimeAxis
  },
  data() {
    return {
      builddate: builddate,
      timelineA: {
        fromParent: 'Original value',
        title: "U.S. History: ",
        subtitle: "the 20th century",
        erasArr: [
          {label: "Great War", start: 1914, stop: 1918, bgcolor: "#A9BCF5"},
          {label: "WWII", start: 1939, stop: 1945, bgcolor: "#A9E2F3"},
          {label: "Korean War", start: 1950, stop: 1953, bgcolor: "#D0D1E6"},
          {label: "Vietnam War", start: 1963, stop: 1975,
                  topY: 0.5, height: 0.5, bgcolor: "#FFF8DC"},
          {label: "Gulf War", start: 1990, stop: 1991, bgcolor: "#ECE7F2"},
        ]
      },
      timelineB: {
        "name": "Hebrew Bible Overview Timeline",
        "dbKey": null,
        "title": "Timeline B: Eras and Precipitating Events",
        "subtitle": "",
        "footerHTML": "This is <b>bold</b> and <i>italic</i> footer text.",
        "startYear":      -1100,
        "stopYear":       100,
        "tickInterval":   100,
        "svgSideMargin":  25,
        "features": { "showDatesCB": true,
                      "showAllCB": true,
                      "hideLabelsCB": true,
                      "hasInfoPanels": true },        
        "erasArr": [
          /* start and stop are years; topY(0 to 1) placement of top within
              eraHeight; height is fraction of height(0 to 1); optional:
              voffset is additional distance down for label; */
          {label: "Judges", start: -1100, stop: -1020,
              bgcolor: "#A9BCF5"},
          {label: "United Kingdom", start: -1020, stop: -931,
              bgcolor: "#F5BCA9"},
          {label: "Northern Kingdom (Israel)", start: -931, stop: -722,
              topY: 0, height: 0.7, bgcolor: "#F5A9E1"},
          {label: "Southern Kingdom (Judah)", start: -931, stop: -586,
              topY: 0.7, height: 0.3, bgcolor: "#F5A9BC"},
          {label: "Exile", start: -586, stop: -538,
              bgcolor: "#F78181"},
          {label: "Persian Period", start: -538, stop: -332,
              bgcolor: "#A9BCF5"},
          {label: "Hellenistic Period", start: -332, stop: -168,
              bgcolor: "#A9E2F3"},
          {label: "Maccabean (Hasmonean) Rule", start: -168, stop: -63,
              bgcolor: "#F5A9E1"},
          {label: "Rome: Temple", start: -63, stop: 70,
              bgcolor: "#F5BCA9"}
        ],
        "infoPanelBeginEndText": {
          "-1100": "<p><b>1100 BCE</b> isn't a firm date: by scholarly convention, the Exodus occurred (if at all) about 1200 with Joshua's conquest of Caanan 40 years later.  So, 1100 seems to be a reasonable nominal date for the start of the period of <b>Judges</b>.</p>",
          "-1020": "<p>In <b>1020 BCE</b> (more or less) the monarchy began with the anointment by Samuel of <b>Saul</b> as King (followed by <b>David</b> and <b>Solomon</b>).</p>",
          "-931": "<p>In <b>931 BCE</b>, on the death of <b>Solomon</b>, his son and successor declined to lighten the heavy taxation imposed by his father and the ten northern tribes broke away to become the Kingdom of Israel.  The remaining two tribes (Judah and Benjamin) remained loyal to the Davidic house and formed the southern kingdom, the Kingdom of Judah.</p>",
          "-722": "<p>In <b>722 BCE</b>, Assyria conquered the Northern Kingdom and forced the people to resettle elsewhere.  Many fled to the Southern Kingdom but the others remain unaccounted for.</p>",
          "-586": "<p>In <b>586 BCE</b>, Babylonia under <b>King Nebuchadnezzar II</b> conquered the Southern Kingdom and destroyed the Temple. The elites had been sent into exile in Babylon ten years earlier (-597).</p>",
          "-538": "<p>In <b>539 BCE</b>, the Persians under <b>Cyrus</b> conquered Babylonia and in the following year Cyrus' famous edict gave permission to the Judeans to return to Jerusalem to rebuild their temple.</p>",
          "-332": "<p>In <b>334/332 BCE</b>, <b>Alexander the Great</b> conquered Judaea while passing through on his way to Persia and points east.  When he died ten years later (-323), Judaea became part of the Egyptian empire of the Ptolemies.  In <b>200 BCE</b> it came under the control of the Seleucid Empire.</p>",
          "-168": "<p>In <b>168 BCE</b>, the <b>Maccabean Revolt</b> began. It eventually established the first independent government in over 400 years.</p>",
          "-63": "<p>In <b>63 BCE</b>, the Roman Army under Pompey conquered Judea and in 37 BCE installed <b>Herod the Great</b> as client king; he was a great builder and dramatically enlarged and refurbished the Second Temple (d. 4 BCE).</p>",
          "70": "<p>In <b>70 CE</b>, the Romans ended the First Jewish War (66-70) by sacking Jerusalem and destroying the Temple.</p>"
        }
      },
      timelineC: null, /* fetched from file system during mounted hook */
      timeAxisPropObj: {
        startYear: 1940,
        stopYear: 2000,
        tickInterval: 5,
        svgWidth: 1000,
      },
      tvcWidth: 1302, /* allows for temporary 1px border */
    }
  },
  mounted: function() {
    fetch("bibleoverview.json", {mode: 'no-cors'})
    .then(response => {
       if (!response.ok) { throw new Error("HTTP error " + response.status); }
       return response.json();
    })
    .then(json => {
       this.timelineC = json;
    })
    .catch(function (error) {
       // this.dataError = true;
       throw new Error("fetch error: " + error);
    })
  },
  methods: {
    changeProperty() {
      // changing a value in the timeline prop causes rerender;
      this.timelineA.title = 'Value changed'
    },
    addProperty() {
      // a new property in the timeline does NOT cause a rerender;
      // This DOES NOT WORK!!!
      //    this.timelineA.newProperty = "newPropertyValue"
      // MUST ASSIGN to the prop;
      this.timelineA = Object.assign({}, this.timelineA, {newProperty: "newPropertyValue"})
    },
    addEra() {
      // does adding a new era cause a redrawing of the timeline?
      this.timelineA.erasArr.push({label: "Added era", start: 1922, stop: 1928, bgcolor: "#F5A9F2"})
    },
    changeStartYear() {
      this.timeAxisPropObj = Object.assign({}, this.timeAxisPropObj, {startYear: 1940})
    }
  }
}
</script>

<style>
#app {
  font-family: Palatino, "New Times Roman", Times, serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
#btns {
  margin: 1rem;
  padding: 1rem;
  border: 2px solid teal;
}
#btns .button {
  font-size: 1.2rem;
}
</style>
