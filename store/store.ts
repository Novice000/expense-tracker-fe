import { create } from "zustand";
import { Expense } from "@/components/dashboard/table/table-def";


type fetchLimit = {
  expenses: Expense[];
  filtered: Expense[];
  filteredTotal: number;
  total: number;
  setTotal: (total: number) => void;
  setExpense: (expense: Expense[]) => void;
  setFiltered: (expense: Expense[]) => void;
  setFilteredTotal: (total: number) => void;
};

type User = {
    username: string;
    budget: number;
    setBudget: (budget: number)=>void;
    setUsername: (username: string) => void;
}

const useExpenseStore = create<fetchLimit>((set) => ({
    expenses: [],
    filtered: [],
    filteredTotal: 0,
    total: 0,
    setFiltered: (expense: Expense[]) => set(() => ({ filtered: [...expense] })),
    setTotal: (total: number) => set(()=>({ total: total })),
    setFilteredTotal: (total: number) => set(()=>({ filteredTotal: total })),
    setExpense: (expense: Expense[])=> set(()=>({expenses: [...expense]}))
}))

const useUserStore = create<User>((set) => ({
    username: "",
    budget: 0,
    setBudget: (budget) => set(()=>({ budget: budget })),
    setUsername: (username)=>set(()=>({ username: username }))
}))

export {
    useExpenseStore,
    useUserStore
}
