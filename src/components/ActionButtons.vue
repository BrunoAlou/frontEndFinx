<template>
    <div>
      <b-button size="sm" variant="outline-light" @click="editAgendamento" class="btn-custom">
        Editar
      </b-button>
      <b-button size="sm" variant="outline-light" @click="deleteAgendamento" class="btn-custom">
        Excluir
      </b-button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      id: {
        type: Number,
        required: true
      }
    },
    methods: {
      editAgendamento() {
        this.$emit('edit', this.id);
      },
      deleteAgendamento() {
        this.$emit('delete', this.id);
      }
    }
  };
  </script>