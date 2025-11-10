
  (function(){
    const btn = document.querySelector('.visible-pass');
    const pw = document.querySelector('.input-pass');
    if (!btn || !pw) return;

    btn.addEventListener('click', () => {
      const isPass = pw.getAttribute('type') === 'password';
      pw.setAttribute('type', isPass ? 'text' : 'password');

      const icon = btn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
      }
    });
  })();

