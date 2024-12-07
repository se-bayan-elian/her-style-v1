"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Signup from "./Signup";
import axiosInstance from "@/utils/axiosInstance";
import { setCookie } from "cookies-next";
import { User } from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addName } from "@/utils/cart";
import { RootState } from "@/utils/store";
import axios from "axios";
import { openLogin } from "@/utils/loginSlice";
import GeneralAlert from "./Alert";
import { toast } from "@/hooks/use-toast";

type LoginFormData = {
  email: string;
  password: string;
  isPersistent: boolean;
};

type ForgotPasswordFormData = {
  email: string;
};

const loginUser = async (data: LoginFormData) => {
  try {
    const response = await axiosInstance.post("/users/login", data);
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (data: ForgotPasswordFormData) => {
  try {
    const response = await axios.post(
      "https://herstyleapi.onrender.com/api/v1/users/reset-password-link",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export function Login() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.login.open);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LoginFormData>({
    defaultValues: {
      isPersistent: false, // Ensure the default is set to a boolean value
    },
  });

  const {
    register: registerForgotPassword,
    handleSubmit: handleSubmitForgotPassword,
    formState: { errors: forgotPasswordErrors },
    reset: resetForgotPassword,
  } = useForm<ForgotPasswordFormData>();

  const [error, setError] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const user = useSelector((state: RootState) => state.user.name);

  useEffect(() => {
    const storedUser = localStorage.getItem("user") || "";
    dispatch(addName(storedUser));
  }, []);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onMutate: () => {
      setError("");
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setCookie("auth_token", data.accessToken, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        sameSite: "strict",
      });
      dispatch(openLogin(false));
      localStorage.setItem("user", data.user.name);
      localStorage.setItem("role", data.user.role);
      reset();
      dispatch(addName(data.user.name));
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        setError("يرجى تفعيل بريدك الإلكتروني");
      } else setError("بيانات الاعتماد خاطئة");
      reset();
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onMutate: () => {
      setForgotPasswordMessage("");
    },
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "راجع بريدك الإلكتروني لإعادة تعيين كلمة مرورك",
      });
      resetForgotPassword();
      setIsForgotPasswordOpen(false);
    },
    onError: () => {
      setForgotPasswordMessage(
        "فشل إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى"
      );
      resetForgotPassword();
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onSubmitForgotPassword = (data: ForgotPasswordFormData) => {
    resetPasswordMutation.mutate(data);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => dispatch(openLogin(open))}>
        {user ? (
          <Link
            href={`/${localStorage.getItem("role") === "OWNER" ? "admin" : "profile"
              }`}
            className="flex items-center"
          >
            <User className="text-white mr-2" size={20} />
            <span className="text-white font-semibold">{user}</span>
          </Link>
        ) : (
          <DialogTrigger asChild>
            <button className="bg-purple text-white rounded">
              تسجيل الدخول
            </button>
          </DialogTrigger>
        )}
        <DialogContent className="sm:max-w-[425px] gap-1">
          <DialogHeader className="flex justify-between items-end mb-0">
            <DialogTitle>دخول</DialogTitle>
            <DialogDescription className="text-right">
              .قم بإدخال بيانات تسجيل الدخول الخاصة بك هنا
            </DialogDescription>
          </DialogHeader>
          {error && <GeneralAlert type="error" message={error} />}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 pm-4 pt-2 mb-2">
              <Input
                id="email"
                placeholder="البريد الإلكتروني"
                className="focus-visible:ring-purple-500 text-right"
                {...register("email", { required: "البريد الإلكتروني مطلوب" })}
              />
              {errors.email && (
                <span className="text-red text-sm text-right">
                  {errors.email.message}
                </span>
              )}

              <Input
                id="password"
                placeholder="كلمة المرور"
                type="password"
                className="focus-visible:ring-purple-500 text-right"
                {...register("password", { required: "كلمة المرور مطلوبة" })}
              />
              {errors.password && (
                <span className="text-red text-sm text-right">
                  {errors.password.message}
                </span>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-purple text-sm"
                  onClick={() => {
                    dispatch(openLogin(false));
                    setIsForgotPasswordOpen(true);
                  }}
                >
                  نسيت كلمة المرور؟
                </button>
                <div className="flex items-center gap-2">
                  <Label htmlFor="isPersistent" className="text-sm">
                    تذكرني
                  </Label>
                  <Checkbox
                    id="isPersistent"
                    onCheckedChange={(checked: boolean) =>
                      setValue("isPersistent", checked)
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-purple text-white w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "...جاري الدخول" : "دخول"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isForgotPasswordOpen}
        onOpenChange={setIsForgotPasswordOpen}
      >
        <DialogContent className="sm:max-w-[425px] gap-1">
          <DialogHeader>
            <DialogTitle>نسيت كلمة المرور</DialogTitle>
            <DialogDescription className="text-right">
              أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitForgotPassword(onSubmitForgotPassword)}>
            <Input
              id="forgotPasswordEmail"
              placeholder="البريد الإلكتروني"
              className="focus-visible:ring-purple-500 text-right"
              {...registerForgotPassword("email", {
                required: "البريد الإلكتروني مطلوب",
              })}
            />
            {forgotPasswordErrors.email && (
              <span className="text-red text-sm text-right">
                {forgotPasswordErrors.email.message}
              </span>
            )}
            <DialogFooter>
              <Button
                type="submit"
                className="bg-purple text-white w-full"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending
                  ? "...جاري الإرسال"
                  : "إرسال رابط إعادة التعيين"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Signup
        isSignupOpen={isSignupOpen}
        setIsSignupOpen={() => setIsSignupOpen(false)}
      />
    </>
  );
}
