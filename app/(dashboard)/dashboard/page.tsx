"use client";
import React from "react";
import { DataTable } from "@/components/dashboard/table/table";
import AddExpenseForm from "@/components/dashboard/add_expense";
import { useExpenseStore } from "@/store/store";
import { useAuth } from "@/hooks/useAuth";
import { HashLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import ExpenseBarChart from "@/components/dashboard/bar-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ExpenseBudgetPieChart from "@/components/dashboard/pie-charts";

function Dashboard() {
  const router = useRouter();
  const { total } = useExpenseStore();
  const { loading, isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col px-5 py-3 h-screen gap-2">
      <div className="flex flex-col md:flex-row justify-between gap-2">
        <ExpenseBarChart className="flex-2/5" />
        <ExpenseBudgetPieChart className="flex-2/5" />
        <AddExpenseForm className="flex-1/5" />
      </div>
      <div className="flex md:flex-row flex-col gap-2 items-center">
        <Card className="flex flex-col items-center justify-center flex-1/5 gap-2 p-6 shadow-md bg-background">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold text-muted-foreground">
              Total Expense
            </CardTitle>
            <CardDescription className="text-md text-muted-foreground">
              Overall spending
            </CardDescription>
          </CardHeader>
          <CardContent className="text-4xl text-center font-bold text-destructive">
            ${total.toLocaleString()}
          </CardContent>
        </Card>
        <DataTable className="col-span-2" />
      </div>
    </div>
  );
}

export default Dashboard;
