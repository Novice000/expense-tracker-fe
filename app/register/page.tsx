import React from "react";
import RegisterForm from "@/components/auth/register_form";
import Side from "@/components/auth/side";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register - Expense Tracker",
    description: "Register your account for expense tracking",
}

function LoginPage(){
    return(
        <Side form={<RegisterForm />} />
    )
}

export default LoginPage