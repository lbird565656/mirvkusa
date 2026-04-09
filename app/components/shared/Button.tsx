import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
};

export default function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const baseClassName =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

  const variantClassName =
    variant === "outline"
      ? "border border-neutral-200 bg-white text-neutral-950 hover:border-orange-200 hover:bg-orange-50/40"
      : variant === "ghost"
      ? "bg-transparent text-neutral-700 hover:bg-neutral-100"
      : "bg-orange-500 text-white shadow-[0_10px_20px_rgba(255,145,0,0.18)] hover:bg-orange-600 hover:shadow-[0_14px_24px_rgba(255,145,0,0.24)]";

  return (
    <button
      type={type}
      className={`${baseClassName} ${variantClassName} ${className}`}
      {...props}
    />
  );
}