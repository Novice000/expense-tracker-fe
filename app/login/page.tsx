import React from "react";
import LoginForm from "@/components/auth/login_form";
import Side from "@/components/auth/side";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Expense Tracker",
  description: "Login to your account for expense tracking",
};

function LoginPage(){
    return(
        <Side form={<LoginForm/>} />
    )
}

export default LoginPage