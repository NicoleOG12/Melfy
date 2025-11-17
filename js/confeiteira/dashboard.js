const vendasProduto = document.getElementById('graph-vendas-produto');

new Chart(vendasProduto, {
  type: 'pie',
  data: {
    labels: ['Produto A', 'Produto B', 'Produto C', 'Produto D', 'Produto E', 'Produto F'],
    datasets: [{
      label: 'Vendas por Produto',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        '#6B3F2A',
        '#FFC43D',
        '#dbba54ff',
        '#FFEDB5',
        '#8A6F5E',
        '#4A2B1D'
      ],
      borderColor: '#fff',
      borderWidth: 2,
      hoverOffset: 8
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#4A2B1D',
          font: { family: 'Poppins', size: 14 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#4A2B1D',
        bodyColor: '#6B3F2A',
        borderColor: 'rgba(255, 216, 104, 0.4)',
        borderWidth: 1
      }
    }
  }
});

const vendasMes = document.getElementById('graph-vendas-mes');

new Chart(vendasMes, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [{
      label: 'Vendas por mês',
      data: [1200, 1500, 900, 1800, 2000, 1700, 2200, 2100, 1900, 2300, 2500, 2700],
      fill: true,
      backgroundColor: 'rgba(255, 216, 104, 0.25)',
      borderColor: '#FFC43D',
      borderWidth: 2,
      tension: 0.4,
      pointBackgroundColor: '#FFD868',
      pointRadius: 4
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { color: '#6B3F2A' } },
      x: { ticks: { color: '#6B3F2A', font: { size: 12 } } }
    }
  }
});

const pedidosStatus = document.getElementById('graph-pedidos');

new Chart(pedidosStatus, {
  type: 'doughnut',
  data: {
    labels: ['Em aberto', 'Em andamento', 'Em entrega', 'Finalizados'],
    datasets: [{
      data: [5, 10, 7, 15],
      backgroundColor: [
        '#dbba54ff',
        '#FFC43D',
        '#6B3F2A',
        '#8A6F5E'
      ],
      borderWidth: 0
    }]
  },
  options: {
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#4A2B1D',
          font: { family: 'Poppins', size: 13 }
        }
      }
    }
  }
});

const ctx = document.getElementById('graph-estoque');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Confeito', 'Açúcar', 'Chocolate', 'Leite'],
    datasets: [{
      label: 'Quantidade em estoque',
      data: [2, 2, 1, 1],
      backgroundColor: [
        '#dbba54ff',
        '#FFC43D',
        '#6B3F2A',
        '#8A6F5E'
      ],
      borderWidth: 0
    }]
  },
  options: {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        ticks: { color: '#4A2B1D' },
        title: { display: true, text: 'Quantidade', color: '#6B3F2A' }
      },
      y: { ticks: { color: '#4A2B1D' } }
    },
    plugins: { legend: { display: false } }
  }
});

window.addEventListener('load', () => {
  document.body.classList.add('animado');
});

