
import React, { createContext, useContext, useReducer, useEffect } from 'react';

export type Category = 
  | 'housing' 
  | 'transportation' 
  | 'food' 
  | 'utilities' 
  | 'entertainment' 
  | 'health' 
  | 'shopping' 
  | 'personal' 
  | 'education' 
  | 'income'
  | 'other';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: Category;
  date: string;
  userId: string;
}

export interface Budget {
  id: string;
  category: Category;
  amount: number;
  userId: string;
}

interface StoreState {
  expenses: Expense[];
  budgets: Budget[];
}

type StoreAction = 
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'SET_BUDGETS'; payload: Budget[] };

const initialState: StoreState = {
  expenses: [],
  budgets: []
};

// Reducer for our store
const storeReducer = (state: StoreState, action: StoreAction): StoreState => {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload]
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense => 
          expense.id === action.payload.id ? action.payload : expense
        )
      };
    case 'ADD_BUDGET':
      return {
        ...state,
        budgets: [...state.budgets, action.payload]
      };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(budget => 
          budget.id === action.payload.id ? action.payload : budget
        )
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(budget => budget.id !== action.payload)
      };
    case 'SET_EXPENSES':
      return {
        ...state,
        expenses: action.payload
      };
    case 'SET_BUDGETS':
      return {
        ...state,
        budgets: action.payload
      };
    default:
      return state;
  }
};

// Context for our store
interface StoreContextType {
  state: StoreState;
  dispatch: React.Dispatch<StoreAction>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses');
    const storedBudgets = localStorage.getItem('budgets');

    if (storedExpenses) {
      dispatch({ type: 'SET_EXPENSES', payload: JSON.parse(storedExpenses) });
    }

    if (storedBudgets) {
      dispatch({ type: 'SET_BUDGETS', payload: JSON.parse(storedBudgets) });
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(state.expenses));
    localStorage.setItem('budgets', JSON.stringify(state.budgets));
  }, [state]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

// Helper functions for interacting with the store
export const useExpenses = (userId: string) => {
  const { state } = useStore();
  return state.expenses.filter(expense => expense.userId === userId);
};

export const useBudgets = (userId: string) => {
  const { state } = useStore();
  return state.budgets.filter(budget => budget.userId === userId);
};

export const useExpensesByCategory = (userId: string) => {
  const expenses = useExpenses(userId);
  return expenses.reduce<Record<Category, number>>((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<Category, number>);
};

export const useExpenseTotal = (userId: string) => {
  const expenses = useExpenses(userId);
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};
