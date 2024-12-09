"use client";

import React, { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, AlertCircleIcon, RefreshCcwIcon } from "lucide-react";
import { getCookie } from "cookies-next";

// API call to verify the account
const verifyAccount = async (token: string | null) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/verify-account`,
      { token }
    );
    return response.data; // Assuming the response contains the message you need
  } catch (e) {
    console.error("Error in verifying = ", e);
    throw e;
  }
};


function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  // Mutation for verifying account
  const verificationMutation = useMutation({
    mutationFn: (token: string | null) => verifyAccount(token),
    onSuccess: () => {
      router.replace("/");
      toast({
        title: "نجاح",
        description: "تم تفعيل الحساب، يمكنك تسجيل الدخول الآن.",
      });
    },
  });
  // Mutation for verifying account


  // Trigger mutation on page load
  useEffect(() => {
    verificationMutation.mutate(token);
  }, [token]);

  if (getCookie("auth_token")) {
    router.replace("/");
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        {verificationMutation.isPending ? (
          <div>
            <RefreshCcwIcon className="w-16 h-16 animate-spin text-purple mx-auto" />
            <p className="mt-4 text-lg">
              ... جاري تفعيل حسابك ، انتظر لحظة من فضلك
            </p>
          </div>
        ) : (
          <>
            {verificationMutation.isError && (
              <div>
                <AlertCircleIcon className="h-[70px] w-[70px] text-red-500 mx-auto" />
                <h1 className="text-red mt-4 text-xl font-bold mb-3">
                  ! فشل في التحقق من الحساب
                </h1>
                <p className="text-red-600 text-sm ">
                  الكود خاطئ أو إنتهت صلاحية الكود
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyPage;
