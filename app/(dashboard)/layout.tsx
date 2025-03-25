"use client";
import React from "react";
import TopBar from "@/components/layout/top-bar";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient()

function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TopBar />
        {children}
        </QueryClientProvider>
    </>
  );
}


export default DashboardLayout;