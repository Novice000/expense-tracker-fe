import React from "react";
import { div as DIV } from "framer-motion/client"

function Side({ form }: { form: React.ReactNode }) {
  return (
    <div className="grid md:grid-cols-2">
      <DIV 
      initial={{opacity:0, scale: 0}}
      animate={{opacity:1, scale: 1}}
      transition={{delay:0.3, duration:1}}
      className="h-screen grid place-content-center">{form}</DIV>
      <div className="hidden md:block w-full h-screen bg-black"></div>
    </div>
  );
}

export default Side;
