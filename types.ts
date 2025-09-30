export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  description: string;
  isRecurring?: boolean;
  reminderPeriod?: number;
}

export interface Budget {
  category: string;
  limit: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export enum View {
  DASHBOARD = 'dashboard',
  TRANSACTIONS = 'transactions',
  BUDGETS = 'budgets',
  GOALS = 'goals',
  REPORTS = 'reports',
}

export const expenseCategories = [
  "طعام", "فواتير", "مواصلات", "ترفيه", "تعليم", "صحة", "إيجار", "تسوق", "أخرى"
];

export const incomeCategories = [
  "راتب", "دخل إضافي", "استثمارات", "هدايا", "أخرى"
];