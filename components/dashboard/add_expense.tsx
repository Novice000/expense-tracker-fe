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

function AddExpenseForm() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: postExpense,
    onSuccess: () => {
      toast.success("Added Expense successfully");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: () => {
      toast.error("Error Adding Expense", {
        description: "please try again",
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
    console.log(data);
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form
        className="space-y-6 w-full px-5 h-full flex flex-col justify-center content-center"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
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
                  placeholder="amount"
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
                  placeholder="description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Expense</Button>
      </form>
    </Form>
  );
}

export default AddExpenseForm;
