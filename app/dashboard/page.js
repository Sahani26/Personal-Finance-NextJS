// "use client";
// import { useEffect, useState } from "react";
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
//   ArcElement,
//   LineElement,
//   PointElement,
// } from "chart.js";
// import { Bar, Pie, Line } from "react-chartjs-2"; 

// ChartJS.register(
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
//   ArcElement,
//   LineElement,
//   PointElement
// );

// // 🎨 Predefined Categories
// const CATEGORIES = {
//   expense: [
//     "Food & Dining",
//     "Transportation",
//     "Shopping",
//     "Entertainment",
//     "Bills & Utilities",
//     "Healthcare",
//     "Education",
//     "Groceries",
//     "Rent",
//     "Other",
//   ],
//   income: [
//     "Salary",
//     "Freelance",
//     "Investment",
//     "Business",
//     "Gift",
//     "Other",
//   ],
// };

// export default function Dashboard() {
//   const [data, setData] = useState([]);
//   const [amount, setAmount] = useState("");
//   const [type, setType] = useState("expense");
//   const [remark, setRemark] = useState("");
//   const [category, setCategory] = useState("Other");
//   const [paymentMethod, setPaymentMethod] = useState("cash");
//   const [tags, setTags] = useState("");
//   const [isRecurring, setIsRecurring] = useState(false);
//   const [recurringFrequency, setRecurringFrequency] = useState("monthly");
//   const [editingId, setEditingId] = useState(null);
//   const [month, setMonth] = useState("");
//   const [filterCategory, setFilterCategory] = useState("");
//   const [filterType, setFilterType] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [chartType, setChartType] = useState("bar");
//   const [viewMode, setViewMode] = useState("dashboard"); // dashboard, analytics, list

//   async function loadData() {
//     const res = await fetch("/api/transactions");
//     const result = await res.json();
//     setData(result);
//   }

//   useEffect(() => {
//     loadData();
//   }, []);

//   // 📆 Advanced Filtering
//   const filteredData = data.filter((x) => {
//     let matches = true;

//     if (month && x.date?.slice(0, 7) !== month) matches = false;
//     if (filterCategory && x.category !== filterCategory) matches = false;
//     if (filterType && x.type !== filterType) matches = false;
//     if (searchTerm) {
//       const search = searchTerm.toLowerCase();
//       const matchesDesc = x.description?.toLowerCase().includes(search);
//       const matchesTags = x.tags?.some((tag) =>
//         tag.toLowerCase().includes(search)
//       );
//       if (!matchesDesc && !matchesTags) matches = false;
//     }

//     return matches;
//   });

//   // ===== Calculations =====
//   const income = filteredData
//     .filter((x) => x.type === "income")
//     .reduce((a, b) => a + b.amount, 0);

//   const expense = filteredData
//     .filter((x) => x.type === "expense")
//     .reduce((a, b) => a + b.amount, 0);

//   const creditTotal = filteredData
//     .filter((x) => x.type === "credit")
//     .reduce((a, b) => a + b.amount, 0);

//   const creditPaid = filteredData
//     .filter((x) => x.type === "credit_payment")
//     .reduce((a, b) => a + b.amount, 0);

//   const creditRemaining = Math.max(0, creditTotal - creditPaid);
//   const balance = income + creditRemaining - expense;

//   // 📊 Category-wise breakdown
//   const categoryBreakdown = {};
//   filteredData
//     .filter((x) => x.type === "expense")
//     .forEach((x) => {
//       const cat = x.category || "Other";
//       categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + x.amount;
//     });

//   // 📈 Monthly trend (last 6 months)
//   const getMonthlyTrend = () => {
//     const months = {};
//     const now = new Date();

//     // Initialize last 6 months
//     for (let i = 5; i >= 0; i--) {
//       const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
//       const key = d.toISOString().slice(0, 7);
//       months[key] = { income: 0, expense: 0 };
//     }

//     data.forEach((x) => {
//       const monthKey = x.date?.slice(0, 7);
//       if (months[monthKey]) {
//         if (x.type === "income") {
//           months[monthKey].income += x.amount;
//         } else if (x.type === "expense") {
//           months[monthKey].expense += x.amount;
//         }
//       }
//     });

//     return months;
//   };

//   const monthlyTrend = getMonthlyTrend();

//   // ===== Add / Update =====
//   async function saveTxn() {
//     if (!amount || Number(amount) <= 0) return alert("Enter valid amount");

