import { Button } from 'alurkerja-ui'
import { LucideDownload, LucideFilter } from 'lucide-react'

type ButtonColor =
  | 'blue'
  | 'red'
  | 'orange'
  | 'green'
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'warning'
  | 'info'
  | undefined

interface DefaultButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  size?: 'small' | 'medium'
  rounded?: 'rounded' | 'rounded-md' | 'rounded-lg' | 'rounded-full'
  color?: ButtonColor
}

export function DefaultButton({
  children,
  loading,
  size = 'small',
  rounded = 'rounded',
  color = 'blue',
  ...props
}: React.PropsWithChildren<DefaultButtonProps>) {
  return (
    <Button
      {...props}
      loading={loading}
      color={color}
      size={size}
      className={rounded + ' w-fit ' + props.className}
    >
      {children}
    </Button>
  )
}

export function FilterButton({
  children,
  ...props
}: Omit<DefaultButtonProps, 'mood'>) {
  return (
    <DefaultButton {...props} type="button">
      <span className="flex items-center gap-x-2">
        <LucideFilter size={16} />
        {children ?? <span className="sr-only">Filter</span>}
      </span>
    </DefaultButton>
  )
}

export function DownloadButton({
  children,
  ...props
}: Omit<DefaultButtonProps, 'mood'>) {
  return (
    <DefaultButton {...props} type="button">
      <span className="flex items-center gap-x-2">
        <LucideDownload size={16} />
        {children ?? <span className="sr-only">Download</span>}
      </span>
    </DefaultButton>
  )
}

export function SubmitButton({
  children,
  ...props
}: Omit<DefaultButtonProps, 'mood'>) {
  return (
    <DefaultButton {...props} type={props.type ?? 'submit'}>
      {children ?? 'Submit'}
    </DefaultButton>
  )
}
