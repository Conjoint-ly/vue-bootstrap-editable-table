<template>
  <div class="table-wrapper">
    <div class="table">
      <t-head
        class="table-header"
        :fields="tempFields"
        @add-col="$emit('add-col', $event)"
        @del-col="$emit('del-col', $event)"
        @rename-col="$emit('rename-col', $event)"
        @resize-col="resizeColumn"
        @resize-col-stop="submitColumnResizing"
        @move-col="$emit('move-col', $event)"
      />

      <div class="table-body-wrapper" :style="{height}">
        <div class="table-body" v-click-outside="onClickOutside">
          <t-row
            v-for="(row, i) in rows" :key="String(row.name).replace(/ /g, '_')"
            :fields="tempFields"
            :value="row"
            :editable-cell="editableCell && row.name === editableCell.row ? editableCell : null"
            @switch-edit-mode="switchEditMode"
            @del-row="onDeleteRow(row.name)"
            @change="onChangeValueInCell"
            @validate="validateCell"
            @dragstart="draggingRow = i"
            @drop="moveRow(i)"
            @paste-csv="pasteCSV"
          />
        </div>

        <t-total
          :columns="columns"
          @change-aggregating="$emit('change-aggregating', $event)"
        />

        <t-add-row
          :fields="fields"
          @add-row="$emit('add-row')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import deepCopy from 'deepcopy';
import { getField, getFieldIndex } from "../../helpers/fields";
import tAddRow from './t-add-row.vue'
import tTotal from './t-total.vue'
import tHead from './t-head.vue'
import tRow from './t-row.vue'
import ColumnType from "./column-types/ColumnType";

export default {
  name: 'editable-table',
  components: {
    tAddRow,
    tTotal,
    tHead,
    tRow
  },
  props: {
    fields: { type: Array, required: true },
    rows: { type: Array, required: true },
    columnTypes: { type: Array, default: () => [] },
    height: { type: String, default: null },
  },
  data() {
    return {
      tempFields: deepCopy(this.fields),
      editableCell: {
        field: undefined,
        row: undefined,
        isValid: true
      },
      resizingProps: null,
      draggingRow: null,
    }
  },
  computed: {
    columns () {
      return this.tempFields.map((field) => ({
        ...field,
        columnType: this.getColumnType(field.type),
        values: this.rows.map(row => row[field.name]),
      }));
    }
  },
  methods: {
    validateCell({ fieldName, rowName, value }) {
      const field = this.getFieldByName(fieldName);
      const column = this.getColumnType(field.type);

      if (field.unique && this.rows.some(row => row.name !== rowName && row[fieldName] === value)) {
        this.editableCell.isValid = false;
        return;
      }

      this.editableCell.isValid = column.validate(value);
    },
    moveRow(rowIndex) {
      if (this.draggingRow === rowIndex) return;
      this.$emit('move-row', { from: this.draggingRow, to: rowIndex });
    },
    switchEditMode({ fieldName, rowName }) {
      // console.log(`Cell clicked fieldName:${fieldName}, rowName:${rowName}`);
      if (!this.editableCell.isValid) return;

      if (this.editableCell.field === fieldName && this.editableCell.row === rowName) {
        this.editableCell.field = null;
        this.editableCell.row = null;
      } else {
        this.editableCell.field = fieldName;
        this.editableCell.row = rowName;
      }

    },
    onDeleteRow(rowName) {
      this.$emit('del-row', rowName);
    },
    onChangeValueInCell(payload) {
      this.$emit('change', payload);
      this.unEditable();
    },
    onClickOutside(event) {
      this.unEditable();
    },
    unEditable() {
      if (!this.editableCell.isValid) return;

      this.editableCell.field = undefined;
      this.editableCell.row = undefined;
    },
    resizeColumn ({ name, width }) {
      this.resizingProps = { name, width };
      const tempField = getField(this.tempFields, name);
      tempField.width = width;
    },
    pasteCSV ({ fieldName, rowName, data }) {
      const iterate = (table, csv, name, callback) => {
        const rowIndex = getFieldIndex(table, name);
        for (let iCSV = 0; iCSV < csv.length; iCSV ++) {
          const iTable = rowIndex + iCSV;
          callback(iTable, iCSV)
        }
      };

      const updatedRows = [];

      iterate(this.rows, data, rowName, (iRows, yCSV) => {
        const updatedRow = { name: this.rows[iRows] && this.rows[iRows].name };
        updatedRows.push(updatedRow);
        iterate(this.columns, data[yCSV], fieldName, (iFields, xCSV) => {
          if (iFields >= this.columns.length) return;

          const column = this.columns[iFields];
          const csvValue = data[yCSV][xCSV];
          const value = column.columnType.convertStringToValue(csvValue);
          updatedRow[column.name] = value;
        });
      });
      console.log({ updatedRows })

      this.$emit('update-cells', updatedRows);
    },
    submitColumnResizing () {
      if (!this.resizingProps) return;
      this.$emit('resize-col', this.resizingProps);
    },
    getFieldByName (fieldName) {
      return this.fields.find(field => field.name === fieldName);
    },
    getColumnType (type) {
      return this.columnTypes.find(columnType => columnType.type === type);
    },
    getCellComponent(type) {
      const columnType = this.getColumnType(type);
      return (columnType || ColumnType).cell;
    }
  },
  provide() {
    return {
      columnTypes: this.columnTypes,
      getColumnType: this.getColumnType,
      getCellComponent: this.getCellComponent,
    };
  },
  watch: {
    fields: {
      handler () {
        this.tempFields = deepCopy(this.fields);
      },
      deep: true,
    },
  }
}
</script>

<style>
  .table-wrapper {
    padding: 2rem 0;
    position: relative;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    overflow: auto;
  }

  .table-body-wrapper,
  .table-header {
    padding-left: 50px;
  }

  .table {
    /* structure */
    width: fit-content;
    height: 100%;
    /* design */
    font-family: Arial;
    font-size: 1rem;
    margin: 0;
    line-height: 1.5;
    justify-content: center;
    text-align: center;
  }

  .td .btn:focus, .btn-focus {
    box-shadow: none;
  }

  .td:last-child {
    width: 100px
  }

</style>
