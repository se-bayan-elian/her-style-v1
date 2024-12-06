import { Metadata } from 'next'
import React, { FC, PropsWithChildren } from 'react'
export const metadata: Metadata = {
  title: "سياسة الإستخدام"
}
const ShopLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>{children}</>
  )
}

export default ShopLayout