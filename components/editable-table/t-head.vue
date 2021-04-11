<template>
  <draggable
    tag="div"
    :list="fields"
    class="tr th"
    handle="#dragElement"
    @end="onEndDrag($event)"
  >
    <t-head-cell
      v-for="field in fields"
      :key="field.name"
      :field="field"
      @delete="onClickDelete"
      @resize="$emit('resize-col', { name: field.name, width: $event })"
      @resize-stop="$emit('resize-col-stop')"
    />

    <t-data
      class="td__func-buttons-wrapper"
      @dragover.prevent
      @drop="moveLastColumn"
    >
      <b-button class="px-2 py-1" variant="link" @click="showModal = true">
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
  </draggable>
</template>

<script>
import { getFieldIndex } from "../../helpers/fields";
import tData from './t-data.vue';
import AddColumnModal from '../add-column-modal';
import THeadCell from "./t-head-cell";
import draggable from 'vuedraggable';

export default {
  name: 't-head',
  components: {
    THeadCell,
    tData,
    AddColumnModal,
    draggable
  },
  props: {
    fields: { type: Array, required: true },
  },
  data () {
    return {
      showModal: false,
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
    arrayMove (arr, old_index, new_index) {
      if (new_index >= arr.length) {
        let k = new_index - arr.length + 1;
        while (k--) {
          arr.push(undefined);
        }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
      return arr;
    },
    onEndDrag(e) {
      let newIndex = 1;

      if (e.newIndex === 0) {
        this.arrayMove(this.fields, 0, 1);
      } else {
        newIndex = e.newIndex;
      }

      this.$emit('move-col', {
        name: e.item.id,
        index: newIndex,
      });
    },
    onClickDelete(fieldName) {
      this.$emit('del-col', fieldName);
    },
    addColumn (column) {
      this.$emit('add-col', column);
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
  .th {
    display: none;
    font-weight: 700;
  }

  .th > .td {
    white-space: normal;
    justify-content: center;
    border-top: 1px solid #d0d0d0;
  }

  .td__func-buttons-wrapper {
    background-color: #dee2e6;
  }
</style>