//     if (type === "credit_payment" && Number(amount) > creditRemaining) {
//       return alert("Payment cannot exceed credit due");
//     }

//     const payload = {
//       amount: Number(amount),
//       type,
//       description: remark,
//       category,
//       paymentMethod,
//       tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
//       isRecurring,
//       recurringFrequency: isRecurring ? recurringFrequency : null,
//     };

//     try {
//       if (editingId) {
//         payload._id = editingId;
//         await fetch("/api/transactions", {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//       } else {
//         await fetch("/api/transactions", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//       }

//       resetForm();
//       loadData();
//     } catch (error) {
//       alert("Error saving transaction");
//     }
//   }

//   function editTxn(txn) {
//     setEditingId(txn._id);
//     setAmount(txn.amount);
//     setType(txn.type);
//     setRemark(txn.description || "");
//     setCategory(txn.category || "Other");
//     setPaymentMethod(txn.paymentMethod || "cash");
//     setTags(txn.tags?.join(", ") || "");
//     setIsRecurring(txn.isRecurring || false);
//     setRecurringFrequency(txn.recurringFrequency || "monthly");
//   }

//   async function deleteTxn(id) {
//     if (!confirm("Delete this transaction?")) return;

//     try {
//       await fetch("/api/transactions", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });

//       loadData();
//     } catch (error) {
//       alert("Error deleting transaction");
//     }
//   }

//   function resetForm() {
//     setEditingId(null);
//     setAmount("");
//     setType("expense");
//     setRemark("");
//     setCategory("Other");
//     setPaymentMethod("cash");
//     setTags("");
//     setIsRecurring(false);
//     setRecurringFrequency("monthly");
//   }

//   // 📊 Chart configurations
//   const barChartData = {
//     labels: ["Income", "Expense", "Credit Due"],
//     datasets: [
//       {
//         label: "Amount (₹)",
//         data: [income, expense, creditRemaining],
//         backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
//       },
//     ],
//   };

//   const pieChartData = {
//     labels: Object.keys(categoryBreakdown),
//     datasets: [
//       {
//         label: "Expenses by Category",
//         data: Object.values(categoryBreakdown),
//         backgroundColor: [
//           "#3b82f6",
//           "#10b981",
//           "#f59e0b",
//           "#ef4444",
//           "#8b5cf6",
//           "#ec4899",
//           "#06b6d4",
//           "#84cc16",
//         ],
//       },
//     ],
//   };

//   const lineChartData = {
//     labels: Object.keys(monthlyTrend),
//     datasets: [
//       {
//         label: "Income",
//         data: Object.values(monthlyTrend).map((m) => m.income),
//         borderColor: "#10b981",
//         backgroundColor: "rgba(16, 185, 129, 0.1)",
//         tension: 0.4,
//       },
//       {
//         label: "Expense",
//         data: Object.values(monthlyTrend).map((m) => m.expense),
//         borderColor: "#ef4444",
//         backgroundColor: "rgba(239, 68, 68, 0.1)",
//         tension: 0.4,
//       },
//     ],
//   };

//   // 📥 Export to CSV
//   function exportToCSV() {
//     const headers = [
//       "Date",
//       "Type",
//       "Category",
//       "Amount",
//       "Description",
//       "Payment Method",
//       "Tags",
//     ];
//     const rows = filteredData.map((x) => [
//       new Date(x.date).toLocaleDateString(),
//       x.type,
//       x.category || "",
//       x.amount,
//       x.description || "",
//       x.paymentMethod || "",
//       x.tags?.join("; ") || "",
//     ]);

//     const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
//     a.click();
//   }

//   return (
//     <div className="dashboard" style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
//       <h1 className="page-title" style={{ marginBottom: "30px" }}>💰 Personal Finance Manager</h1>

//       {/* View Mode Tabs */}
//       <div className="top-bt" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
//         <button
//           onClick={() => setViewMode("dashboard")}
//           style={{
//             padding: "10px 20px",
//             background: viewMode === "dashboard" ? "#3b82f6" : "#e5e7eb",
//             color: viewMode === "dashboard" ? "white" : "black",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           📊 Dashboard
//         </button>
//         <button
//           onClick={() => setViewMode("analytics")}
//           style={{
//             padding: "10px 20px",
//             background: viewMode === "analytics" ? "#3b82f6" : "#e5e7eb",
//             color: viewMode === "analytics" ? "white" : "black",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           📈 Analytics
//         </button>
//         <button
//           onClick={() => setViewMode("list")}
//           style={{
//             padding: "10px 20px",
//             background: viewMode === "list" ? "#3b82f6" : "#e5e7eb",
//             color: viewMode === "list" ? "white" : "black",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           📋 Transactions
//         </button>
//       </div>

