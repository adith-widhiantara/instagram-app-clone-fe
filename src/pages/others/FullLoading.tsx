import { Spinner } from 'alurkerja-ui'

export default function FullLoading()  {
  return (
    <div
      className="flex items-center justify-center h-screen"
      data-testid="spinner"
    >
      <Spinner size={32} />
    </div>
  )
}
