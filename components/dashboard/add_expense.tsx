"use client";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { expenseSchema } from "@/schemas/expense";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { postExpense } from "@/axios/util";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react"; // Importing a spinner icon

function AddExpenseForm({ className }: { className?: string }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postExpense,
    onSuccess: () => {
      toast.success("Added Expense successfully");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: () => {
      toast.error("Error Adding Expense", {
        description: "Please try again",
      });
    },
  });

  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: "",
      description: "",
    },
  });

  async function handleSubmit(data: z.infer<typeof expenseSchema>) {
    mutation.mutate(data);
  }

  return (
    <Card className={`${className || ""}`}>
      <Form {...form}>
        <form
          className="space-y-6 w-full px-5 h-full flex flex-col justify-center content-center"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <h1 className="text-2xl text-center font-bold">Add Expenses</h1>

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    placeholder="Amount"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    value={field.value}
                    placeholder="Description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Expense"
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
}

export default AddExpenseForm;
