import type React from "react";
import type { PropsWithChildren } from "react";

interface MyButtonProps extends PropsWithChildren {
  onClick: VoidFunction;
}

export const MyButton: React.FC<MyButtonProps> = ({ onClick, children }) => {
  return (
    <button
      type="button"
      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
