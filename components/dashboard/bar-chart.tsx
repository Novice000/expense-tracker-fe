"use client";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React,{ useEffect, useState } from "react";
import { useExpenseStore } from "@/store/store";

const chartConfig = {
  expense: {
    label: "expense",
    color: "var(--chart-2)",
  },
//   mobile: {
//     label: "Mobile",
//     color: "hsl(var(--chart-2))",
//   },
} satisfies ChartConfig;

type chartType = {
    month: string
    expense: number
}

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function ExpenseBarChart( {className}: {className?: string}) {
  const { expenses } = useExpenseStore(); // Use all expenses, not just filtered ones
  const [chartData, setChartData] = useState<chartType[]>([]);

  useEffect(() => {
    console.log(expenses);
    setChartData(() => {
      return expenses.reduce((acc, element) => {
        const dateMonth = new Date(element.timestamp).getMonth();
        const month = monthNames[dateMonth];

        const existingEntry = acc.find((item) => item.month === month);
        if (existingEntry) {
          existingEntry.expense += element.amount;
        } else {
          acc.push({ month, expense: element.amount });
        }

        return [...acc]; // Ensure a new array reference
      }, [] as chartType[]);
    });
  }, [expenses]); // Depend on all expenses

  return (
    <Card className={`${className? className: ""}`}>
      <CardContent>
        <ChartContainer className="h-full" config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="expense"
              fill={chartConfig.expense.color}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {chartData.reduce((acc, item) => acc + item.expense, 0)}{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {chartData.length === 0
            ? "No data available"
            : chartData.length > 1
            ? "Show total spend for each month"
            : `Show total spend for ${chartData[0]?.month}`}
        </div>
      </CardFooter>
    </Card>
  );
}


export default ExpenseBarChart;
