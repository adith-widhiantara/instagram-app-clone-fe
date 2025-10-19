import { LucideChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

interface BreadcrumbConfig {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  list?: BreadcrumbConfig[];
}

export function Breadcrumbs({ list }: BreadcrumbsProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const listFromPathname = pathname
    .split("/")
    .filter((item) => item)
    .map((item) => ({
      label: item.replaceAll("-", " "),
      href: pathname.slice(0, pathname.indexOf(item) + item.length),
    }));

  const listToRender = list || listFromPathname;

  return (
    <nav
      aria-labelledby="breadcrumb"
      className="flex gap-x-2 text-sm text-neutral-500 dark:text-neutral-300"
    >
      <h2 id="breadcrumb" className="sr-only">
        Breadcrumb
      </h2>
      <ol className="flex gap-x-1 rounded-lg bg-[#0D99FF] bg-opacity-10 px-2 py-2 text-axiata-blue dark:bg-neutral-900 dark:bg-transparent dark:text-neutral-300">
        {listToRender.map((item, index) => (
          <li key={item.label + item.href}>
            {index === 0 ? (
              <span className="capitalize">{item.label}</span>
            ) : (
              <span className="flex gap-x-2">
                <span>
                  <LucideChevronRight
                    width={20}
                    height={20}
                    className="text-axiata-blue dark:text-neutral-300"
                  />
                </span>
                <NavLink
                  to={item.href ?? "#"}
                  className="aria-[current=page]:text-neutral-80 capitalize aria-[current=page]:underline"
                  end
                >
                  {item.label}
                </NavLink>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
