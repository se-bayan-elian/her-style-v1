"use client";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddress, clearAddress } from "@/utils/addressSlice";
import { getCookie } from "cookies-next";
import useAxiosInstance from "@/utils/axiosInstance";

type AddressFormData = {
  firstLine: string;
  googleLocation: string;
  street: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
};


const AddressAndPaymentForm = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState("");
  const dispatch = useDispatch();
  const axiosInstance = useAxiosInstance()
  const submitAddress = async (data: AddressFormData) => {
    try {
      const response = await axiosInstance.post("/cart/checkout", {
        paymentMethod: "COD",
        address: {
          firstLine: data.firstLine,
          googleLocation: data.googleLocation,
          city: data.city,
          postalCode: data.postalCode,
          street: data.street,
          country: "السعودية", // Default country
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const address = useSelector((state: any) => state.address); // Access the address state from Redux

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    defaultValues: {
      firstLine: address.firstLine || "", // Defaults from Redux or empty
      googleLocation: address.googleLocation || "",
      street: address.street || "",
      city: address.city || "",
      postalCode: address.postalCode || "",
    },
  });
  useLayoutEffect(() => {
    const token = getCookie("auth_token");
    const role = localStorage.getItem("role");

    if (!token || role !== "CLIENT") {
      router.replace("/");
    }
  }, [getCookie("auth_token")]);
  const addressMutation = useMutation({
    mutationFn: submitAddress,
    onSuccess: (data) => {
      reset();
      if (data.data.paymentMethod === "COD") {
        dispatch(clearAddress());
        router.replace(
          "/payment/callback?status=completed&orderId=" + data.data._id
        );
      } else {
        router.replace("/payment");
      }
    },
    onError: () => {
      setApiError("حدث خطأ ، تأكد من أن السلة ليست فارغة");
    },
  });

  const onSubmit = (data: AddressFormData) => {
    dispatch(
      setAddress({
        firstLine: data.firstLine,
        googleLocation: data.googleLocation,
        street: data.street,
        city: data.city,
        postalCode: data.postalCode,
        country: "المملكة العربية السعودية",
      })
    ); // Update Redux state with form data
    if (data.paymentMethod === "COD") {
      addressMutation.mutate(data);
    } else if (data.paymentMethod === "BANKAK") {
      router.replace("/payment/bankak");
    } else {
      router.replace("/payment");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="md:text-2xl sm:text-xl font-bold mb-4 text-center">
        إضافة العنوان واختيار طريقة الدفع
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
        <div className="grid gap-4 pt-4 pb-2">
          {/* First Line */}
          <div className="grid grid-cols-4 items-center gap-1">
            <Label htmlFor="firstLine" className="col-span-4 text-right">
              العنوان الأول
            </Label>
            <Input
              id="firstLine"
              dir="rtl"
              placeholder="مثال: مبنى رقم 1"
              className="col-span-4 focus-visible:ring-purple-500 text-right"
              {...register("firstLine", { required: "العنوان الأول مطلوب" })}
            />
            {errors.firstLine && (
              <small className="text-red col-span-4 text-right">
                {errors.firstLine.message}
              </small>
            )}
          </div>

          {/* Google Location */}
          <div className="grid grid-cols-4 items-center gap-1">
            <Label htmlFor="googleLocation" className="col-span-4 text-right">
              رابط عنوانك على جوجل ماب
            </Label>
            <Input
              id="googleLocation"
              placeholder="ألصق رابط موقعك من جوجل ماب"
              className="col-span-4 focus-visible:ring-purple-500 text-right"
              {...register("googleLocation", {
                required: "رابط الموقع على جوجل مطلوب",
                pattern: {
                  value:
                    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/,
                  message: "يرجى إدخال رابط صحيح",
                },
              })}
            />
            {errors.googleLocation && (
              <small className="text-red col-span-4 text-right">
                {errors.googleLocation.message}
              </small>
            )}
          </div>

          {/* Street */}
          <div className="grid grid-cols-4 items-center gap-1">
            <Label htmlFor="street" className="col-span-4 text-right">
              الشارع
            </Label>
            <Input
              id="street"
              dir="rtl"
              placeholder="مثال : شارع الملك فهد"
              className="col-span-4 focus-visible:ring-purple-500 text-right"
              {...register("street", { required: "اسم الشارع مطلوب" })}
            />
            {errors.street && (
              <small className="text-red col-span-4 text-right">
                {errors.street.message}
              </small>
            )}
          </div>

          {/* City */}
          <div className="grid grid-cols-4 items-center gap-1">
            <Label htmlFor="city" className="col-span-4 text-right">
              المدينة
            </Label>
            <Input
              id="city"
              dir="rtl"
              placeholder="مثال : الرياض"
              className="col-span-4 focus-visible:ring-purple-500 text-right"
              {...register("city", { required: "اسم المدينة مطلوب" })}
            />
            {errors.city && (
              <small className="text-red col-span-4 text-right">
                {errors.city.message}
              </small>
            )}
          </div>

          {/* Postal Code */}
          <div className="grid grid-cols-4 items-center gap-1">
            <Label htmlFor="postalCode" className="col-span-4 text-right">
              الحي
            </Label>
            <Input
              id="postalCode"
              dir="rtl"
              placeholder=" مثال : حي المطار"
              className="col-span-4 focus-visible:ring-purple-500 text-right"
              {...register("postalCode", { required: "الحي مطلوب" })}
            />
            {errors.postalCode && (
              <small className="text-red col-span-4 text-right">
                {errors.postalCode.message}
              </small>
            )}
          </div>

          {/* Payment Method */}
          <div dir="rtl" className="justify-around mb-4">
            <label className="flex items-center  gap-2 mb-2">
              <input
                type="radio"
                value="COD"
                defaultChecked={true}
                {...register("paymentMethod", {
                  required: "طريقة الدفع مطلوبة",
                })}
              />
              <span className="ml-2">الدفع عند الاستلام</span>
            </label>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                value="PAYPAL"
                {...register("paymentMethod")}
              />
              <span className="ml-2">الدفع عن طريق بطاقة أو paypal</span>
            </label>
            <label className="flex items-center  gap-2">
              <input
                type="radio"
                value="BANKAK"
                {...register("paymentMethod")}
              />
              <span className="ml-2">الدفع عن طريق تطبيق بنكك الخرطوم</span>
            </label>
          </div>

          {errors.paymentMethod && (
            <small className="text-red col-span-4 text-right">
              {errors.paymentMethod.message}
            </small>
          )}
        </div>
        <div className="flex flex-row direction-reverse justify-around mb-2">
          {apiError && (
            <span className="text-red col-span-4 text-right">{apiError}</span>
          )}
        </div>
        <Button
          type="submit"
          className="bg-purple text-white px-4 py-2 rounded w-full"
          disabled={addressMutation.isPending && !addressMutation.isError}
        >
          {addressMutation.isPending && !addressMutation.isError
            ? "...جاري الطلب"
            : "تأكيد الطلب"}
        </Button>
      </form>
    </div>
  );
};

export default AddressAndPaymentForm;
