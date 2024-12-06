import { Metadata } from 'next'
import React, { FC, PropsWithChildren } from 'react'
export const metadata: Metadata = {
  title: "من نحن"
}
const AboutLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>{children}</>
  )
}

export default AboutLayout