//       {/* ========== DASHBOARD VIEW ========== */}
//       {viewMode === "dashboard" && (
//         <div>
//           {/* Summary Cards */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//               gap: "20px",
//               marginBottom: "30px",
//             }}
//           >
//             <div
//               style={{
//                 padding: "20px",
//                 background: "#10b981",
//                 color: "white",
//                 borderRadius: "10px",
//               }}
//             >
//               <h3>💰 Total Income</h3>
//               <h2>₹{income.toLocaleString()}</h2>
//             </div>
//             <div
//               style={{
//                 padding: "20px",
//                 background: "#f59e0b",
//                 color: "white",
//                 borderRadius: "10px",
//               }}
//             >
//               <h3>💸 Total Expense</h3>
//               <h2>₹{expense.toLocaleString()}</h2>
//             </div>
//             <div
//               style={{
//                 padding: "20px",
//                 background: "#ef4444",
//                 color: "white",
//                 borderRadius: "10px",
//               }}
//             >
//               <h3>💳 Credit Due</h3>
//               <h2>₹{creditRemaining.toLocaleString()}</h2>
//             </div>
//             <div
//               style={{
//                 padding: "20px",
//                 background: "#3b82f6",
//                 color: "white",
//                 borderRadius: "10px",
//               }}
//             >
//               <h3>💼 Balance</h3>
//               <h2>₹{balance.toLocaleString()}</h2>
//             </div>
//           </div>

//           {/* Charts */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: "20px",
//               marginBottom: "30px",
//             }}
//           >
//             <div style={{ padding: "20px", background: "#f9fafb", borderRadius: "10px" }}>
//               <h3>Overview</h3>
//               <Bar data={barChartData} options={{ maintainAspectRatio: true }} />
//             </div>
//             <div style={{ padding: "20px", background: "#f9fafb", borderRadius: "10px" }}>
//               <h3>Expenses by Category</h3>
//               {Object.keys(categoryBreakdown).length > 0 ? (
//                 <Pie data={pieChartData} options={{ maintainAspectRatio: true }} />
//               ) : (
//                 <p>No expense data</p>
//               )}
//             </div>
//           </div>

//           {/* Add Transaction Form */}
//           <div style={{ padding: "20px", background: "#f9fafb", borderRadius: "10px" }}>
//             <h3>{editingId ? "✏️ Edit" : "➕ Add"} Transaction</h3>

//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//                 gap: "15px",
//                 marginTop: "15px",
//               }}
//             >
//               <div>
//                 <label>Amount *</label>
//                 <input
//                   type="number"
//                   placeholder="Enter amount"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   style={{
//                     width: "100%",
//                     padding: "10px",
//                     marginTop: "5px",
//                     borderRadius: "5px",
//                     border: "1px solid #d1d5db",
//                   }}
//                 />
//               </div>

//               <div>
//                 <label>Type *</label>
//                 <select
//                   value={type}
//                   onChange={(e) => {
//                     setType(e.target.value);
//                     setCategory("Other");
//                   }}
//                   style={{
//                     width: "100%",
//                     padding: "10px",
//                     marginTop: "5px",
//                     borderRadius: "5px",
//                     border: "1px solid #d1d5db",
//                   }}
//                 >
//                   <option value="expense">💸 Expense</option>
//                   <option value="income">💰 Income</option>
//                   <option value="credit">💳 Credit Card Spend</option>
//                   <option value="credit_payment">✅ Pay Credit Card</option>
//                 </select>
//               </div>

