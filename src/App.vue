<template>
  <div id="app">
    <HelloWorld msg="The Studio1 App: TimelineView component is in the blue border below!" />
    <TimelineView :timeline="timeline" :tvcWidth="tvcWidth"/>
    <div id="btns">
      <span>Demonstrating that changes within parent affect the TimelineView component: &nbsp; &nbsp; </span>
      <button @click="changeProperty">Change Title Value</button>
      &nbsp; &nbsp;
      <button @click="addProperty">Add a new property</button>
      &nbsp; &nbsp;
      <button @click="addEra">Add a new era</button>
    </div>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import TimelineView   from '@/components/TimelineView.vue'

export default {
  name: 'app',
  components: {
    HelloWorld,
    TimelineView
  },
  data() {
    return {
      timeline: { fromParent: 'Original value',
                  title: "AP European History",
                  subtitle: "(not the default value: from parent via prop)",
                  erasArr: [
                    {label: "Great War", start: 1914, stop: 1918, bgcolor: "#A9BCF5"},
                    {label: "WWII", start: 1939, stop: 1945, bgcolor: "#A9E2F3"},
                    {label: "Korean War", start: 1950, stop: 1953, bgcolor: "#D0D1E6"},
                    {label: "Vietnam War", start: 1963, stop: 1975,
                            topY: 0.5, height: 0.5, bgcolor: "#FFF8DC"},
                    {label: "Gulf War", start: 1990, stop: 1991, bgcolor: "#ECE7F2"},
                  ]
      },
      tvcWidth: 1302 /* allows for temporary 1px border */
    }
  },
  methods: {
    changeProperty() {
      // changing a value in the timeline obj causes rerender;
      // this.timeline.title = 'Value changed'
      this.timeline = Object.assign({}, this.timeline, {title: "Value changed"})
    },
    addProperty() {
      // a new property in the timeline causes rerender;
      this.timeline = Object.assign({}, this.timeline, {awesomeMentor: "Ben"})
    },
    addEra() {
      // does adding a new era cause a redrawing of the timeline?
      this.timeline.erasArr.push({label: "Added era", start: 1922, stop: 1928, bgcolor: "#F5A9F2"})
      // is this necessary?
      this.timeline = Object.assign({}, this.timeline)  
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
#btns button {
  font-size: 1.2rem;
}
</style>
