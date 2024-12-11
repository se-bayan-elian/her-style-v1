"use client";

import React, { useEffect, useState } from "react";
import { SquarePenIcon, User } from "lucide-react";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useDispatch } from "react-redux";
import { addName, deleteName } from "@/utils/cart";
import Orders from "./Orders";
import Loading from "../(components)/Loading";
import Error from "next/error";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import useAxiosInstance from "@/utils/axiosInstance";

export interface Profile {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  phoneNumber: string;
}



export default function ProfilePage() {
  const router = useRouter();
  const query = useSearchParams();
  const orderId = query.get("orderId");
  const [activeTab, setActiveTab] = useState(query.get("tab") || "profile");
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const axiosInstance = useAxiosInstance()
  const fetchProfile = async (): Promise<Profile> => {
    const response = await axiosInstance.get("profile");
    return response.data.data;
  };

  const updateProfile = async (data: { name: string; phoneNumber: string }) => {
    if (data.name !== "") {
      localStorage.setItem("name", data.name);
      dispatch(addName(data.name));
    }
    const response = await axiosInstance.put("profile", data);
    return response.data;
  };

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["client-profile"],
    queryFn: fetchProfile,
  });

  const updateProfileMutation: any = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-profile"] });
      toast({
        title: "نجاح",
        description: "تم تعديل بياناتك بنجاح",
        variant: "default",
      });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["client-profile"] });
      toast({
        title: "فشل",
        description: "حدث خطأ أثناء تعديل بياناتك",
        variant: "destructive",
      });
    },
  });

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    deleteCookie("auth_token");
    dispatch(deleteName());
    queryClient.invalidateQueries({ queryKey: ["cart"] });
    location.reload();
  };

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string; phoneNumber: string }>({
    defaultValues: {
      name: profile?.name || "",
      phoneNumber: profile?.phoneNumber || "",
    },
  });

  const onSubmit = (data: { name: string; phoneNumber: string }) => {
    updateProfileMutation.mutate(data);
  };

  useEffect(() => {
    if (!getCookie("auth_token")) {
      router.push("/");
    }
  }, [getCookie("auth_token")]);
  useEffect(() => {
    if (profile?.name) {
      setValue("name", profile?.name);
      setValue("phoneNumber", profile?.phoneNumber);
    }
  }, [profile]);
  if (isProfileLoading) {
    return <Loading />;
  }

  if (isProfileError) {
    return Error;
  }

  return (
    <div className="min-w-5xl mx-auto   pt-2 px-1 md:p-6 bg-white rounded-lg shadow-md my-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="profile"
            onClick={() => {
              router.replace("/profile?tab=profile", { scroll: false });
            }}
          >
            الملف الشخصي
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            onClick={() => {
              router.replace("/profile?tab=orders", { scroll: false });
            }}
          >
            الطلبات
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div className="flex items-center justify-end mb-6">
            <div className="mr-4 text-right">
              <h1 className="text-2xl font-bold">مرحبا بك، {profile?.name}</h1>
              <p className="text-gray-600">الرئيسة / تعديل المعلومات</p>
            </div>
            <User
              size={80}
              className="text-gray-800 font-thin border-2 border-gray-200 rounded-full p-2"
            />
          </div>

          <form className="space-y-4 mb-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center border-2 rounded-lg border-gray-200 px-2">
              <div className="flex items-center gap-2">
                <SquarePenIcon />
                <Input
                  {...register("name", { required: "الاسم مطلوب" })}
                  type="text"
                  className="p-2 rounded focus:outline-none"
                />
              </div>
              <Label className="font-medium text-right text-nowrap">
                الاسم
              </Label>
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm !mt-0 text-right">
                {errors.name.message}
              </p>
            )}

            <div className="flex justify-between items-center border-2 rounded-lg border-gray-200 px-2">
              <div className="flex items-center gap-2">
                <SquarePenIcon />
                <Input
                  {...register("phoneNumber", {
                    required: "رقم الهاتف مطلوب",
                    pattern: {
                      value: /^0\d{9}$/,
                      message: "تنسق خاطئ : مثال 0552222222",
                    },
                  })}
                  type="tel"
                  className="p-2 rounded focus:outline-none"
                />
              </div>
              <Label className="font-medium text-right text-nowrap ">
                رقم الهاتف
              </Label>
            </div>
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm !mt-0 text-right">
                {errors.phoneNumber.message}
              </p>
            )}

            <div className="flex justify-between items-center border-2 rounded-lg border-gray-200 px-2">
              <div className="flex items-center gap-2">
                <Input
                  type="email"
                  defaultValue={profile?.email}
                  className="p-2 rounded focus:outline-none"
                  disabled
                />
              </div>
              <Label className="font-medium text-right text-nowrap">
                البريد الإلكتروني
              </Label>
            </div>
            <Button
              type="submit"
              className={`w-full bg-purple text-white`}
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending
                ? "... جاري الحفظ"
                : "حفظ التعديلات"}
            </Button>
          </form>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleSignOut}
          >
            تسجيل الخروج
          </Button>
        </TabsContent>
        <TabsContent value="orders" className="w-[90vw] lg:w-[60vw]">
          <Orders defaultId={orderId || ""} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
