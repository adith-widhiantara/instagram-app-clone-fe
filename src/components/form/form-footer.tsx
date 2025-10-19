import { PropsWithChildren } from "react";

export function FormFooter({ children }: PropsWithChildren) {
  return (
    <div className="flex w-full items-center justify-center gap-x-2">
      {children}
    </div>
  );
}
