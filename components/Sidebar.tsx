
import React from 'react';
import { View } from '../types';
import { DashboardIcon, TransactionIcon, BudgetIcon, GoalIcon, ReportIcon, CloseIcon } from './Icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
      isActive
        ? 'bg-blue-600 text-white shadow-lg'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {icon}
    <span className="mr-4 font-semibold">{label}</span>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, setIsOpen }) => {
  const handleNavigation = (view: View) => {
    setCurrentView(view);
    if (window.innerWidth < 768) { // md breakpoint
      setIsOpen(false);
    }
  };

  const navItems = [
    { view: View.DASHBOARD, label: 'لوحة التحكم', icon: <DashboardIcon className="h-6 w-6" /> },
    { view: View.TRANSACTIONS, label: 'المعاملات', icon: <TransactionIcon className="h-6 w-6" /> },
    { view: View.BUDGETS, label: 'الميزانيات', icon: <BudgetIcon className="h-6 w-6" /> },
    { view: View.GOALS, label: 'الأهداف', icon: <GoalIcon className="h-6 w-6" /> },
    { view: View.REPORTS, label: 'التقارير', icon: <ReportIcon className="h-6 w-6" /> },
  ];

  return (
    <>
      <div className={`fixed top-0 right-0 h-full bg-gray-800 text-white w-64 p-4 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0`}>
        <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold">المالية</h2>
            <button onClick={() => setIsOpen(false)} className="md:hidden p-2 rounded-md hover:bg-gray-700">
                <CloseIcon className="h-6 w-6"/>
            </button>
        </div>
        <nav>
          <ul>
            {navItems.map(item => (
              <NavItem
                key={item.view}
                icon={item.icon}
                label={item.label}
                isActive={currentView === item.view}
                onClick={() => handleNavigation(item.view)}
              />
            ))}
          </ul>
        </nav>
      </div>
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"></div>}
    </>
  );
};

export default Sidebar;