//               {(type === "expense" || type === "income") && (
//                 <div>
//                   <label>Category</label>
//                   <select
//                     value={category}
//                     onChange={(e) => setCategory(e.target.value)}
//                     style={{
//                       width: "100%",
//                       padding: "10px",
//                       marginTop: "5px",
//                       borderRadius: "5px",
//                       border: "1px solid #d1d5db",
//                     }}
//                   >
//                     {CATEGORIES[type]?.map((cat) => (
//                       <option key={cat} value={cat}>
//                         {cat}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               <div>
//                 <label>Payment Method</label>
//                 <select
//                   value={paymentMethod}
//                   onChange={(e) => setPaymentMethod(e.target.value)}
//                   style={{
//                     width: "100%",
//                     padding: "10px",
//                     marginTop: "5px",
//                     borderRadius: "5px",
//                     border: "1px solid #d1d5db",
//                   }}
//                 >
//                   <option value="cash">💵 Cash</option>
//                   <option value="card">💳 Card</option>
//                   <option value="upi">📱 UPI</option>
//                   <option value="bank_transfer">🏦 Bank Transfer</option>
//                   <option value="other">🔄 Other</option>
//                 </select>
//               </div>

//               <div>
//                 <label>Description</label>
//                 <input
//                   type="text"
//                   placeholder="Add a note"
//                   value={remark}
//                   onChange={(e) => setRemark(e.target.value)}
//                   style={{
//                     width: "100%",
//                     padding: "10px",
//                     marginTop: "5px",
//                     borderRadius: "5px",
//                     border: "1px solid #d1d5db",
//                   }}
//                 />
//               </div>

//               <div>
//                 <label>Tags (comma-separated)</label>
//                 <input
//                   type="text"
//                   placeholder="e.g., work, travel"
//                   value={tags}
//                   onChange={(e) => setTags(e.target.value)}
//                   style={{
//                     width: "100%",
//                     padding: "10px",
//                     marginTop: "5px",
//                     borderRadius: "5px",
//                     border: "1px solid #d1d5db",
//                   }}
//                 />
//               </div>

//               <div>
//                 <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                   <input
//                     type="checkbox"
//                     checked={isRecurring}
//                     onChange={(e) => setIsRecurring(e.target.checked)}
//                   />
//                   Recurring Transaction
//                 </label>
//                 {isRecurring && (
//                   <select
//                     value={recurringFrequency}
//                     onChange={(e) => setRecurringFrequency(e.target.value)}
//                     style={{
//                       width: "100%",
//                       padding: "10px",
//                       marginTop: "5px",
//                       borderRadius: "5px",
//                       border: "1px solid #d1d5db",
//                     }}
//                   >
//                     <option value="daily">Daily</option>
//                     <option value="weekly">Weekly</option>
//                     <option value="monthly">Monthly</option>
//                     <option value="yearly">Yearly</option>
//                   </select>
//                 )}
//               </div>
//             </div>

//             <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
//               <button
//                 onClick={saveTxn}
//                 style={{
//                   padding: "10px 30px",
//                   background: "#10b981",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                   fontWeight: "bold",
//                 }}
//               >
//                 {editingId ? "Update" : "Add"} Transaction
//               </button>
//               {editingId && (
//                 <button
//                   onClick={resetForm}
//                   style={{
//                     padding: "10px 30px",
//                     background: "#6b7280",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "5px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Cancel
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ========== ANALYTICS VIEW ========== */}
//       {viewMode === "analytics" && (
//         <div>
//           <div style={{ padding: "20px", background: "#f9fafb", borderRadius: "10px" }}>
//             <h3>📈 6-Month Trend</h3>
//             <Line data={lineChartData} options={{ maintainAspectRatio: true }} />
//           </div>

//           <div
//             style={{
//               marginTop: "20px",
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: "20px",
//             }}
//           >
//             <div style={{ padding: "20px", background: "#f9fafb", borderRadius: "10px" }}>
//               <h3>💸 Top Expense Categories</h3>
//               <ul>
//                 {Object.entries(categoryBreakdown)
//                   .sort((a, b) => b[1] - a[1])
//                   .slice(0, 5)
//                   .map(([cat, amt]) => (
//                     <li key={cat}>
//                       <strong>{cat}:</strong> ₹{amt.toLocaleString()}
//                     </li>
//                   ))}
//               </ul>
//             </div>

