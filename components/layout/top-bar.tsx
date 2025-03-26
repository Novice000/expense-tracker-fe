import { useUserStore } from "@/store/store";
import React, { useEffect } from "react";
import { getUser } from "@/axios/util";
import { SettingsIcon } from "lucide-react";
import { Anton, Dancing_Script } from "next/font/google";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
});

const dancing_script = Dancing_Script({
  weight: "400",
  subsets: ["latin"],
});

function TopBar() {
  const userStore = useUserStore();

  useEffect(() => {
    async function fetchUser() {
      const user = await getUser();
      userStore.setUsername(user.username);
      userStore.setBudget(user.budget);
    }
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.reload();
  };

  return (
    <div
      className={`${anton.className} flex items-center p-3 text-lg md:text-3xl shadow-lg justify-between`}
    >
      <div>
        Welcome{" "}
        <span className={`${dancing_script.className}`}>
          {userStore.username}
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <SettingsIcon className="w-6 h-6 cursor-pointer" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Change Budget</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default TopBar;
