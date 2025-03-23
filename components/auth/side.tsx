import React from "react";

function Side({ form }: { form: React.ReactNode }) {
  return (
    <div className="grid md:grid-cols-2">
      <div className="h-screen grid place-content-center">{form}</div>
      <div className="hidden md:block w-full h-screen bg-green-200"></div>
    </div>
  );
}

export default Side;
