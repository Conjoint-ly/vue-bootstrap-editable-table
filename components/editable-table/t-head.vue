<template>
  <div class="tr th">
    <t-head-cell
      v-for="field in fields"
      :key="field.name"
      :field="field"
      @delete="onClickDelete"
      @resize="$emit('resize-col', { name: field.name, width: $event })"
      @resize-stop="$emit('resize-col-stop')"
      @drag="draggingColumn = $event"
      @drop="moveColumn($event)"
      @rename="$emit('rename-col', {name: field.name, caption: $event})"
    />

    <t-data
      class="td__func-buttons-wrapper"
      @dragover.prevent
      @drop="moveLastColumn"
    >
      <b-button class="px-2 py-1" variant="link" @click="showModal = true" title="Add Element">
        <b-icon icon="plus" font-scale="2" />
      </b-button>
    </t-data>

    <add-column-modal
      v-if="showModal"
      :column-types="columnTypes"
      :form="newColumnData"
      @submit="addColumn"
      @close="showModal = false"
    />
  </div>
</template>

<script>
import { getFieldIndex } from "../../helpers/fields";
import tData from './t-data.vue';
import AddColumnModal from '../add-column-modal';
import THeadCell from "./t-head-cell";

export default {
  name: 't-head',
  components: {
    THeadCell,
    tData,
    AddColumnModal,
  },
  props: {
    fields: { type: Array, required: true },
  },
  data () {
    return {
      showModal: false,
      draggingColumn: null,
    }
  },
  inject: ['columnTypes'],
  computed: {
    newColumnData() {
      return {
        type: 'text',
        name: `Column ${this.fields.length + 1}`
      }
    }
  },
  methods: {
    onClickDelete(fieldName) {
      this.$emit('del-col', fieldName);
    },
    addColumn (column) {
      this.$emit('add-col', column);
    },
    moveColumn (target) {
      if (!this.draggingColumn) return;

      const index = getFieldIndex(this.fields, target);
      const currentIndex = getFieldIndex(this.fields, this.draggingColumn);
      if (index === -1 || currentIndex === -1) return;
      if (index === 0 || currentIndex === 0) return;// not allowed for first column

      const nextIndex = index - (currentIndex < index ? 1 : 0);
      if (nextIndex === currentIndex) return;

      this.$emit('move-col', {
        name: this.draggingColumn,
        index: nextIndex,
      });
    },
    moveLastColumn () {
      if (!this.draggingColumn) return;

      const currentIndex = getFieldIndex(this.fields, this.draggingColumn);
      if (currentIndex === -1) return;

      this.$emit('move-col', {
        name: this.draggingColumn,
        index: this.fields.length,
      });
    }
  }
}
</script>

<style>
  .th > .td {
    white-space: normal;
    justify-content: center;
    border-top: 1px solid #d0d0d0;
  }

  .td__func-buttons-wrapper {
    background-color: #dee2e6;
  }
</style>
