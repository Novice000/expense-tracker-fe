import { create } from "zustand";
import { Expense } from "@/components/dashboard/table/table-def";


type fetchLimit = {
  expenses: Expense[];
  total: number;
  setTotal: (total: number) => void;
  setExpense: (expense: []) => void;
};

type User = {
    username: string;
    budget: number;
    setBudget: (budget: number)=>void;
    setUsername: (username: string) => void;
}

const useExpenseStore = create<fetchLimit>((set) => ({
    expenses: [],
    total: 0,
    setTotal: (total: number) => set(()=>({ total: total })),
    setExpense: (expense: [])=> set(()=>({expenses: [...expense]}))
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
