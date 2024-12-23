"use client";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { PropsWithChildren, useEffect, useLayoutEffect } from "react";

const PaymentLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  useLayoutEffect(() => {
    const token = getCookie("auth_token");
    const role = localStorage.getItem("role");

    if (!token || role !== "CLIENT") {
      router.replace("/");
    }
  }, [getCookie("auth_token")]);
  return <div>{children}</div>;
};

export default PaymentLayout;
