<template>
  <b-row class="mb-4">
    <b-col cols="12" md="6">
      <b-form-group label="Filtrar por Médico:" label-for="medico">
        <b-form-input v-model="searchMedico" placeholder="Digite o nome do médico" />
        <b-form-select id="medico" v-model="selectedMedico">
          <option value="">Todos</option>
          <option v-for="medico in filteredMedicos" :key="medico.nome" :value="medico.nome">
            {{ medico.nome }}
          </option>
        </b-form-select>
      </b-form-group>
    </b-col>

    <b-col cols="12" md="6">
      <b-form-group label="Filtrar por Paciente:" label-for="paciente">
        <b-form-input v-model="searchPaciente" placeholder="Digite o nome do paciente" />
        <b-form-select id="paciente" v-model="selectedPaciente">
          <option value="">Todos</option>
          <option v-for="paciente in filteredPacientes" :key="paciente.nome" :value="paciente.nome">
            {{ paciente.nome }}
          </option>
        </b-form-select>
      </b-form-group>
    </b-col>

    <b-col cols="12" md="6">
      <b-form-group label="Data de Criação:" label-for="dataCriacao">
        <b-form-input type="date" v-model="dataCriacao" />
      </b-form-group>
    </b-col>

    <b-col cols="12" md="6">
      <b-form-group label="Data de Nascimento:" label-for="dataNascimento">
        <b-form-input type="date" v-model="dataNascimento" />
      </b-form-group>
    </b-col>

    <b-col cols="12" class="text-right">
      <!-- Botão de pesquisa -->
      <b-button variant="primary" @click="fetchAgendamentos">Pesquisar</b-button>
    </b-col>
  </b-row>

  <div v-if="agendamentos.length > 0" class="table-responsive">
    <b-table striped hover :items="agendamentos" :fields="fields">
      <template #cell(status)="data">
        <b-badge variant="primary">{{ formatStatus(data.item.status) }}</b-badge>
      </template>
      <template #cell(medico)="data">
        <div class="d-flex align-items-center">
          <i class="fas fa-user-md mr-2"></i>
          <span>{{ data.item.medico.nome }}</span>
        </div>
      </template>
      <template #cell(paciente)="data">
        <div class="d-flex align-items-center">
          <i class="fas fa-user mr-2"></i>
          <span>{{ pacienteFormatter(data.item) }}</span>
        </div>
      </template>
      <template #cell(actions)="data">
        <b-button size="sm" variant="outline-light" @click="editAgendamento(data.item.id)" class="btn-custom">
          Editar
        </b-button>
        <b-button size="sm" variant="outline-light" @click="deleteAgendamento(data.item.id)" class="btn-custom">
          Excluir
        </b-button>
      </template>
    </b-table>
  </div>
  <div v-else>
    <p class="text-center">Nenhum agendamento encontrado.</p>
  </div>

  <Pagination :current-page="paginacao.paginaAtual" :total-items="paginacao.totalItems"
    :selected-items-count="paginacao.itensPorPagina" @page-changed="handlePageChange"
    @items-per-page-changed="handleItemsPerPageChange" />
</template>

<script>
import Pagination from '@/components/CustomPagination.vue';
import { getAgendamentos, getMedicos, getPacientes } from '@/services/api';

export default {
  components: { Pagination },
  data() {
    return {
      agendamentos: [],
      medicos: [],
      pacientes: [],
      selectedMedico: '',
      selectedPaciente: '',
      searchMedico: '',
      searchPaciente: '',
      dataCriacao: '',
      dataNascimento: '',
      paginacao: {
        paginaAtual: 1,
        totalDePaginas: 1,
        itensPorPagina: Number(localStorage.getItem('itensPorPagina')) || 5
      },
      fields: [
        { key: 'medico', label: 'Médico' },
        { key: 'paciente', label: 'Dados do Paciente', formatter: this.pacienteFormatter },
        { key: 'dataCriacao', label: 'Data de Criação', formatter: this.dataFormatter },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Ações' }
      ]
    };
  },
  computed: {
    filteredMedicos() {
      return this.medicos.filter(medico => medico.nome.toLowerCase().includes(this.searchMedico.toLowerCase()));
    },
    filteredPacientes() {
      return this.pacientes.filter(paciente => paciente.nome.toLowerCase().includes(this.searchPaciente.toLowerCase()));
    }
  },
  mounted() {
    this.fetchMedicos();
    this.fetchPacientes();
    this.fetchAgendamentos();
  },
  methods: {
    async fetchAgendamentos() {
      try {
        const { agendamentos, paginacao } = await getAgendamentos(
          this.paginacao.paginaAtual,
          this.paginacao.itensPorPagina,
          this.selectedMedico,
          this.selectedPaciente,
          this.dataCriacao,
          this.dataNascimento
        );
        this.agendamentos = agendamentos;
        this.paginacao = paginacao;
      } catch (error) {
        console.error('Error fetching agendamentos:', error);
      }
    },
    async fetchMedicos() {
      try {
        this.medicos = await getMedicos();
      } catch (error) {
        console.error('Error fetching medicos:', error);
      }
    },
    async fetchPacientes() {
      try {
        this.pacientes = await getPacientes();
      } catch (error) {
        console.error('Error fetching pacientes:', error);
      }
    },
    editAgendamento(id) {
      console.log(`Editando agendamento com ID: ${id}`);
    },
    deleteAgendamento(id) {
      console.log(`Excluindo agendamento com ID: ${id}`);
    },
    pacienteFormatter(item) {
      return `${item.paciente.nome} | Data Nascimento: ${this.formatDate(item.paciente.dataNascimento)}`;
    },
    dataFormatter(item) {
      return this.formatDate(item);
    },
    formatDate(dateString) {
      const date = new Date(dateString);

      if (isNaN(date)) return 'Data Inválida';

      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = date.getUTCFullYear();

      return `${day}/${month}/${year}`;
    },
    formatStatus(status) {
      switch (status) {
        case 'C':
          return 'Confirmado';
        case 'P':
          return 'Pendente';
        case 'A':
          return 'Cancelado';
        default:
          return 'Agendado';
      }
    },
    handlePageChange(page) {
      this.paginacao.paginaAtual = page;
      this.fetchAgendamentos();
    },
    handleItemsPerPageChange(newCount) {
      this.paginacao.itensPorPagina = newCount;
      localStorage.setItem('itensPorPagina', newCount);
      this.paginacao.paginaAtual = 1;
      this.fetchAgendamentos();
    },
  }
};
</script>
<style scoped>
.table-responsive {
  overflow-y: auto;
  color: #5A5A6E;
}

.table-responsive:hover .btn-custom {
  color: none;
}

.table-responsive:hover {
  color: #1496E6;
}

.d-flex {
  display: flex;
  align-items: center;
}

.mr-2 {
  margin-right: 0.5rem;
}

.pagination-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: 10px;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}

div {
  color: #5A5A6E;
}

.table-responsive {
  color: #5A5A6E !important;
}

.table> :not(caption)>*>* {
  color: #5A5A6E !important;
}

.btn-custom {
  border-radius: 4px;
  font-weight: 500;
  color: #1496E6;
  border-color: #1496E6;
}

.btn-custom:hover {
  background-color: #1496E6;
  color: white !important;
  border-color: none;
}

.btn-custom[disabled] {
  background-color: #5A5A6E;
  color: white;
  border-color: #5A5A6E;
}
</style>
