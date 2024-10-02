import axios from 'axios';

const API_URL = 'http://localhost:8080';

const formatDate2 = (date) => {
  if (!date) return 'Data Inválida';

  const d = new Date(date);

  if (isNaN(d.getTime())) return 'Data Inválida';

  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

export const getAgendamentos = async (paginaAtual = 1, itensPorPagina = 3, medico = '', paciente = '', dataCriacao = '', dataNascimento = '') => {
  try {
    const response = await axios.get(`${API_URL}/data`);

    const agendamentosOriginais = response.data;
    let agendamentos = [...agendamentosOriginais];

    if (medico) {
      agendamentos = agendamentos.filter(agendamento =>
        agendamento.medico.nome.toLowerCase().includes(medico.toLowerCase())
      );
    }

    if (paciente) {
      agendamentos = agendamentos.filter(agendamento =>
        agendamento.paciente.nome.toLowerCase().includes(paciente.toLowerCase())
      );
    }
    if (dataCriacao) {
      const formattedDataCriacao = formatDate2(dataCriacao);

      agendamentos = agendamentos.filter(agendamento => {
        const formattedAgendamentoData = formatDate2(agendamento.dataCriacao);
        return formattedAgendamentoData === formattedDataCriacao;
      });
    }


    if (dataNascimento) {
      agendamentos = agendamentos.filter(agendamento =>
        new Date(agendamento.paciente.dataNascimento).toLocaleDateString() === new Date(dataNascimento).toLocaleDateString()
      );
    }

    const totalItems = agendamentos.length;
    const totalDePaginas = Math.ceil(totalItems / itensPorPagina);
    const agendamentosPaginados = agendamentos.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

    return {
      agendamentos: agendamentosPaginados,
      paginacao: {
        paginaAtual: paginaAtual,
        itensPorPagina: itensPorPagina,
        totalDePaginas: totalDePaginas,
        totalItems: totalItems
      }
    };
  } catch (error) {
    console.error('Erro na requisição para a API:', error.message);
    throw error;
  }
};


export const getMedicos = async (search = '') => {
  try {
    const response = await axios.get(`${API_URL}/data`);
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
    const response = await axios.get(`${API_URL}/data`);
    const pacientes = response.data.map(agendamento => agendamento.paciente);
    const filteredPacientes = pacientes.filter(p => p.nome.toLowerCase().includes(search.toLowerCase()));
    return Array.from(new Set(filteredPacientes.map(p => p.nome))).map(nome => ({ nome }));
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error.message);
    throw error;
  }
};
