<template>
  <div class="tr">
    <t-data
      v-for="field in fields"
      :key="field.name"
      :width="field.width"
      :empty="field.name !== 'name'"
    >
      <b-button
        v-if="field.name === 'name'"
        class="text-decoration-none"
        size="sm"
        variant="link"
        @click="$emit('add-row')"
        title="Add element"
      >
        <b-icon icon="plus" font-scale="2" />
      </b-button>
    </t-data>

    <t-data empty>
    </t-data>
  </div>
</template>

<script>
import tData from './t-data.vue'

export default {
  name: 't-add-row',
  components: {
    tData
  },
  props: {
    fields: { type: Array, required: true }
  }
}
</script>