//             <div style={{ padding: "20px", background: "#f9fafb", borderRadius: "10px" }}>
//               <h3>📊 Statistics</h3>
//               <p>
//                 <strong>Average Expense:</strong> ₹
//                 {filteredData.filter((x) => x.type === "expense").length > 0
//                   ? Math.round(
//                       expense / filteredData.filter((x) => x.type === "expense").length
//                     )
//                   : 0}
//               </p>
//               <p>
//                 <strong>Total Transactions:</strong> {filteredData.length}
//               </p>
//               <p>
//                 <strong>Savings Rate:</strong>{" "}
//                 {income > 0 ? Math.round(((income - expense) / income) * 100) : 0}%
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ========== TRANSACTIONS LIST VIEW ========== */}
//       {viewMode === "list" && (
//         <div>
//           {/* Filters */}
//           <div
//             style={{
//               padding: "20px",
//               background: "#f9fafb",
//               borderRadius: "10px",
//               marginBottom: "20px",
//             }}
//           >
//             <h3>🔍 Filters</h3>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//                 gap: "15px",
//                 marginTop: "15px",
//               }}
//             >
//               <div>
//                 <label>Month</label>
//                 <input
//                   type="month"
//                   value={month}
//                   onChange={(e) => setMonth(e.target.value)}
//                   style={{
//                     width: "100%",
//                     padding: "10px",
//                     marginTop: "5px",
//                     borderRadius: "5px",
//                     border: "1px solid #d1d5db",
//                   }}
//                 />
//               </div>

//               <div>
//                 <label>Type</label>
//                 <select
//                   value={filterType}
//                   onChange={(e) => setFilterType(e.target.value)}
//                   style={{
//                     width: "100%",
//                     padding: "10px",
//                     marginTop: "5px",
//                     borderRadius: "5px",
//                     border: "1px solid #d1d5db",
//                   }}
//                 >
//                   <option value="">All</option>
//                   <option value="income">Income</option>
//                   <option value="expense">Expense</option>
//                   <option value="credit">Credit</option>
//                   <option value="credit_payment">Credit Payment</option>
//                 </select>
//               </div>

//               <div>
//                 <label>Category</label>
//                 <select
//                   value={filterCategory}
//                   onChange={(e) => setFilterCategory(e.target.value)}
//                   style={{
//                     width: "100%",
//                     padding: "10px",
//                     marginTop: "5px",
//                     borderRadius: "5px",
//                     border: "1px solid #d1d5db",
//                   }}
//                 >
//                   <option value="">All</option>
//                   {[...CATEGORIES.expense, ...CATEGORIES.income].map((cat) => (
//                     <option key={cat} value={cat}>
//                       {cat}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label>Search</label>
//                 <input
//                   type="text"
//                   placeholder="Search description or tags"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   style={{
//                     width: "100%",
//                     padding: "10px",
//                     marginTop: "5px",
//                     borderRadius: "5px",
//                     border: "1px solid #d1d5db",
//                   }}
//                 />
//               </div>
//             </div>

//             <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
//               <button
//                 onClick={() => {
//                   setMonth("");
//                   setFilterType("");
//                   setFilterCategory("");
//                   setSearchTerm("");
//                 }}
//                 style={{
//                   padding: "10px 20px",
//                   background: "#6b7280",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Clear Filters
//               </button>
//               <button
//                 onClick={exportToCSV}
//                 style={{
//                   padding: "10px 20px",
//                   background: "#10b981",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                 }}
//               >
//                 📥 Export to CSV
//               </button>
//             </div>
//           </div>

