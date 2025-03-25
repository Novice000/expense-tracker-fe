import { base, baseAuth } from "./base";

type AuthData = {
  username: string;
  budget: number;
  password: string;
};

async function getUser(){
  try {
    const response = await baseAuth.get("/auth/users/me");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
}

async function getExpenses(
  month: number | null = null,
  year: number | null = null
) {
  try {
    const response = await baseAuth.get(
      month && year ? `/expense?month=${month}&year=${year}` : "/expense"
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
}

async function getSingleExpense(id: number) {
  try {
    const response = await baseAuth.get(`/expense/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
}

async function postExpense(data: { amount: number; description: string }) {
  try {
    const response = await baseAuth.post("/expense", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
}

async function Auth(authType: "login" | "register", data: AuthData | FormData) {
  try {
    let response;
    if (authType === "login") {
      response = await base.post("/auth/token", data);
      console.log(response)
      localStorage.setItem("access_token", response.data.access_token);
    } else if (authType === "register") {
      response = await base.post("/auth/register", data);
    } else {
      throw new Error("Invalid authType, should be 'login' or 'register'");
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
}

export { getUser ,getExpenses, getSingleExpense, postExpense, Auth };
