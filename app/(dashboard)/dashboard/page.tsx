"use client"
import React from "react";
import { DataTable } from "@/components/dashboard/table/table";
import AddExpenseForm from "@/components/dashboard/add_expense";
import { useExpenseStore } from "@/store/store";
import { useAuth } from "@/hooks/useAuth";
import { HashLoader } from "react-spinners";
import { useRouter } from "next/navigation";

function Dashboard(){
    const router = useRouter()
    const { total } = useExpenseStore()
    const { loading, isAuthenticated} = useAuth();

    if(loading){
        return (
            <div className="h-full w-full grid place-content-center">
                <HashLoader />
            </div>
        )
    }

    return (
      <div className="min-h-screen grid grid-rows-3 px-5">
        <div className="grid h-full grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-black h-full col-span-2"></div>
          <AddExpenseForm />
        </div>
        <div className="grid grid-cols-1 row-span-2 md:grid-cols-3">
          <div className="text-6xl grid place-content-center">${total}</div>
          <DataTable className="h-full col-span-2" />
        </div>
      </div>
    );
}

export default Dashboard