//           {/* Transactions Table */}
//           <div style={{ padding: "20px", background: "#f9fafb", borderRadius: "10px" }}>
//             <h3>All Transactions ({filteredData.length})</h3>
//             <div style={{ overflowX: "auto", marginTop: "15px" }}>
//               <table
//                 style={{
//                   width: "100%",
//                   borderCollapse: "collapse",
//                   background: "white",
//                 }}
//               >
//                 <thead>
//                   <tr style={{ background: "#e5e7eb" }}>
//                     <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
//                     <th style={{ padding: "12px", textAlign: "left" }}>Type</th>
//                     <th style={{ padding: "12px", textAlign: "left" }}>Category</th>
//                     <th style={{ padding: "12px", textAlign: "left" }}>Amount</th>
//                     <th style={{ padding: "12px", textAlign: "left" }}>Description</th>
//                     <th style={{ padding: "12px", textAlign: "left" }}>Payment</th>
//                     <th style={{ padding: "12px", textAlign: "left" }}>Tags</th>
//                     <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredData.map((txn) => (
//                     <tr key={txn._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
//                       <td style={{ padding: "12px" }}>
//                         {new Date(txn.date).toLocaleDateString()}
//                       </td>
//                       <td style={{ padding: "12px" }}>
//                         <span
//                           style={{
//                             padding: "4px 8px",
//                             borderRadius: "4px",
//                             background:
//                               txn.type === "income"
//                                 ? "#d1fae5"
//                                 : txn.type === "expense"
//                                 ? "#fed7aa"
//                                 : "#fecaca",
//                             fontSize: "12px",
//                           }}
//                         >
//                           {txn.type}
//                         </span>
//                       </td>
//                       <td style={{ padding: "12px" }}>{txn.category || "-"}</td>
//                       <td style={{ padding: "12px", fontWeight: "bold" }}>
//                         ₹{txn.amount.toLocaleString()}
//                       </td>
//                       <td style={{ padding: "12px" }}>{txn.description || "-"}</td>
//                       <td style={{ padding: "12px" }}>{txn.paymentMethod || "-"}</td>
//                       <td style={{ padding: "12px" }}>
//                         {txn.tags?.map((tag) => (
//                           <span
//                             key={tag}
//                             style={{
//                               padding: "2px 6px",
//                               background: "#dbeafe",
//                               borderRadius: "3px",
//                               fontSize: "11px",
//                               marginRight: "4px",
//                             }}
//                           >
//                             {tag}
//                           </span>
//                         ))}
//                       </td>
//                       <td style={{ padding: "12px" }}>
//                         <button
//                           onClick={() => editTxn(txn)}
//                           style={{
//                             padding: "5px 10px",
//                             marginRight: "5px",
//                             background: "#3b82f6",
//                             color: "white",
//                             border: "none",
//                             borderRadius: "3px",
//                             cursor: "pointer",
//                           }}
//                         >
//                           ✏️
//                         </button>
//                         <button
//                           onClick={() => deleteTxn(txn._id)}
//                           style={{
//                             padding: "5px 10px",
//                             background: "#ef4444",
//                             color: "white",
//                             border: "none",
//                             borderRadius: "3px",
//                             cursor: "pointer",
//                           }}
//                         >
//                           🗑️
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import "./dashboard.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

