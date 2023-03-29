<template>
  <small-button class="move-button" v-bind="$attrs" v-on="$listeners" title="Move element">
    <b-icon icon="arrows-move" />
  </small-button>
</template>

<script>
  import SmallButton from "./small-button";

  export default {
    name: "move-button",
    components: {SmallButton}
  }
</script>

<style scoped>
  .move-button:active {
    cursor: grab;
  }
</style>
