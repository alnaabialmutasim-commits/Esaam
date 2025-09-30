
import React, { useState } from 'react';
import { Budget, Transaction, TransactionType, expenseCategories } from '../types';
import Modal from './Modal';
import { PlusCircleIcon } from './Icons';

interface BudgetCardProps {
    budget: Budget;
    spent: number;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget, spent }) => {
    const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
    const remaining = budget.limit - spent;
    let progressBarColor = 'bg-green-500';
    if (percentage > 75) progressBarColor = 'bg-yellow-500';
    if (percentage >= 100) progressBarColor = 'bg-red-500';

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-colors duration-300">
            <h3 className="font-bold text-lg">{budget.category}</h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 my-2">
                <div className={`${progressBarColor} h-4 rounded-full`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>المنفق: {spent.toLocaleString('ar-OM', { style: 'currency', currency: 'OMR' })}</p>
                <p>المتبقي: {remaining.toLocaleString('ar-OM', { style: 'currency', currency: 'OMR' })} / {budget.limit.toLocaleString('ar-OM', { style: 'currency', currency: 'OMR' })}</p>
            </div>
        </div>
    );
};


interface BudgetFormProps {
    addBudget: (budget: Budget) => void;
    onClose: () => void;
    existingCategories: string[];
}

const BudgetForm: React.FC<BudgetFormProps> = ({ addBudget, onClose, existingCategories }) => {
    const [category, setCategory] = useState('');
    const [limit, setLimit] = useState('');

    const availableCategories = expenseCategories.filter(c => !existingCategories.includes(c));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!category || !limit) return;
        addBudget({ category, limit: parseFloat(limit) });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">الفئة</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required>
                    <option value="" disabled>اختر فئة</option>
                    {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">الحد الأقصى للميزانية</label>
                <input type="number" value={limit} onChange={e => setLimit(e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600" placeholder="5000" required />
            </div>
            <div className="flex justify-end space-i-3">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">إلغاء</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">إضافة</button>
            </div>
        </form>
    );
};


const BudgetsPage: React.FC<{ transactions: Transaction[], budgets: Budget[], addBudget: (budget: Budget) => void }> = ({ transactions, budgets, addBudget }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const expensesByCategory = transactions
        .filter(t => t.type === TransactionType.EXPENSE && new Date(t.date).getMonth() === new Date().getMonth())
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as { [key: string]: number });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">الميزانيات الشهرية</h2>
                <button onClick={() => setModalOpen(true)} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors">
                    <PlusCircleIcon className="h-6 w-6 ml-2" />
                    إضافة ميزانية
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets.map(budget => (
                    <BudgetCard key={budget.category} budget={budget} spent={expensesByCategory[budget.category] || 0} />
                ))}
            </div>
            {budgets.length === 0 && <p className="text-center py-8 text-gray-500 bg-white dark:bg-gray-800 rounded-lg shadow-md">لم تقم بإضافة أي ميزانيات بعد.</p>}

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="إضافة ميزانية جديدة">
                <BudgetForm addBudget={addBudget} onClose={() => setModalOpen(false)} existingCategories={budgets.map(b => b.category)} />
            </Modal>
        </div>
    );
};

export default BudgetsPage;
