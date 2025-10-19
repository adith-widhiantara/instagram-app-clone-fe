import { Spinner } from 'alurkerja-ui';

export function Loading() {
  return (
    <div className="flex items-center justify-center py-2">
      <Spinner className="text-main-blue-alurkerja" /> Loading...
    </div>
  );
}
