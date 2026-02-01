// Utility functions for the Personal Finance Manager

/**
 * Format currency in Indian Rupees
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date to relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffTime = Math.abs(now - past);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Get color for transaction type
 */
export const getTypeColor = (type) => {
  const colors = {
    income: '#10b981',
    expense: '#f59e0b',
    credit: '#ef4444',
    credit_payment: '#3b82f6',
  };
  return colors[type] || '#6b7280';
};

/**
 * Get icon for transaction type
 */
export const getTypeIcon = (type) => {
  const icons = {
    income: '💰',
    expense: '💸',
    credit: '💳',
    credit_payment: '✅',
  };
  return icons[type] || '📄';
};

/**
 * Get icon for payment method
 */
export const getPaymentIcon = (method) => {
  const icons = {
    cash: '💵',
    card: '💳',
    upi: '📱',
    bank_transfer: '🏦',
    other: '🔄',
  };
  return icons[method] || '💰';
};

/**
 * Get icon for category
 */
export const getCategoryIcon = (category) => {
  const icons = {
    'Food & Dining': '🍽️',
    'Transportation': '🚗',
    'Shopping': '🛍️',
    'Entertainment': '🎬',
    'Bills & Utilities': '📄',
    'Healthcare': '🏥',
    'Education': '📚',
    'Groceries': '🛒',
    'Rent': '🏠',
    'Salary': '💼',
    'Freelance': '💻',
    'Investment': '📈',
    'Business': '💼',
    'Gift': '🎁',
    'Other': '📋',
  };
  return icons[category] || '📋';
};

/**
 * Group transactions by date
 */
export const groupByDate = (transactions) => {
  const grouped = {};
  
  transactions.forEach((txn) => {
    const date = new Date(txn.date).toLocaleDateString();
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(txn);
  });
  
  return grouped;
};

/**
 * Group transactions by month
 */
export const groupByMonth = (transactions) => {
  const grouped = {};
  
  transactions.forEach((txn) => {
    const month = txn.date?.slice(0, 7);
    if (!grouped[month]) {
      grouped[month] = [];
    }
    grouped[month].push(txn);
  });
  
  return grouped;
};

/**
 * Calculate statistics for a set of transactions
 */
export const calculateStats = (transactions) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const credit = transactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const creditPayment = transactions
    .filter((t) => t.type === 'credit_payment')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const incomeTransactions = transactions.filter((t) => t.type === 'income');
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  
  return {
    income,
    expense,
    credit,
    creditPayment,
    creditRemaining: Math.max(0, credit - creditPayment),
    balance: income + Math.max(0, credit - creditPayment) - expense,
    totalTransactions: transactions.length,
    avgIncome: incomeTransactions.length > 0 
      ? income / incomeTransactions.length 
      : 0,
    avgExpense: expenseTransactions.length > 0 
      ? expense / expenseTransactions.length 
      : 0,
    savingsRate: income > 0 ? ((income - expense) / income) * 100 : 0,
  };
};

/**
 * Get top categories by spending
 */
export const getTopCategories = (transactions, limit = 5) => {
  const categoryTotals = {};
  
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const cat = t.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
    });
    
  return Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([category, amount]) => ({ category, amount }));
};

/**
 * Export transactions to CSV
 */
export const exportToCSV = (transactions, filename = 'transactions') => {
  const headers = [
    'Date',
    'Type',
    'Category',
    'Amount',
    'Description',
    'Payment Method',
    'Tags',
    'Recurring',
  ];
  
  const rows = transactions.map((t) => [
    formatDate(t.date),
    t.type,
    t.category || '',
    t.amount,
    t.description || '',
    t.paymentMethod || '',
    t.tags?.join('; ') || '',
    t.isRecurring ? `Yes (${t.recurringFrequency})` : 'No',
  ]);
  
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');
    
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Validate transaction data
 */
export const validateTransaction = (data) => {
  const errors = {};
  
  if (!data.amount || data.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }
  
  if (!data.type) {
    errors.type = 'Transaction type is required';
  }
  
  if (data.type === 'credit_payment' && !data.creditAvailable) {
    errors.amount = 'No credit to pay';
  }
  
  if (data.type === 'credit_payment' && data.amount > data.creditAvailable) {
    errors.amount = 'Payment cannot exceed credit due';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Get budget status
 */
export const getBudgetStatus = (spent, budget) => {
  const percentage = (spent / budget) * 100;
  
  if (percentage >= 100) return { status: 'danger', message: 'Budget exceeded!' };
  if (percentage >= 80) return { status: 'warning', message: 'Approaching budget limit' };
  if (percentage >= 50) return { status: 'info', message: 'On track' };
  return { status: 'success', message: 'Well within budget' };
};

/**
 * Calculate monthly comparison
 */
export const getMonthlyComparison = (currentMonth, previousMonth) => {
  const current = calculateStats(currentMonth);
  const previous = calculateStats(previousMonth);
  
  return {
    incomeChange: calculatePercentageChange(current.income, previous.income),
    expenseChange: calculatePercentageChange(current.expense, previous.expense),
    savingsChange: calculatePercentageChange(
      current.income - current.expense,
      previous.income - previous.expense
    ),
  };
};

/**
 * Search transactions
 */
export const searchTransactions = (transactions, searchTerm) => {
  if (!searchTerm) return transactions;
  
  const term = searchTerm.toLowerCase();
  
  return transactions.filter((t) => {
    return (
      t.description?.toLowerCase().includes(term) ||
      t.category?.toLowerCase().includes(term) ||
      t.type?.toLowerCase().includes(term) ||
      t.tags?.some((tag) => tag.toLowerCase().includes(term))
    );
  });
};

/**
 * Get recurring transactions due soon
 */
export const getUpcomingRecurring = (transactions, daysAhead = 7) => {
  const now = new Date();
  const future = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  
  return transactions
    .filter((t) => t.isRecurring)
    .map((t) => {
      const lastDate = new Date(t.date);
      let nextDate;
      
      switch (t.recurringFrequency) {
        case 'daily':
          nextDate = new Date(lastDate.getTime() + 24 * 60 * 60 * 1000);
          break;
        case 'weekly':
          nextDate = new Date(lastDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          nextDate = new Date(lastDate);
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case 'yearly':
          nextDate = new Date(lastDate);
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
        default:
          nextDate = lastDate;
      }
      
      return { ...t, nextDate };
    })
    .filter((t) => t.nextDate >= now && t.nextDate <= future);
};
