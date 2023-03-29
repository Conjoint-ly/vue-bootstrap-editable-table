<template>
  <div class="t-editable-label" @click="setActive">
    <span v-if="!active">{{value}}</span>
    <input
      v-else
      ref="input"
      v-model="label"
      @focusout="setInactive"
      @keyup.enter="active = false"
      
    />
  </div>
</template>

<script>
  export default {
    name: "t-editable-label",
    props: {
      value: {type: String, default: ''},
    },
    data() {
      return {
        label: this.value,
        active: false,
      };
    },
    methods: {
      async setActive() {
        this.active = true;
        await this.$nextTick();
        this.$refs.input.focus();
      },
      setInactive() {
        this.active = false;
        if (this.label === this.value) return;
        this.$emit('input', this.label);
      },
    }
  }
</script>

<style>
  .t-editable-label {
    max-width: 100%;
    border-bottom: 1px dashed black;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .t-editable-label:hover {
    background: #ddd;
  }
  .t-editable-label input{
    width: 100%;
    padding: 0;
    background: transparent;
    border: none;
  }
  .t-editable-label input:focus {
    outline: none;
  }
</style>
