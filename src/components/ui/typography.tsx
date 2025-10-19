export function H2({ children }: React.BaseHTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 dark:text-neutral-300">
      {children}
    </h2>
  );
}

export function H3({ children }: React.BaseHTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight dark:text-neutral-300">
      {children}
    </h3>
  );
}

export function H4({ children }: React.BaseHTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight dark:text-neutral-300">
      {children}
    </h4>
  );
}

export function H5({ children }: React.BaseHTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5 className="scroll-m-20 text-lg font-semibold tracking-tight dark:text-neutral-300">
      {children}
    </h5>
  );
}

export function P({
  children,
  ...props
}: React.BaseHTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className="scroll-m-20 dark:text-neutral-300" {...props}>
      {children}
    </p>
  );
}

export function Small({ children }: React.BaseHTMLAttributes<HTMLElement>) {
  return (
    <small className="text-sm font-medium leading-none dark:text-neutral-300">
      {children}
    </small>
  );
}
