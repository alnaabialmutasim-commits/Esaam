
import React, { useState } from 'react';
import { Goal } from '../types';
import Modal from './Modal';
import { PlusCircleIcon, TrashIcon } from './Icons';

interface GoalFormProps {
    addGoal: (goal: Omit<Goal, 'id'>) => void;
    onClose: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ addGoal, onClose }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addGoal({ name, targetAmount: parseFloat(targetAmount), currentAmount: 0, deadline });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">اسم الهدف</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600" placeholder="شراء سيارة جديدة" required />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">المبلغ المستهدف</label>
                <input type="number" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600" placeholder="100000" required />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">الموعد النهائي</label>
                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            <div className="flex justify-end space-i-3">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">إلغاء</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">إضافة</button>
            </div>
        </form>
    );
};

const GoalsPage: React.FC<{ goals: Goal[], addGoal: (goal: Omit<Goal, 'id'>) => void, updateGoal: (goal: Goal) => void, deleteGoal: (id: string) => void }> = ({ goals, addGoal, updateGoal, deleteGoal }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleAddContribution = (goal: Goal, amount: number) => {
        const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
        updateGoal({ ...goal, currentAmount: newAmount });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">الأهداف المالية</h2>
                <button onClick={() => setModalOpen(true)} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors">
                    <PlusCircleIcon className="h-6 w-6 ml-2" />
                    إضافة هدف
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map(goal => {
                    const percentage = (goal.currentAmount / goal.targetAmount) * 100;
                    return (
                        <div key={goal.id} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md transition-colors duration-300">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg">{goal.name}</h3>
                                <button onClick={() => deleteGoal(goal.id)} className="text-gray-400 hover:text-red-500">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">الموعد: {new Date(goal.deadline).toLocaleDateString('ar-EG')}</p>
                            
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 my-2">
                                <div className="bg-blue-600 h-4 rounded-full text-center text-white text-xs" style={{ width: `${percentage}%` }}>
                                    {Math.round(percentage)}%
                                </div>
                            </div>
                            
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p>{goal.currentAmount.toLocaleString('ar-OM', { style: 'currency', currency: 'OMR' })} / {goal.targetAmount.toLocaleString('ar-OM', { style: 'currency', currency: 'OMR' })}</p>
                            </div>
                            
                            <div className="mt-4 flex space-i-2">
                                <button onClick={() => handleAddContribution(goal, 100)} className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-3 py-1 rounded-full hover:bg-green-200">+100</button>
                                <button onClick={() => handleAddContribution(goal, 500)} className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-3 py-1 rounded-full hover:bg-green-200">+500</button>
                                <button onClick={() => handleAddContribution(goal, 1000)} className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-3 py-1 rounded-full hover:bg-green-200">+1000</button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {goals.length === 0 && <p className="text-center py-8 text-gray-500 bg-white dark:bg-gray-800 rounded-lg shadow-md">لم تقم بتحديد أي أهداف بعد.</p>}

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="إضافة هدف مالي جديد">
                <GoalForm addGoal={addGoal} onClose={() => setModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default GoalsPage;
