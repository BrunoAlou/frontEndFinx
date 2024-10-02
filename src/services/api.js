import axios from 'axios';

const API_URL = process.env.VUE_APP_BASE_API_URL;
const DATA_ENDPOINT = `${API_URL}data`;

const formatDate = (date) => {
  if (!date) return 'Data Inválida';

  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Data Inválida';

  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

const filterData = (data, filters) => {
  return data.filter(item => {
    const { medico, paciente, dataCriacao, dataNascimento } = filters;

    const matchesMedico = medico ? item.medico.nome.toLowerCase().includes(medico.toLowerCase()) : true;
    const matchesPaciente = paciente ? item.paciente.nome.toLowerCase().includes(paciente.toLowerCase()) : true;
    const matchesDataCriacao = dataCriacao ? formatDate(item.dataCriacao) === formatDate(dataCriacao) : true;
    const matchesDataNascimento = dataNascimento ? new Date(item.paciente.dataNascimento).toLocaleDateString() === new Date(dataNascimento).toLocaleDateString() : true;

    return matchesMedico && matchesPaciente && matchesDataCriacao && matchesDataNascimento;
  });
};

export const getAgendamentos = async (paginaAtual = 1, itensPorPagina = 3, medico = '', paciente = '', dataCriacao = '', dataNascimento = '') => {
  try {
    const response = await axios.get(DATA_ENDPOINT);
    const agendamentosOriginais = response.data;

    const filters = { medico, paciente, dataCriacao, dataNascimento };
    const agendamentos = filterData(agendamentosOriginais, filters);

    const totalItems = agendamentos.length;
    const totalDePaginas = Math.ceil(totalItems / itensPorPagina);
    const agendamentosPaginados = agendamentos.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

    return {
      agendamentos: agendamentosPaginados,
      paginacao: {
        paginaAtual,
        itensPorPagina,
        totalDePaginas,
        totalItems
      }
    };
  } catch (error) {
    console.error('Erro na requisição para a API:', error.message);
    throw error;
  }
};

export const getMedicos = async (search = '') => {
  try {
    const response = await axios.get(DATA_ENDPOINT);
    const medicos = response.data.map(agendamento => agendamento.medico);
    const filteredMedicos = medicos.filter(m => m.nome.toLowerCase().includes(search.toLowerCase()));
    return Array.from(new Set(filteredMedicos.map(m => m.nome))).map(nome => ({ nome }));
  } catch (error) {
    console.error('Erro ao buscar médicos:', error.message);
    throw error;
  }
};

export const getPacientes = async (search = '') => {
  try {
    const response = await axios.get(DATA_ENDPOINT);
    const pacientes = response.data.map(agendamento => agendamento.paciente);
    const filteredPacientes = pacientes.filter(p => p.nome.toLowerCase().includes(search.toLowerCase()));
    return Array.from(new Set(filteredPacientes.map(p => p.nome))).map(nome => ({ nome }));
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error.message);
    throw error;
  }
};
