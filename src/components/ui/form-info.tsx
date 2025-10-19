import { P } from "./typography";

interface FormInfoProps {
  label?: string;
  values?: string[];
}
export function FormInfo({ label = "", values = [] }: FormInfoProps) {
  return (
    <div className="dark:text-white">
      <P>{label}:</P>
      <ul className="list-decimal pl-4">
        <li className="text-sm">{values}</li>
      </ul>
    </div>
  );
}
