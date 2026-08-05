import React from "react";

type ButtonProps = {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  className?: string;
};

const Button = ({
  text,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}: ButtonProps) => {
  const variants = {
    primary:
      "bg-red-600 text-white hover:bg-red-700 active:scale-95",
    secondary:
      "bg-black text-white hover:bg-neutral-800 active:scale-95",
    outline:
      "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white active:scale-95",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        px-6
        py-3
        rounded-lg
        font-semibold
        text-sm
        sm:text-base
        transition-all
        duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
        cursor-pointer
        ${className}
      `}
    >
      {text}
    </button>
  );
};

export default Button;