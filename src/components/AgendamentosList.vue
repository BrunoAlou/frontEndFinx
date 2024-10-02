<template>
  <b-row class="mb-4">
    <b-col cols="12" md="6">
      <b-form-group label="Filtrar por Médico:" label-for="medico">
        <b-form-input v-model="searchMedico" @input="debouncedFetchMedicos" placeholder="Digite o nome do médico" />
        <b-form-select id="medico" v-model="selectedMedico" @input="onMedicoChange">
          <option value="">Todos</option>
          <option v-for="medico in filteredMedicos" :key="medico.nome" :value="medico.nome">
            {{ medico.nome }}
          </option>
        </b-form-select>
      </b-form-group>
    </b-col>

    <b-col cols="12" md="6">
      <b-form-group label="Filtrar por Paciente:" label-for="paciente">
        <b-form-input v-model="searchPaciente" @input="debouncedFetchPacientes"
          placeholder="Digite o nome do paciente" />
        <b-form-select id="paciente" v-model="selectedPaciente" @input="onPacienteChange">
          <option value="">Todos</option>
          <option v-for="paciente in filteredPacientes" :key="paciente.nome" :value="paciente.nome">
            {{ paciente.nome }}
          </option>
        </b-form-select>
      </b-form-group>
    </b-col>

    <b-col cols="12" md="6">
      <b-form-group label="Data de Criação:" label-for="dataCriacao">
        <b-form-input type="date" v-model="dataCriacao" @input="onDateChange" />
      </b-form-group>
    </b-col>

    <b-col cols="12" md="6">
      <b-form-group label="Data de Nascimento:" label-for="dataNascimento">
        <b-form-input type="date" v-model="dataNascimento" @input="onDateChange" />
      </b-form-group>
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
          <span>{{ medicoFormatter(data.item) }}</span>
        </div>
      </template>
      <template #cell(paciente)="data">
        <div class="d-flex align-items-center">
          <i class="fas fa-user mr-2"></i>
          <span>{{ pacienteFormatter(data.item) }}</span>
        </div>
      </template>
      <template #cell(actions)="data">
        <b-button size="sm" variant="warning" @click="editAgendamento(data.item.id)">
          Editar
        </b-button>
        <b-button size="sm" variant="danger" @click="deleteAgendamento(data.item.id)">
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
import debounce from 'lodash/debounce';



export default {
  components: { Pagination },
  data() {
    return {
      agendamentos: [],
      medicos: [],
      filteredMedicos: [],
      pacientes: [],
      filteredPacientes: [],
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
        { key: 'medico', label: 'Médico', formatter: medico => this.medicoFormatter(medico) },
        { key: 'paciente', label: 'Dados do Paciente', formatter: paciente => this.pacienteFormatter(paciente) },
        { key: 'dataCriacao', label: 'Data de Criação', formatter: this.dataFormatter },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Ações' }
      ]
    };
  },
  mounted() {
    this.fetchAgendamentos();
    this.fetchMedicos();
    this.fetchPacientes();
    this.debouncedFetchMedicos = debounce(this.fetchMedicos, 300);
    this.debouncedFetchPacientes = debounce(this.fetchPacientes, 300);
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
        this.medicos = await getMedicos(this.searchMedico);
        this.filteredMedicos = this.medicos;
      } catch (error) {
        console.error('Error fetching medicos:', error);
      }
    },
    async fetchPacientes() {
      try {
        this.pacientes = await getPacientes(this.searchPaciente);
        this.filteredPacientes = this.pacientes;
      } catch (error) {
        console.error('Error fetching pacientes:', error);
      }
    },
    onMedicoChange() {
      this.fetchAgendamentos();
    },
    onPacienteChange() {
      this.fetchAgendamentos();
    },
    onDateChange() {
      this.fetchAgendamentos();
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
    editAgendamento(id) {
      console.log(`Editando agendamento com ID: ${id}`);
    },
    deleteAgendamento(id) {
      console.log(`Excluindo agendamento com ID: ${id}`);
    },
    pacienteFormatter(item) {
      const date = new Date(item.paciente.dataNascimento);

      if (isNaN(date)) return 'Data Inválida';

      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = date.getUTCFullYear();

      return `${item.paciente.nome} | Data Nascimento: ${day}/${month}/${year}`;
    },
    medicoFormatter(item) {
      return `${item.medico.nome}`;
    },
    dataFormatter(item) {
      const date = new Date(item);

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
    }
  }
};
</script>

<style scoped>
.table-responsive {
  overflow-y: auto;
  color: #5A5A6E;
}

.table-responsive :hover {
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

div{
  color: #5A5A6E;
}
.table-responsive {
  color: #5A5A6E !important;
}

.table > :not(caption) > * > * {
  color: #5A5A6E !important;
}
</style>
