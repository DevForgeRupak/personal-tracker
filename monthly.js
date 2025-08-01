// // 🔐 Check login (only simulated for now)
// const userId = localStorage.getItem('userId');
// if (!userId) {
//   alert("Please login first.");
//   window.location.href = "login.html";
// }

// 📦 Fetch & group transactions from localStorage
function fetchAndGroupTransactions() {
  const allData = JSON.parse(localStorage.getItem('transactions')) || [];
  const grouped = {};

  allData.forEach(tx => {
    const date = new Date(tx.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // e.g., 2025-07

    if (!grouped[monthKey]) {
      grouped[monthKey] = { income: 0, expense: 0 };
    }

    const amount = parseFloat(tx.amount);
    if (amount >= 0) {
      grouped[monthKey].income += amount;
    } else {
      grouped[monthKey].expense += Math.abs(amount);
    }
  });

  renderMonthlySummary(grouped);
}

// 🧾 Display Summary + Chart per month
function renderMonthlySummary(data) {
  const container = document.getElementById('monthly-summary');
  container.innerHTML = '';

  if (!Object.keys(data).length) {
    container.innerHTML = "<p>No transactions found.</p>";
    return;
  }

  const sortedMonths = Object.keys(data).sort((a, b) => b.localeCompare(a));

  sortedMonths.forEach((month, index) => {
    const { income, expense } = data[month];
    const balance = income - expense;

    // 📦 Container
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'space-between';
    wrapper.style.border = '1px solid #ccc';
    wrapper.style.padding = '10px';
    wrapper.style.marginBottom = '15px';
    wrapper.style.borderRadius = '8px';
    wrapper.style.backgroundColor = '#f9f9f9';

    // 📋 Summary
    const summary = document.createElement('div');
    summary.innerHTML = `
      <strong>${formatMonthName(month)}</strong><br>
      Income: ₹${income.toFixed(2)}<br>
      Expense: ₹${expense.toFixed(2)}<br>
      Net Balance: ₹${balance.toFixed(2)}
    `;

    // 📊 Chart
    const chartCanvas = document.createElement('canvas');
    chartCanvas.id = `chart-${index}`;
    chartCanvas.width = 200;
    chartCanvas.height = 150;

    wrapper.appendChild(summary);
    wrapper.appendChild(chartCanvas);
    container.appendChild(wrapper);

    drawMiniChart(`chart-${index}`, income, expense);
  });
}

// 📊 Draw bar chart for each month
function drawMiniChart(canvasId, income, expense) {
  const ctx = document.getElementById(canvasId).getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        label: '₹ Amount',
        data: [income, expense],
        backgroundColor: ['rgba(40, 167, 69, 0.7)', 'rgba(220, 53, 69, 0.7)']
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `₹${ctx.raw}`
          }
        }
      },
      scales: {
        x: { beginAtZero: true }
      }
    }
  });
}

// 📅 Format month for display
function formatMonthName(ym) {
  const [year, month] = ym.split('-');
  const date = new Date(year, month - 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

// 🚪 Logout
function logout() {
  localStorage.removeItem('userId');
  window.location.href = 'login.html';
}

// 🚀 Initial
fetchAndGroupTransactions();
