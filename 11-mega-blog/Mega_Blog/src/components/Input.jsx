import React, { useId } from "react";

const Input = React.forwardRef(function Input(
  {
    label,
    type = "text",
    className = "",
    error = "",
    success = "",
    helper = "",
    leftIcon,
    rightIcon,
    size = "md", // sm | md | lg
    fullWidth = true,
    disabled = false,
    ...props
  },
  ref
) {
  const id = useId();

  const sizes = {
    sm: "px-2 py-1.5 text-sm",
    md: "px-3 py-2 text-base",
    lg: "px-4 py-3 text-lg",
  };

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          htmlFor={id}
          className="inline-block mb-1 text-blue-900 font-medium"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
            {leftIcon}
          </span>
        )}

        <input
          id={id}
          type={type}
          disabled={disabled}
          ref={ref}
          className={`
            rounded-lg border w-full transition duration-200
            bg-white text-blue-950
            focus:outline-none focus:ring-2 focus:ring-blue-300 
            placeholder:text-blue-300

            ${sizes[size]}
            ${leftIcon ? "pl-10" : ""}
            ${rightIcon ? "pr-10" : ""}
            ${
              error
                ? "border-red-400 focus:ring-red-300"
                : success
                ? "border-green-400 focus:ring-green-300"
                : "border-blue-200"
            }
            ${disabled ? "bg-blue-50 cursor-not-allowed opacity-60" : ""}
            ${className}
          `}
          {...props}
        />

        {/* Right icon */}
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400">
            {rightIcon}
          </span>
        )}
      </div>

      {/* Helper, Error, Success messages */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {!error && success && (
        <p className="text-green-600 text-sm mt-1">{success}</p>
      )}
      {!error && !success && helper && (
        <p className="text-blue-500 text-sm mt-1">{helper}</p>
      )}
    </div>
  );
});

export default Input;
