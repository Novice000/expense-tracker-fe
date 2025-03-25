import { useUserStore } from "@/store/store";
import React, { useEffect } from "react";
import { getUser } from "@/axios/util";
import { SettingsIcon } from "lucide-react";
import { Anton, Dancing_Script } from "next/font/google";

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

    useEffect(()=>{
        async function fetchUser(){
            return await getUser();
        }
        fetchUser().then((user)=>{
            userStore.setUsername(user.username);
            userStore.setBudget(user.budget);
        })
    }, []);

    return (
      <div
        className={`${anton.className} flex items-center p-3 text-3xl shadow-lg justify-between`}
      >
        <div>
          Welcome <span className={`${dancing_script.className}`}> {userStore.username} </span>
        </div>
        <SettingsIcon />
      </div>
    );
}

export default TopBar;
