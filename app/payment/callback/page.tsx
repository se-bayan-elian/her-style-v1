"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircleIcon, XCircleIcon, RefreshCcwIcon } from "lucide-react"; // Lucide icons
import { useDispatch } from "react-redux";
import { clearAddress } from "@/utils/addressSlice";
import { getCookie } from "cookies-next";
import { useQueryClient } from "@tanstack/react-query";
import Loading from "@/app/(components)/Loading";

const PaymentCallback: React.FC = () => {
  const router = useRouter();
  const queryParams = useSearchParams(); // Get status from query parameters
  const status = queryParams.get("status"); // Extract the status only once
  const paymentId = queryParams.get("id"); // Extract payment ID
  const orderIdParam = queryParams.get("orderId"); // Extract order ID
  const queryClient = useQueryClient();

  const [message, setMessage] = useState<string>(
    "جارٍ معالجة الدفع... من فضلك انتظر."
  );
  const [icon, setIcon] = useState<JSX.Element | null>(null);
  const [iconColor, setIconColor] = useState<string>("bg-yellow-100");
  const [orderId, setOrderId] = useState<string>("");
  const dispatch = useDispatch();
  const addressCookies = getCookie("address");

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (status === "completed" || status === "paid") {
        setMessage(
          "تم الطلب بنجاح! سيتم تحويلك إلى صفحة الطلبات خلال 5 ثوانٍ."
        );
        setIcon(<CheckCircleIcon className="w-16 h-16 text-green-500" />);
        setIconColor("bg-green-100");
      } else if (status === "failed") {
        setMessage("فشل الدفع! سيتم تحويلك إلى الصفحة الرئيسية خلال 5 ثوانٍ");
        setIcon(<XCircleIcon className="w-16 h-16 text-red-500" />);
        setIconColor("bg-red-100");
      } else {
        setMessage("جارٍ معالجة الدفع... من فضلك انتظر");
        setIcon(
          <RefreshCcwIcon className="w-16 h-16 animate-spin text-yellow-500" />
        );
        setIconColor("bg-yellow-100");
      }
    };

    checkPaymentStatus();

    // Redirect to appropriate page after 5 seconds
    const timeout = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.replace(
        status === "paid" || status === "completed"
          ? `/profile?tab=orders&orderId=${orderIdParam || orderId}`
          : "/"
      );
    }, 5000);

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, [
    status,
    paymentId,
    router,
    dispatch,
    addressCookies,
    orderId,
    queryClient,
    orderIdParam,
  ]);

  return (
    <div
      dir="rtl"
      className={`flex flex-col items-center justify-center min-h-screen gap-6 text-center px-4 ${iconColor}`}
    >
      <div>{icon}</div>
      <h1 className="text-2xl font-bold">{message}</h1>
      <p className="text-sm text-gray-600">
        {status === "completed" || status === "paid"
          ? "شكراً لتسوقك معنا ! "
          : "في حال استمرار المشكلة، يرجى التواصل مع الدعم الفني"}
      </p>
    </div>
  );
};

const PaymentCallbackWrapper = () => {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentCallback />
    </Suspense>
  );
};

export default PaymentCallbackWrapper;
