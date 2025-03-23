"use client";
import React, { useState, useEffect } from "react";

function TypeWritter({ SENTENCE, className }: { SENTENCE: string, className?: string }) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const typeOut = setTimeout(() => {
      if (index <= SENTENCE.length) {
        setText(SENTENCE.slice(0, index));
        setIndex(index + 1);
      }
    }, 30);
    () => {
      clearTimeout(typeOut);
    };
  }, [text, index]);

  return <div className={`${className}`}>{text}</div>;
}

export default TypeWritter
