<template>
  <div>
    <ol>
      <li v-for="(value, idx) in tickValues" :key="idx"> {{ value }} </li>
    </ol>
  </div>
</template>

<script>
  import getTickValueMixin from "../mixins/getTickValuesMI.js"

  export default {
    name: "MixinTest",
    mixins: [getTickValueMixin],
    data() {
      return {
        tickValues: [11,12,13]
      }
    },
    mounted() {
      this.tickValues = this.getTickValues(1900,1950,10)
    }
  }
</script>

<style scoped>
li {
  text-align: left;
}
</style>