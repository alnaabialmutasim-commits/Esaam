import React, { useState } from 'react';
import { Transaction, TransactionType, expenseCategories, incomeCategories } from '../types';

interface TransactionFormProps {
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ addTransaction, onClose }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [reminderPeriod, setReminderPeriod] = useState('7');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date || !description) {
      alert('الرجاء تعبئة جميع الحقول');
      return;
    }

    const newTransaction: Omit<Transaction, 'id'> = {
      type,
      amount: parseFloat(amount),
      category,
      date,
      description,
    };

    if (type === TransactionType.EXPENSE) {
      newTransaction.isRecurring = isRecurring;
      if (isRecurring) {
        newTransaction.reminderPeriod = parseInt(reminderPeriod, 10);
      }
    }

    addTransaction(newTransaction);
    
    onClose();
  };

  const categories = type === TransactionType.EXPENSE ? expenseCategories : incomeCategories;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">نوع المعاملة</label>
        <select value={type} onChange={e => {setType(e.target.value as TransactionType); setCategory('')}} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
          <option value={TransactionType.EXPENSE}>مصروف</option>
          <option value={TransactionType.INCOME}>دخل</option>
        </select>
      </div>
      
      {type === TransactionType.EXPENSE && (
         <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-md border dark:border-gray-700 space-y-3">
            <div className="flex items-center space-i-2">
                <input 
                    id="isRecurring"
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isRecurring" className="block text-sm font-medium">مصروف متكرر (سيتم استخدام التاريخ كتاريخ استحقاق)</label>
            </div>
            {isRecurring && (
              <div>
                <label htmlFor="reminderPeriod" className="block text-sm font-medium mb-1">فترة التذكير</label>
                <select 
                  id="reminderPeriod"
                  value={reminderPeriod}
                  onChange={(e) => setReminderPeriod(e.target.value)}
                  className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="1">قبل يوم واحد</option>
                  <option value="3">قبل 3 أيام</option>
                  <option value="7">قبل أسبوع واحد</option>
                </select>
              </div>
            )}
        </div>
      )}

      <div>
        <label htmlFor="amount" className="block text-sm font-medium mb-1">المبلغ</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          placeholder="0.00"
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">الفئة</label>
        <select
          id="category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          required
        >
          <option value="" disabled>اختر فئة</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      
      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-1">التاريخ</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">الوصف</label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          placeholder="مثال: فاتورة الكهرباء"
          rows={3}
          required
        ></textarea>
      </div>

      <div className="flex justify-end space-i-3">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">
          إلغاء
        </button>
        <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
          حفظ
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;