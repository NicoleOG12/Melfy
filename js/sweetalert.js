(function() {
  const styleId = 'swal2-melfy-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .swal2-melfy-popup {
        border-radius: 24px;
        background: linear-gradient(180deg, #fff9f1 0%, #fff1d0 100%);
        border: 1px solid #FFD868;
        box-shadow: 0 24px 60px rgba(74, 32, 20, 0.14);
        color: #4A2014;
      }
      .swal2-melfy-title {
        font-family: 'Nunito', sans-serif;
        font-weight: 800;
        color: #4A2014;
      }
      .swal2-melfy-content {
        font-family: 'Nunito', sans-serif;
        color: #5A3F2B;
        line-height: 1.6;
      }
      .swal2-melfy-confirm {
        background: linear-gradient(90deg, #FFD868, #FFC43D) !important;
        color: #4A2014 !important;
        border: none !important;
        box-shadow: 0 12px 24px rgba(255, 212, 42, 0.25) !important;
      }
      .swal2-melfy-cancel {
        color: #4A2014 !important;
      }
      .swal2-popup .swal2-styled:focus {
        box-shadow: 0 0 0 4px rgba(255, 212, 42, 0.28) !important;
      }
    `;
    document.head.appendChild(style);
  }

  function showSweetAlert(message, options = {}) {
    return Swal.fire({
      title: options.title || '',
      html: `<div class="swal2-melfy-content">${(message || '').toString()}</div>`,
      icon: options.icon || 'info',
      showCancelButton: options.showCancelButton || false,
      confirmButtonText: options.confirmButtonText || 'OK',
      cancelButtonText: options.cancelButtonText || 'Cancelar',
      customClass: {
        popup: 'swal2-melfy-popup',
        title: 'swal2-melfy-title',
        confirmButton: 'swal2-melfy-confirm',
        cancelButton: 'swal2-melfy-cancel'
      },
      background: options.background || '#fff9f1',
      color: options.color || '#4A2014',
      ...options
    });
  }

  window.showSweetAlert = showSweetAlert;
  window.alert = function(message) {
    return showSweetAlert(message, { icon: 'info' });
  };
  window.alertSuccess = function(message) {
    return showSweetAlert(message, { icon: 'success' });
  };
  window.alertError = function(message) {
    return showSweetAlert(message, { icon: 'error' });
  };
  window.alertWarning = function(message) {
    return showSweetAlert(message, { icon: 'warning' });
  };
})();
