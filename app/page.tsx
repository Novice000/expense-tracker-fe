import React from "react";
import { Button } from "@/components/ui/button";
import TypeWritter from "@/components/home/typewritter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Expense tracking web app",
}

export default function Home() {
  const SENTENCE =
    "Start keeping track of your expenses today! Get a clear picture of your financial situation. You can set a budget and track your spending to make sure you stay on top of your finances. Get started now and take control of your money!";

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center ">
      <div className="w-4/5 text-center">
        <h1 className="text-4xl md:text-7xl font-bold mb-10 md:mb-20">
          Welcome to Expense Tracker
        </h1>
        <TypeWritter
          SENTENCE={SENTENCE}
          className="text-xl md:text-2xl mb-10"
        />
        <Button className="px-8 py-4">Get Started</Button>
      </div>
    </div>
  );
}
