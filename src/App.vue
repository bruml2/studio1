<template>
  <div id="app">
    <HelloWorld msg="The Studio1 App: TimelineView component is in the blue border below!" />
    <TimelineView :timeline="timeline" :tvcWidth="tvcWidth"/>
    <div id="btns">
      <button @click="changeProperty">Change Property Value</button>
      &nbsp; &nbsp;
      <button @click="addProperty">Add new property</button>
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
                  subtitle: "(from parent via prop)" },
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
      this.timeline = Object.assign({}, this.timeline, {awesomeDeveloper: 'Beardsley'})
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
