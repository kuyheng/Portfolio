"use client";

import { useEffect, useState } from "react";

type TypingTitleProps = {
  roles: string[];
  loop?: boolean;
};

export default function TypingTitle({ roles, loop = false }: TypingTitleProps) {
  const safeRoles = roles.length ? roles : ["Developer"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = safeRoles[roleIndex] ?? "";
    const isComplete = display === current;
    const isEmpty = display.length === 0;

    if (isComplete && !loop) {
      return;
    }

    let delay = deleting ? 50 : 90;
    if (isComplete && !deleting) {
      delay = 900;
    }

    const timeout = window.setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, display.length + 1);
        setDisplay(next);
        if (next === current && loop) {
          setDeleting(true);
        }
      } else {
        const next = current.slice(0, display.length - 1);
        setDisplay(next);
        if (isEmpty) {
          setDeleting(false);
          setRoleIndex((prev) => (prev + 1) % safeRoles.length);
        }
      }
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [display, deleting, roleIndex, safeRoles, loop]);

  return (
    <span className="text-gradient inline-flex items-center gap-1 text-2xl font-semibold sm:text-3xl">
      {display}
      <span className="h-7 w-0.5 bg-white/70 animate-[blinkCaret_1s_steps(2)_infinite]" />
    </span>
  );
}
