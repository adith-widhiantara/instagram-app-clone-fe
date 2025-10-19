import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export default function AlertDestructive({ title, text }: { title?: string; text?: string }) {
  return (
    <Alert variant="destructive">
      <AlertTitle>{title ?? 'Error'}</AlertTitle>
      <AlertDescription>{text ?? 'Unknown error.'}</AlertDescription>
    </Alert>
  );
}
