
import React from 'react';
import { Transaction, TransactionType, Goal, Budget } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface SummaryCardProps {
  title: string;
  amount: number;
  color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300">
    <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">{title}</h3>
    <p className={`text-3xl font-bold ${color}`}>
      {amount.toLocaleString('ar-OM', { style: 'currency', currency: 'OMR' })}
    </p>
  </div>
);

const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getDaysUntilText = (days: number) => {
    if (days === 0) return 'مستحق اليوم';
    if (days === 1) return 'مستحق غداً';
    return `مستحق خلال ${days} أيام`;
};

const Dashboard: React.FC<{ transactions: Transaction[], goals: Goal[], budgets: Budget[] }> = ({ transactions, goals }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const totalIncome = monthlyTransactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = monthlyTransactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const expenseByCategory = monthlyTransactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as { [key: string]: number });
  
  const chartData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943'];

  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  
  const upcomingExpenses = transactions
    .filter(t => {
        if (!t.isRecurring || t.type !== TransactionType.EXPENSE) return false;
        const daysUntil = getDaysUntil(t.date);
        const reminderDays = t.reminderPeriod ?? 7; // Use custom period, or default to 7
        return daysUntil >= 0 && daysUntil <= reminderDays;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="إجمالي الدخل (الشهر الحالي)" amount={totalIncome} color="text-green-500" />
        <SummaryCard title="إجمالي المصروفات (الشهر الحالي)" amount={totalExpense} color="text-red-500" />
        <SummaryCard title="الرصيد المتبقي" amount={balance} color={balance >= 0 ? 'text-blue-500' : 'text-red-500'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300">
          <h3 className="text-xl font-bold mb-4">ملخص الإنفاق الشهري</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <XAxis type="number" stroke="rgba(156, 163, 175, 0.7)" />
              <YAxis dataKey="name" type="category" width={80} stroke="rgba(156, 163, 175, 0.7)" />
              <Tooltip
                formatter={(value: number) => value.toLocaleString('ar-OM', { style: 'currency', currency: 'OMR' })}
                cursor={{ fill: 'rgba(255, 255, 255, 0.1)'}}
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}
              />
              <Bar dataKey="value" fill="#3b82f6" barSize={20} radius={[0, 10, 10, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300">
          <h3 className="text-xl font-bold mb-4">فئات المصروفات</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value: number) => value.toLocaleString('ar-OM', { style: 'currency', currency: 'OMR' })} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300">
          <h3 className="text-xl font-bold mb-4">تنبيهات المصروفات القادمة</h3>
          <ul className="space-y-3">
             {upcomingExpenses.length > 0 ? (
                upcomingExpenses.map(t => {
                    const daysUntil = getDaysUntil(t.date);
                    return (
                      <li key={t.id} className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg border-r-4 border-yellow-400">
                        <div>
                          <p className="font-semibold">{t.description}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {getDaysUntilText(daysUntil)}
                          </p>
                        </div>
                        <p className="font-bold text-red-500">
                          {t.amount.toLocaleString('ar-OM', { style: 'currency', currency: 'OMR' })}
                        </p>
                      </li>
                    );
                })
             ) : (
                <p className="text-gray-500 dark:text-gray-400">لا توجد مصروفات متكررة قادمة.</p>
             )}
          </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300">
          <h3 className="text-xl font-bold mb-4">أحدث المعاملات</h3>
          <ul className="space-y-3">
            {recentTransactions.map(t => (
              <li key={t.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-semibold">{t.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.category} - {new Date(t.date).toLocaleDateString('ar-EG')}</p>
                </div>
                <p className={`font-bold ${t.type === TransactionType.INCOME ? 'text-green-500' : 'text-red-500'}`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'} {t.amount.toLocaleString('ar-OM', { style: 'currency', currency: 'OMR' })}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300">
          <h3 className="text-xl font-bold mb-4">تقدم الأهداف</h3>
          <ul className="space-y-4">
            {goals.slice(0, 3).map(goal => (
              <li key={goal.id}>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">{goal.name}</span>
                  <span className="text-sm">{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}></div>
                </div>
              </li>
            ))}
            {goals.length === 0 && <p className="text-gray-500 dark:text-gray-400">لم تقم بتحديد أي أهداف بعد.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
