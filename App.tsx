
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Transaction, Budget, Goal, View } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionsPage from './components/TransactionsPage';
import BudgetsPage from './components/BudgetsPage';
import GoalsPage from './components/GoalsPage';
import ReportsPage from './components/ReportsPage';
import { MenuIcon, SunIcon, MoonIcon } from './components/Icons';

const App: React.FC = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [budgets, setBudgets] = useLocalStorage<Budget[]>('budgets', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', prefersDark ? 'dark' : 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setTransactions([...transactions, { ...transaction, id: crypto.randomUUID() }]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };
  
  const addBudget = (budget: Budget) => {
    setBudgets([...budgets.filter(b => b.category !== budget.category), budget]);
  };
  
  const addGoal = (goal: Omit<Goal, 'id'>) => {
    setGoals([...goals, { ...goal, id: crypto.randomUUID() }]);
  };
  
  const updateGoal = (updatedGoal: Goal) => {
    setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  }

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard transactions={transactions} goals={goals} budgets={budgets} />;
      case View.TRANSACTIONS:
        return <TransactionsPage transactions={transactions} addTransaction={addTransaction} deleteTransaction={deleteTransaction} />;
      case View.BUDGETS:
        return <BudgetsPage transactions={transactions} budgets={budgets} addBudget={addBudget} />;
      case View.GOALS:
        return <GoalsPage goals={goals} addGoal={addGoal} updateGoal={updateGoal} deleteGoal={deleteGoal} />;
      case View.REPORTS:
        return <ReportsPage transactions={transactions} />;
      default:
        return <Dashboard transactions={transactions} goals={goals} budgets={budgets} />;
    }
  };
  
  const viewTitles: { [key in View]: string } = {
    [View.DASHBOARD]: "لوحة التحكم",
    [View.TRANSACTIONS]: "المعاملات",
    [View.BUDGETS]: "الميزانيات",
    [View.GOALS]: "الأهداف المالية",
    [View.REPORTS]: "التقارير",
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <div className="flex">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
        <main className="flex-1 transition-all duration-300 md:mr-64">
           <header className="p-4 bg-white dark:bg-gray-800 shadow-md flex justify-between items-center transition-colors duration-300">
            <h1 className="text-xl md:text-2xl font-bold text-gray-700 dark:text-white">{viewTitles[currentView]}</h1>
             <div className="flex items-center gap-2">
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  {theme === 'light' ? <MoonIcon className="h-6 w-6 text-gray-700" /> : <SunIcon className="h-6 w-6 text-yellow-400" />}
                </button>
                <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                  <MenuIcon className="h-6 w-6" />
                </button>
            </div>
          </header>
          <div className="p-4 md:p-8">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
