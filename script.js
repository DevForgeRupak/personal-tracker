
// 🌐 DOM Elements
const form = document.getElementById('transaction-form');
const list = document.getElementById('transaction-list');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const netBalanceEl = document.getElementById('net-balance');

// 🧠 Global State
let filteredTransactions = [];
let editingId = null;

function searchTransactions(query) {
  const lowerQuery = query.toLowerCase();
  filteredTransactions = transactions.filter(tx =>
    tx.description.toLowerCase().includes(lowerQuery)
  );
  renderTransactions(filteredTransactions);
}

  function setTodayDate() {
  const dateInput = document.getElementById('date');
  if (!editingId && dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }
}


// 📅 Set today's date (only if not editing)
function formatLocalDate(dateStr){
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}


    function fetchTransactions() {
  const data = JSON.parse(localStorage.getItem('transactions')) || [];
  transactions = data;
  renderTransactions();
}


// 💾 Add or update transaction
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const description = document.getElementById('description').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const date = document.getElementById('date').value;

  if (!description || isNaN(amount) || !date) {
    alert("Please enter valid transaction details.");
    return;
  }

  const transaction = { description, amount, date };

  if (editingId) {
    await updateTransaction(editingId, transaction);
    editingId = null;
  } else {
    await addTransactionToServer(transaction);
  }

  form.reset();
  editingId = null;
  setTodayDate();
});

function addTransactionToServer(transaction) {
  const current = JSON.parse(localStorage.getItem('transactions')) || [];
  transaction.id = Date.now(); // simple unique id
  current.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(current));
  fetchTransactions();
}

    function submitQuickExpense() {
  const category = document.getElementById('quick-category').value;
  const amountInput = document.getElementById('quick-amount').value;
  const amount = parseFloat(amountInput);

  if (!category || isNaN(amount) || amount <= 0) {
    alert("Please select a category and enter a valid amount.");
    return;
  }

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const date = `${yyyy}-${mm}-${dd}`;

  const transaction = {
    description: category,
    amount: -Math.abs(amount), // expense
    date
  };

  addTransactionToServer(transaction);

  // Clear fields
  document.getElementById('quick-amount').value = '';
  document.getElementById('quick-category').selectedIndex = 0;
}


function updateTransaction(id, updatedTx) {
  const current = JSON.parse(localStorage.getItem('transactions')) || [];
  const updated = current.map(tx => tx.id === id ? { ...tx, ...updatedTx } : tx);
  localStorage.setItem('transactions', JSON.stringify(updated));
  fetchTransactions();
}


function deleteTransaction(id) {
  const current = JSON.parse(localStorage.getItem('transactions')) || [];
  const filtered = current.filter(tx => tx.id !== id);
  localStorage.setItem('transactions', JSON.stringify(filtered));
  fetchTransactions();
}


// ✏️ Edit (load into form)
function editTransaction(id) {
  const tx = transactions.find(t => t.id === id);
  if (!tx) return;

  editingId = id;
  document.getElementById('description').value = tx.description;
  document.getElementById('amount').value = tx.amount;

  // ✅ Set date correctly in input field
  const inputDate = new Date(tx.date);
  const yyyy = inputDate.getFullYear();
  const mm = String(inputDate.getMonth() + 1).padStart(2, '0');
  const dd = String(inputDate.getDate()).padStart(2, '0');
  document.getElementById('date').value = `${yyyy}-${mm}-${dd}`;
}


// 🧮 Render UI
function renderTransactions(data=transactions) {
  list.innerHTML = '';

  let income = 0;
  let expense = 0;;

   const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
   
  sorted.forEach(tx => {
    const li = document.createElement('li');
    li.classList.add(tx.amount >= 0 ? 'income' : 'expense');
    li.innerHTML = `
      ${tx.description} - ₹${tx.amount} <br><small>${formatLocalDate(tx.date)}</small>
      <div>
        <button onclick="editTransaction(${tx.id})">Edit</button>
        <button class="start" onclick="deleteTransaction(${tx.id})">Delete</button>
      </div>
    `;
    list.appendChild(li);

    if (tx.amount >= 0) {
      income += parseFloat(tx.amount);
    } else {
      expense += Math.abs(parseFloat(tx.amount));
    }
  });

  totalIncomeEl.textContent = `₹${income.toFixed(2)}`;
  totalExpenseEl.textContent = `₹${expense.toFixed(2)}`;
  netBalanceEl.textContent = `₹${(income - expense).toFixed(2)}`;
}

function logout() {
  alert("Logout isn't needed in offline mode.");
}


// 🚀 Initial Load
fetchTransactions();
setTodayDate();