// 🎨 Predefined Categories
const CATEGORIES = {
  expense: [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Groceries",
    "Rent",
    "Other",
  ],
  income: [
    "Salary",
    "Freelance",
    "Investment",
    "Business",
    "Gift",
    "Other",
  ],
};

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [remark, setRemark] = useState("");
  const [category, setCategory] = useState("Other");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [tags, setTags] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState("monthly");
  const [editingId, setEditingId] = useState(null);
  const [month, setMonth] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [viewMode, setViewMode] = useState("dashboard"); // dashboard, analytics, list

  async function loadData() {
    const res = await fetch("/api/transactions");
    const result = await res.json();
    setData(result);
  }

  useEffect(() => {
    loadData();
  }, []);

  // 📆 Advanced Filtering
  const filteredData = data.filter((x) => {
    let matches = true;

    if (month && x.date?.slice(0, 7) !== month) matches = false;
    if (filterCategory && x.category !== filterCategory) matches = false;
    if (filterType && x.type !== filterType) matches = false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchesDesc = x.description?.toLowerCase().includes(search);
      const matchesTags = x.tags?.some((tag) =>
        tag.toLowerCase().includes(search)
      );
      if (!matchesDesc && !matchesTags) matches = false;
    }

    return matches;
  });

  // ===== Calculations =====
  const income = filteredData
    .filter((x) => x.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = filteredData
    .filter((x) => x.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const creditTotal = filteredData
    .filter((x) => x.type === "credit")
    .reduce((a, b) => a + b.amount, 0);

  const creditPaid = filteredData
    .filter((x) => x.type === "credit_payment")
    .reduce((a, b) => a + b.amount, 0);

  const creditRemaining = Math.max(0, creditTotal - creditPaid);
  const balance = income + creditRemaining - expense;

  // 📊 Category-wise breakdown
  const categoryBreakdown = {};
  filteredData
    .filter((x) => x.type === "expense")
    .forEach((x) => {
      const cat = x.category || "Other";
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + x.amount;
    });

  // 📈 Monthly trend (last 6 months)
  const getMonthlyTrend = () => {
    const months = {};
    const now = new Date();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      months[key] = { income: 0, expense: 0 };
    }

    data.forEach((x) => {
      const monthKey = x.date?.slice(0, 7);
      if (months[monthKey]) {
        if (x.type === "income") {
          months[monthKey].income += x.amount;
        } else if (x.type === "expense") {
          months[monthKey].expense += x.amount;
        }
      }
    });

    return months;
  };

  const monthlyTrend = getMonthlyTrend();

  // ===== Add / Update =====
  async function saveTxn() {
    if (!amount || Number(amount) <= 0) return alert("Enter valid amount");

    if (type === "credit_payment" && Number(amount) > creditRemaining) {
      return alert("Payment cannot exceed credit due");
    }

    const payload = {
      amount: Number(amount),
      type,
      description: remark,
      category,
      paymentMethod,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : null,
    };

    try {
      if (editingId) {
        payload._id = editingId;
        await fetch("/api/transactions", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      resetForm();
      loadData();
    } catch (error) {
      alert("Error saving transaction");
    }
  }

  function editTxn(txn) {
    setEditingId(txn._id);
    setAmount(txn.amount);
    setType(txn.type);
    setRemark(txn.description || "");
    setCategory(txn.category || "Other");
    setPaymentMethod(txn.paymentMethod || "cash");
    setTags(txn.tags?.join(", ") || "");
    setIsRecurring(txn.isRecurring || false);
    setRecurringFrequency(txn.recurringFrequency || "monthly");
  }

  async function deleteTxn(id) {
    if (!confirm("Delete this transaction?")) return;

    try {
      await fetch("/api/transactions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      loadData();
    } catch (error) {
      alert("Error deleting transaction");
    }
  }

  function resetForm() {
    setEditingId(null);
    setAmount("");
    setType("expense");
    setRemark("");
    setCategory("Other");
    setPaymentMethod("cash");
    setTags("");
    setIsRecurring(false);
    setRecurringFrequency("monthly");
  }

  // 📊 Chart configurations
  const barChartData = {
    labels: ["Income", "Expense", "Credit Due"],
    datasets: [
      {
        label: "Amount (₹)",
        data: [income, expense, creditRemaining],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
      },
    ],
  };

  const pieChartData = {
    labels: Object.keys(categoryBreakdown),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categoryBreakdown),
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#ec4899",
          "#06b6d4",
          "#84cc16",
        ],
      },
    ],
  };

  const lineChartData = {
    labels: Object.keys(monthlyTrend),
    datasets: [
      {
        label: "Income",
        data: Object.values(monthlyTrend).map((m) => m.income),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
      {
        label: "Expense",
        data: Object.values(monthlyTrend).map((m) => m.expense),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
      },
    ],
  };

  // 📥 Export to CSV
  function exportToCSV() {
    const headers = [
      "Date",
      "Type",
      "Category",
      "Amount",
      "Description",
      "Payment Method",
      "Tags",
    ];
    const rows = filteredData.map((x) => [
      new Date(x.date).toLocaleDateString(),
      x.type,
      x.category || "",
      x.amount,
      x.description || "",
      x.paymentMethod || "",
      x.tags?.join("; ") || "",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  return (
    <div className="dashboard">
      <h1 className="page-title">💰 Personal Finance Manager</h1>

      {/* View Mode Tabs */}
      <div className="top-bt">
        <button
          onClick={() => setViewMode("dashboard")}
          className={`tab-btn ${viewMode === "dashboard" ? "active" : ""}`}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setViewMode("analytics")}
          className={`tab-btn ${viewMode === "analytics" ? "active" : ""}`}
        >
          📈 Analytics
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`tab-btn ${viewMode === "list" ? "active" : ""}`}
        >
          📋 Transactions
        </button>
      </div>

      {/* ========== DASHBOARD VIEW ========== */}
      {viewMode === "dashboard" && (
        <div>
          {/* Summary Cards */}
          <div className="summary-grid">
            <div className="summary-card income-card">
              <h3>💰 Total Income</h3>
              <h2>₹{income.toLocaleString()}</h2>
            </div>
            <div className="summary-card expense-card">
              <h3>💸 Total Expense</h3>
              <h2>₹{expense.toLocaleString()}</h2>
            </div>
            <div className="summary-card credit-card">
              <h3>💳 Credit Due</h3>
              <h2>₹{creditRemaining.toLocaleString()}</h2>
            </div>
            <div className="summary-card balance-card">
              <h3>💼 Balance</h3>
              <h2>₹{balance.toLocaleString()}</h2>
            </div>
          </div>

          {/* Charts */}
          <div className="charts-grid">
            <div className="chart-container sss">
              <h3>Overview</h3>
              <Bar data={barChartData} options={{ maintainAspectRatio: true }} />
            </div>
            <div className="chart-container">
              <h3>Expenses by Category</h3>
              {Object.keys(categoryBreakdown).length > 0 ? (
                <Pie data={pieChartData} options={{ maintainAspectRatio: true }} />
              ) : (
                <p>No expense data</p>
              )}
            </div>
          </div>

          {/* Add Transaction Form */}
          <div className="form-container">
            <h3>{editingId ? "✏️ Edit" : "➕ Add"} Transaction</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Amount *</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Type *</label>
                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setCategory("Other");
                  }}
                  className="form-input"
                >
                  <option value="expense">💸 Expense</option>
                  <option value="income">💰 Income</option>
                  <option value="credit">💳 Credit Card Spend</option>
                  <option value="credit_payment">✅ Pay Credit Card</option>
                </select>
              </div>

              {(type === "expense" || type === "income") && (
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-input"
                  >
                    {CATEGORIES[type]?.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-input"
                >
                  <option value="cash">💵 Cash</option>
                  <option value="card">💳 Card</option>
                  <option value="upi">📱 UPI</option>
                  <option value="bank_transfer">🏦 Bank Transfer</option>
                  <option value="other">🔄 Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="Add a note"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., work, travel"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                  />
                  Recurring Transaction
                </label>
                {isRecurring && (
                  <select
                    value={recurringFrequency}
                    onChange={(e) => setRecurringFrequency(e.target.value)}
                    className="form-input"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                onClick={saveTxn}
                className="btn-primary"
              >
                {editingId ? "Update" : "Add"} Transaction
              </button>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========== ANALYTICS VIEW ========== */}
      {viewMode === "analytics" && (
        <div>
          <div className="chart-container">
            <h3>📈 6-Month Trend</h3>
            <Line data={lineChartData} options={{ maintainAspectRatio: true }} />
          </div>

          <div className="analytics-grid">
            <div className="card">
              <h3>💸 Top Expense Categories</h3>
              <ul className="category-list">
                {Object.entries(categoryBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([cat, amt]) => (
                    <li key={cat}>
                      <strong>{cat}:</strong> ₹{amt.toLocaleString()}
                    </li>
                  ))}
              </ul>
            </div>

            <div className="card">
              <h3>📊 Statistics</h3>
              <p>
                <strong>Average Expense:</strong> ₹
                {filteredData.filter((x) => x.type === "expense").length > 0
                  ? Math.round(
                      expense / filteredData.filter((x) => x.type === "expense").length
                    )
                  : 0}
              </p>
              <p>
                <strong>Total Transactions:</strong> {filteredData.length}
              </p>
              <p>
                <strong>Savings Rate:</strong>{" "}
                {income > 0 ? Math.round(((income - expense) / income) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========== TRANSACTIONS LIST VIEW ========== */}
      {viewMode === "list" && (
        <div>
          {/* Filters */}
          <div className="filters-container">
            <h3>🔍 Filters</h3>
            <div className="filters-grid">
              <div className="form-group">
                <label>Month</label>
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="form-input"
                >
                  <option value="">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                  <option value="credit">Credit</option>
                  <option value="credit_payment">Credit Payment</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="form-input"
                >
                  <option value="">All</option>
                  {[...CATEGORIES.expense, ...CATEGORIES.income].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Search</label>
                <input
                  type="text"
                  placeholder="Search description or tags"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="filter-actions">
              <button
                onClick={() => {
                  setMonth("");
                  setFilterType("");
                  setFilterCategory("");
                  setSearchTerm("");
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
              <button
                onClick={exportToCSV}
                className="btn-success"
              >
                📥 Export to CSV
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="transactions-container">
            <h3>All Transactions ({filteredData.length})</h3>
            <div className="table-wrapper">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Payment</th>
                    <th>Tags</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((txn) => (
                    <tr key={txn._id}>
                      <td>
                        {new Date(txn.date).toLocaleDateString()}
                      </td>
                      <td>
                        <span className={`type-badge type-${txn.type}`}>
                          {txn.type}
                        </span>
                      </td>
                      <td>{txn.category || "-"}</td>
                      <td className="amount-cell">₹{txn.amount.toLocaleString()}</td>
                      <td>{txn.description || "-"}</td>
                      <td>{txn.paymentMethod || "-"}</td>
                      <td>
                        {txn.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="tag"
                          >
                            {tag}
                          </span>
                        ))}
                      </td>
                      <td>
                        <button
                          onClick={() => editTxn(txn)}
                          className="action-btn edit-btn"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteTxn(txn._id)}
                          className="action-btn delete-btn"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
