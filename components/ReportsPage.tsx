
import React, { useMemo, useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ExportIcon } from './Icons';

const ReportsPage: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const [timeframe, setTimeframe] = useState('monthly'); // could be 'yearly'

    const handleExportCSV = () => {
        if (transactions.length === 0) {
            alert('لا توجد معاملات لتصديرها.');
            return;
        }

        const headers = ['المعرف', 'النوع', 'الفئة', 'المبلغ', 'التاريخ', 'الوصف', 'متكرر'];
        
        const formatValue = (value: any) => {
            const str = String(value ?? '').replace(/"/g, '""'); // Escape double quotes
            return `"${str}"`;
        };
        
        const csvRows = transactions.map(t => {
            const row = [
                t.id,
                t.type === 'income' ? 'دخل' : 'مصروف',
                t.category,
                t.amount,
                t.date,
                t.description,
                t.isRecurring ? 'نعم' : 'لا'
            ];
            return row.map(formatValue).join(',');
        });

        const csvString = [headers.map(formatValue).join(','), ...csvRows].join('\n');
        
        // Add BOM for Excel compatibility with Arabic characters
        const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
        
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'transactions.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const data = useMemo(() => {
        const now = new Date();
        return transactions
            .filter(t => {
                const date = new Date(t.date);
                if (timeframe === 'monthly') {
                    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
                }
                // yearly
                return date.getFullYear() === now.getFullYear();
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [transactions, timeframe]);

    const incomeVsExpenseData = useMemo(() => {
        const groupedData: { [key: string]: { income: number; expense: number } } = {};
        data.forEach(t => {
            const dateKey = new Date(t.date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
            if (!groupedData[dateKey]) {
                groupedData[dateKey] = { income: 0, expense: 0 };
            }
            if (t.type === TransactionType.INCOME) {
                groupedData[dateKey].income += t.amount;
            } else {
                groupedData[dateKey].expense += t.amount;
            }
        });

        return Object.entries(groupedData).map(([date, values]) => ({
            date,
            ...values,
        }));
    }, [data]);

    const expenseByCategory = useMemo(() => {
        const categoryMap: { [key: string]: number } = {};
        data.filter(t => t.type === TransactionType.EXPENSE).forEach(t => {
            categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
        });
        return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
    }, [data]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943'];

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">تقارير المعاملات</h2>
                  <button 
                      onClick={handleExportCSV}
                      className="flex items-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                  >
                      <ExportIcon className="h-5 w-5 ml-2" />
                      تصدير كـ CSV
                  </button>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-600 dark:text-gray-300">الدخل مقابل المصروفات</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={incomeVsExpenseData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                        <XAxis dataKey="date" stroke="rgba(156, 163, 175, 0.7)" />
                        <YAxis stroke="rgba(156, 163, 175, 0.7)" />
                        <Tooltip
                            formatter={(value: number) => value.toLocaleString('ar-OM', { style: 'currency', currency: 'OMR' })}
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="income" name="الدخل" stroke="#22c55e" strokeWidth={2} />
                        <Line type="monotone" dataKey="expense" name="المصروفات" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300">
                <h2 className="text-2xl font-bold mb-4">توزيع المصروفات حسب الفئة</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        {/* FIX: The 'percent' prop from recharts can be undefined. Fallback to 0 to prevent arithmetic errors. */}
                        <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                            {expenseByCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip 
                            formatter={(value: number) => value.toLocaleString('ar-OM', { style: 'currency', currency: 'OMR' })}
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}
                        />
                         <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ReportsPage;