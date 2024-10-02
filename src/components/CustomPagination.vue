<template>
  <div class="pagination">
    <div class="items-per-page">
      <label for="itemsCount">Itens por página:</label>
      <select id="itemsCount" :value="selectedItemsCountLocal" @change="updateItemsPerPage($event.target.value)">
        <option v-for="count in itemsCounts" :key="count" :value="count">{{ count }}</option>
      </select>
    </div>

    <b-button-group>
      <b-button @click="previousPage" :disabled="currentPage === 1">Anterior</b-button>
      <b-button disabled>Página {{ currentPage }} de {{ totalPages }}</b-button>
      <b-button @click="nextPage" :disabled="currentPage === totalPages">Próxima</b-button>
    </b-button-group>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    },
    selectedItemsCount: {
      type: Number,
      default: Number(localStorage.getItem('itensPorPagina')) || 5
    }
  },
  data() {
    return {
      itemsCounts: [1, 5, 10, 50],
      selectedItemsCountLocal: this.selectedItemsCount
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.selectedItemsCountLocal);
    }
  },
  methods: {
    previousPage() {
      if (this.currentPage > 1) {
        this.$emit('page-changed', this.currentPage - 1);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.$emit('page-changed', this.currentPage + 1);
      }
    },
    updateItemsPerPage(newCount) {
      this.selectedItemsCountLocal = Number(newCount);
      localStorage.setItem('itensPorPagina', this.selectedItemsCountLocal);
      this.$emit('items-per-page-changed', this.selectedItemsCountLocal);
    }
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-secondary :hover {
  color: #1496E6;
}
</style>
