"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/auth";
import { z } from "zod";
import { Auth } from "@/axios/util";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // Importing loading spinner

function LoginForm({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    setLoading(true);
    const formdata = new FormData();
    formdata.append("username", data.username);
    formdata.append("password", data.password);

    try {
      await Auth("login", formdata);
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Login was not successful", {
        description: "Please check the form and try again",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`space-y-8 w-full md:w-[45dvh] p-10 shadow-2xl rounded-md ${
          className || ""
        }`}
      >
        <h1 className="text-2xl text-center md:text-3xl font-bold">Login</h1>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full text-center" disabled={loading}>
          {loading ? <Loader2 className="animate-spin mr-2" /> : "Submit"}
        </Button>

        <div>
          Don't have an account?{" "}
          <span
            className="text-black underline cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Register
          </span>
        </div>
      </form>
    </Form>
  );
}

export default LoginForm;
