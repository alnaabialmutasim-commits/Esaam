
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { PlusCircleIcon, TrashIcon, RepeatIcon } from './Icons';
import TransactionForm from './TransactionForm';
import Modal from './Modal';

interface TransactionsPageProps {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions, addTransaction, deleteTransaction }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const filteredTransactions = sortedTransactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">قائمة المعاملات</h2>
          <div className="flex items-center space-i-2 mt-2">
            <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>الكل</button>
            <button onClick={() => setFilter(TransactionType.INCOME)} className={`px-3 py-1 rounded-full text-sm ${filter === TransactionType.INCOME ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>الدخل</button>
            <button onClick={() => setFilter(TransactionType.EXPENSE)} className={`px-3 py-1 rounded-full text-sm ${filter === TransactionType.EXPENSE ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>المصروفات</button>
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          <PlusCircleIcon className="h-6 w-6 ml-2" />
          إضافة معاملة
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="p-3 font-semibold text-sm">التاريخ / الاستحقاق</th>
              <th className="p-3 font-semibold text-sm">الوصف</th>
              <th className="p-3 font-semibold text-sm">الفئة</th>
              <th className="p-3 font-semibold text-sm">المبلغ</th>
              <th className="p-3 font-semibold text-sm">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(t => (
              <tr key={t.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="p-3">{new Date(t.date).toLocaleDateString('ar-EG')}</td>
                <td className="p-3">
                  <div className="flex items-center space-i-2">
                    <span>{t.description}</span>
                    {t.isRecurring && <RepeatIcon className="h-4 w-4 text-blue-500" title="مصروف متكرر" />}
                  </div>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-600">{t.category}</span>
                </td>
                <td className={`p-3 font-bold ${t.type === TransactionType.INCOME ? 'text-green-500' : 'text-red-500'}`}>
                  {t.amount.toLocaleString('ar-OM', { style: 'currency', currency: 'OMR' })}
                </td>
                <td className="p-3">
                  <button onClick={() => deleteTransaction(t.id)} className="text-gray-400 hover:text-red-500">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTransactions.length === 0 && <p className="text-center py-8 text-gray-500">لا توجد معاملات لعرضها.</p>}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="إضافة معاملة جديدة">
        <TransactionForm
          addTransaction={addTransaction}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default TransactionsPage;
