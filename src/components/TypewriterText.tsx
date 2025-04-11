"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface TypewriterTextProps {
  text: string;
  speed?: number;
}

function TypewriterText({ text, speed = 50 }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <div className="prose prose-sm max-w-none p-1">
      <ReactMarkdown>{displayedText}</ReactMarkdown>
    </div>
  );
} 

export { TypewriterText };