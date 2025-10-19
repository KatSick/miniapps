import type React from "react";
import type { PropsWithChildren } from "react";

import { Button } from "./components/ui/button";

export interface MyButtonProps extends PropsWithChildren {
  onClick: VoidFunction;
}

export const MyButton: React.FC<MyButtonProps> = ({ onClick, children }) => (
  <Button type="button" onClick={onClick}>
    {children}
  </Button>
);
