import { Metadata } from 'next'
import React, { FC, PropsWithChildren } from 'react'
export const metadata: Metadata = {
  title: "منتجاتنا"
}
const ShopLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>{children}</>
  )
}

export default ShopLayout