<template>
  <div id="app">
    <header class="justify-content-between">
      <div class="header-content">
        <a href="#">
          <img src="@/assets/logo.png" alt="Logo" class="logo" />
        </a>
      </div>
      <div class="avatar">
        <img src="@/assets/avatar.png" alt="Avatar" />
      </div>
    </header>
    <div class="container-fluid">
      <div class="row">
        <main class="col">
          <AgendamentosList />
        </main>
      </div>
    </div>
    <footer class="footer">
      <p>Aplicação para fins de teste, Desenvolvido por Bruno Alves, para FinxApp</p>
    </footer>
  </div>
</template>

<script>
import AgendamentosList from '@/components/AgendamentosList.vue';

export default {
  name: 'App',
  components: {
    AgendamentosList,
  },
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f8f8f8;
}

.header-content {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
  margin-right: 10px;
}

.avatar img {
  height: 40px;
  border-radius: 50%;
}

.footer {
  margin-top: auto;
  padding: 10px;
  background-color: #f8f8f8;
  text-align: center;
}
</style>
