/* eslint-disable @typescript-eslint/no-explicit-any */
import FullLoading from '@/pages/others/FullLoading'
import { lazy, Suspense } from 'react'

function loadable(importFunc: any) {
  const LazyComponent = lazy(importFunc)

  return (props: any) => (
    <Suspense fallback={<FullLoading />}>
      <LazyComponent {...props} />
    </Suspense>
  )
}

export default loadable
