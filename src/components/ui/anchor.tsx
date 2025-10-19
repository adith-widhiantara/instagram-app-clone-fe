import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

interface AnchorProps extends PropsWithChildren {
  href: string;
  children: React.ReactNode;
  size?: "xs" | "sm" | "md";
  shape?: "sm" | "md" | "lg" | "full";
  mood:
    | "axiata-blue"
    | "axiata-red"
    | "axiata-blue-link"
    | "axiata-blue-outline"
    | "axiata-reddish-outline";
  state?: { [key: string]: unknown };
}

export function Anchor({
  href,
  children,
  mood,
  size = "sm",
  shape = "md",
  state,
}: AnchorProps) {
  const moodClass = {
    "axiata-blue": "bg-axiata-blue text-white hover:brightness-125",
    "axiata-red": "bg-axiata-red text-white hover:brightness-110",
    "axiata-blue-link": "text-axiata-blue underline hover:no-underline",
    "axiata-blue-outline":
      "border border-axiata-blue text-axiata-blue hover:bg-axiata-blue hover:text-white dark:text-neutral-300",
    "axiata-reddish-outline":
      "border border-[#DC3545] text-[#DC3545] hover:bg-[#DC3545] hover:text-white",
  };
  const sizeClass = {
    xs: "text-xs px-3 h-7",
    sm: "text-sm px-3 h-9",
    md: "text-md px-8 h-11",
  };
  const shapeClass = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };
  return (
    <Link
      to={href}
      state={state}
      className={`${moodClass[mood]} ${sizeClass[size]} ${shapeClass[shape]} flex w-fit items-center justify-center`}
    >
      {children}
    </Link>
  );
}
