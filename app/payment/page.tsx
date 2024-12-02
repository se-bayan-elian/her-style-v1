"use client";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../(components)/Loading";
import { useSelector } from "react-redux";
import { withAddress } from "@/utils/addressSlice";
import { RootState } from "@/utils/store";
import { Profile } from "../profile/page";
import { getCart } from "../(components)/Cart";
import axios from "axios";

const fetchProfile = async (): Promise<Profile> => {
  const response = await axiosInstance.get("profile");
  return response.data.data;
};
const getExchangeRate = async () => {
  const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATES_API_KEY;
  try {
    const response = await axios.get(
      `https://api.currencylayer.com/live?access_key=${API_KEY}`
    );
    const rateSAR = response.data.quotes.USDSAR * 1.025; // USD to SAR rate
    return rateSAR;
  } catch (error: any) {
    console.error("Error:", error.message);
    return null;
  }
};

const PayPalPayment = () => {
  const [isPaymentProcessing, setIsPaymentProcessing] =
    useState<boolean>(false);
  const [isPaying, setIsPaying] = useState(false);
  const router = useRouter();
  const address = useSelector((state: RootState) => state.address);

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["client-profile"],
    queryFn: fetchProfile,
  });
  const {
    data: cartData,
    isLoading: isCartLoading,
    error: isCartError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  // Ensure cart is loaded before rendering PayPal buttons
  if (isCartLoading || isProfileLoading) return <Loading />;
  const cartItems =
    cartData?.data?.carts[0]?.packages.concat(
      cartData?.data?.carts[0]?.products
    ) || [];

  if (isProfileError || isCartError || cartItems.length === 0) {
    router.replace("/");
  }
  useEffect(() => {
    if (!address) {
      router.replace("/checkout");
    }
  }, [])

  const createOrder = async (data: any, actions: any) => {
    setIsPaying(true);
    const exchangeRate = (await getExchangeRate()) || 3.75;
    const usdAmount = parseFloat(
      (cartData?.data?.carts[0]?.totalPrice / exchangeRate).toFixed(2)
    );

    try {
      // Create an order using the PayPal API
      const orderId = await actions.order.create({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              value: usdAmount, // Ensure totalPrice is a string and rounded to 2 decimal places
              currency_code: "USD", // Adjust currency as needed
            },
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW", // Simplify the flow
          // Ensure no address is collected
        },
        payer: {
          email_address: profile?.email,
          phone: {
            phone_type: "MOBILE", // Specify phone type: MOBILE, HOME, WORK, etc.
            phone_number: {
              national_number: profile?.phoneNumber,
              value: profile?.phoneNumber,
              // Replace with the actual number
            },
          },
          address: {
            address_line_1: address.address.firstLine,
            address_line_2: address.address.street, // Optional
            admin_area_2: address.address.city, // City
            admin_area_1: "", // State/Province
            postal_code: "12345", // ZIP/Postal code
            country_code: "SA", // ISO country code
          },
        },
      });

      setIsPaying(false);
      return orderId; // Return the created order ID
    } catch (error) {
      console.error("PayPal Order Creation Error:", error);
      setIsPaying(false);
      throw error;
    }
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      // Capture the payment
      setIsPaymentProcessing(true);
      const details = await actions.order.capture();
      console.log(details);
      // Get address from cookies (you'll need to set this earlier in your checkout process)

      // Create order API call
      const orderResponse = await axiosInstance.post("/cart/checkout", {
        paymentMethod: "INSTANT",
        address: address.address ?? {},
        paymentId: details.id,
      });
      router.replace(
        "/payment/callback?status=paid&orderId=" + orderResponse.data.data._id
      );
    } catch (error) {
      console.error("Payment Approval Error:", error);
      // Redirect to payment failure page
      router.replace("/payment/callback?status=failed");
    } finally {
      setIsPaying(false);
      setTimeout(() => {
        setIsPaymentProcessing(false);
      }, 1000);
    }
  };

  const onError = (err: any) => {
    console.error("PayPal Checkout Error:", err);
    router.replace("/payment/callback?status=failed");
    setTimeout(() => {
      setIsPaymentProcessing(false);
    }, 1000);
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "",
        currency: "USD",
      }}
    >
      <div className="min-h-screen flex justify-center items-center mx-auto  py-5 w-[90%] md:w-[80%] lg:w[50%] xl:w-[35%] ">
        <div
          dir="rtl"
          className=" h-fit w-full scroll  px-3 py-5 overflow-y-auto "
        >
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            disabled={isPaying}
            className="w-full"
            style={{
              layout: "vertical", // or "horizontal"
              tagline: false, // Disable the tagline
              color: "gold", // or "blue", "silver", etc.
              shape: "rect", // or "pill"
              label: "pay", // This makes it look more like a card-style button
              height: 35,
            }}
          />
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalPayment;
