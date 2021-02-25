<template>
  <t-data
    :class="[
      't-head-cell',
       readyToResize && 't-head-cell--resizing'
    ]"
    :title="capitalize(field.type)"
    :width="field.width"
    :id="field.name"
  >

    <div
      v-if="field.name !== 'name'"
      class="t-head-func-buttons-wrapper"
    >
      <b-button
        class="t-head-cell__move"
        variant="link"
        id="dragElement"
      >
        <b-icon icon="arrows-move" />
      </b-button>

      <b-button
        class="t-head-cell__delete"
        variant="link"
        @click="$emit('delete', field.name)"
      >
        <b-icon icon="x" />
      </b-button>
    </div>

    <font-awesome-icon :icon="['fas', icons[field.type]]" />

    &nbsp;

    {{field.caption}}
  </t-data>
</template>

<script>
  import tData from './t-data.vue';
  import { capitalize } from "../../helpers";

  export default {
    name: "t-head-cell",
    components: {
      tData,
    },
    props: {
      field: Object,
    },
    data () {
      return {
        readyToResize: false,
        resizingPosition: null,
        icons: {
          text: 'align-left',
          image: 'image',
          number: 'calculator',
          date: 'calendar-day',
          percent: 'percent',
          json: 'code',
        }
      }
    },
    methods: {
      capitalize(text) {
        return capitalize(text);
      },
      onMouseDown (e) {
        if (this.readyToResize) {
          this.resizingPosition = e.clientX - this.field.width;
        }
      },
      onMouseMove (e) {
        if (this.resizingPosition) {
          this.$emit('resize', e.clientX - this.resizingPosition);
        } else {
          this.calcReadyToResize(e);
        }
      },
      onMouseUp () {
        if (!this.resizingPosition) return;
        this.resizingPosition = null;
        this.$emit('resize-stop');
      },
      calcReadyToResize (e) {
        const bounds = e.target.getBoundingClientRect();
        this.readyToResize = bounds.right - e.clientX < 5;
      },
    },
    mounted () {
      this.$el.addEventListener('mousedown', this.onMouseDown);
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);
    },
    beforeDestroy() {
      this.$el.removeEventListener('mousedown', this.onMouseDown);
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
    },
  }
</script>

<style>
  .t-head-cell--resizing {
    cursor: col-resize;
  }

  .t-head-cell {
    background-color: #dee2e6;
  }

  .t-head-func-buttons-wrapper {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 30px;
    justify-content: space-around;
    align-items: center;
  }

  .t-head-cell__delete, .t-head-cell__move {
    padding: 0;
    width: 20px;
    height: 20px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .t-head-cell__delete:hover, .t-head-cell__move:hover {
    background-color: #bdbcbc;
  }

  .t-head-cell__move:active {
    cursor: grab;
  }

  .t-head-cell:hover .t-head-func-buttons-wrapper {
    display: flex;
  }
</style>
