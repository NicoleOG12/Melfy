function entrarPerfil() {
  let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  if (!usuarioLogado || Object.keys(usuarioLogado).length === 0) {
      alert('Você precisa se logar primeiro!');
      window.location.href = 'login.html';
  } else {
      alert('Usuário logado!!');
      window.location.href = 'perfil.html';
  }

  console.log(usuarioLogado);
}