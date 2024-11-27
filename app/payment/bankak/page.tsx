"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { getCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { clearAddress } from "@/utils/addressSlice";
import Image from "next/image";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCart } from "@/app/(components)/Cart";
import { useEffect } from "react";

const PaymentInstructions = () => {
  const router = useRouter();
  const addressCookies = getCookie("address");
  const dispatch = useDispatch();
  const {
    data: cart,
    isLoading: cartLoading,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  // Mutation for creating an order
  const createOrderMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await axiosInstance.post("/cart/checkout", {
          paymentMethod: "BANKAK",
          address: JSON.parse(addressCookies ?? ""),
        });
        console.log(response);
        router.push(
          "/payment/callback?status=completed&orderId=" + response.data.data._id
        );
        dispatch(clearAddress());
        return response.data;
      } catch (error) {
        router.push("/payment/callback?status=failed");
      }
    },
    onError: (error: any) => {
      // Handle any errors here, if necessary
      router.push("/payment/callback?status=FAILED");
      console.log("Error creating order:", error.message);
    },
  });

  const handleWhatsApp = () => {
    const whatsappNumber = "+966502663328"; // Replace with your WhatsApp number
    const message = encodeURIComponent(
      "مرحباً، لقد أكملت عملية الدفع. مرفق إيصال الدفع."
    );
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(url, "_blank");
  };
  useEffect(() => {
    if (!addressCookies) {
      router.push("/checkout");
    }
  }, []);

  if (cartLoading)
    return (
      <div className="flex flex-col items-center justify-start pt-40 min-h-screen">
        <div className="loader"></div>
        <style jsx>{`
          .loader {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #564495;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 text-right">
      <h1 className="text-2xl font-bold mb-6">إتمام عملية الدفع</h1>
      <p
        className="text-gray-800 text-md md:text-lg mb-2 text-center md:text-right"
        dir="rtl"
      >
        قم بدفع مبلغ{" "}
        <span className="font-bold">{cart.data.carts[0]?.totalPrice}</span> SAR
        لأحد الحسابين{" "}
      </p>
      <p
        className="text-gray-800 text-md md:text-lg  mb-3 text-center md:text-right"
        dir="rtl"
      >
        وبعدها قم بإرسال الإيصال لرقمنا على الوتساب وأضغط متابعة لإتمام طلبك
        بنجاح
      </p>
      <div className="bg-white shadow-md p-4 rounded-lg w-full max-w-lg mb-6">
        <div className="md:flex" dir="rtl">
          <div className="content xs:mb-3 md:mb-0">
            <p className="font-semibold text-lg mb-2">
              عبد الرحمن محمد عبد الرحمن
            </p>
            <p className="text-sm text-gray-600">برقم الحساب: 3703645</p>
            <p className="text-sm text-gray-600">بنك الخرطوم (بنكك)</p>
          </div>
          <div className="image relative md:mr-auto">
            <Image
              src="/abdAlrehman-account.jpg"
              alt="رمز الحساب"
              width="120"
              height="120"
              objectFit="contain"
              className=" mr-auto"
            ></Image>
          </div>
        </div>
        <hr className="my-4" />
        <div className="md:flex" dir="rtl">
          <div className="content xs:mb-3 md:mb-0">
            <p className="font-semibold text-lg mb-2">مهند حمد سعيد محمد</p>
            <p className="text-sm text-gray-600">برقم الحساب: 1281883</p>
            <p className="text-sm text-gray-600">بنك الخرطوم (بنكك)</p>
          </div>
          <div className="image relative md:mr-auto">
            <Image
              src="/mohand-account.jpg"
              alt="رمز الحساب"
              width="120"
              height="120"
              objectFit="contain"
              className="mr-auto"
            ></Image>
          </div>
        </div>
      </div>

      <div
        dir="rtl"
        className="flex flex-col md:flex-row md:justify-between w-full max-w-lg gap-4"
      >
        <button
          onClick={handleWhatsApp}
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 hover:shadow-lg transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M12.01 0C5.4 0 .01 5.4.01 12c0 2.11.53 4.18 1.55 6.01l-1.62 5.97 6.13-1.61C7.8 23.47 9.87 24 12.01 24c6.6 0 11.99-5.4 11.99-12S18.61 0 12.01 0zm0 22c-1.94 0-3.81-.52-5.45-1.51l-.39-.24-3.63.96.96-3.62-.25-.41A9.95 9.95 0 0 1 2 12C2 6.48 6.49 2 12.01 2 17.52 2 22 6.48 22 12s-4.48 10-9.99 10zm5.39-6.94c-.3-.15-1.77-.88-2.04-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.16c-.17.2-.34.22-.63.07a8.18 8.18 0 0 1-2.4-1.47 9.13 9.13 0 0 1-1.7-2.1c-.18-.3 0-.46.13-.6.13-.13.3-.34.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.23-.24-.6-.5-.52-.67-.53-.18-.01-.37-.01-.57-.01s-.52.07-.8.37c-.27.3-1.04 1.02-1.04 2.49 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.07 4.49.71.3 1.26.48 1.69.62.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.13-.27-.2-.57-.35z" />
          </svg>
          <span>إرسال إلى الواتساب</span>
        </button>
        <Button
          onClick={() => createOrderMutation.mutate()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          disabled={createOrderMutation.isPending}
        >
          {createOrderMutation.isPending ? "جاري المعالجة..." : "متابعة"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentInstructions;
