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
import useAxiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";

type LoginFormData = {
  email: string;
  password: string;
  isPersistent: boolean;
};

type ForgotPasswordFormData = {
  email: string;
};



export function Login() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.login.open);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isResendCodeALlowed, setIsResendCodeALlowed] = useState(false);
  const axiosInstance = useAxiosInstance();

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
      const response = await axiosInstance.post("/users/reset-password-link",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  const resendCode = async (email: string | null) => {
    try {
      const response = await axiosInstance.post(`/users/resend-verification-email`,
        { email }
      );
      return response.data; // Assuming the response contains the message you need
    } catch (e) {
      throw e;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
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
  const user = useSelector((state: RootState) => state?.user?.name);
  const resendCodeMutation = useMutation({
    mutationFn: () => resendCode(watch('email')),
    onSuccess: () => {
      setIsResendCodeALlowed(false);
      dispatch(openLogin(false));
      setError('')
      toast({
        title: "نجاح",
        description: "تم إرسال الكود بنجاح ، قم بمراجعة بريدك الإلكتروني",
      });
    },
    onError: () => {
      setError('أماأن الحساب مفعل أو أعد المحاولة بعد 5 دقائق')
      toast({
        title: "فشل",
        description: "حدث خطأ غير متوقع ، قم بإعادة المحاولة بعد 5 دقائق",
        variant: "destructive",
      });
    },
  });
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
      if (error.response?.data.errorCode === 403) {
        setIsResendCodeALlowed(true)
        setError("يرجى تفعيل بريدك الإلكتروني");
      } else {
        setError("بيانات الاعتماد خاطئة");
        reset();
      }
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
          {error && <GeneralAlert type="error" message={error}>
            {isResendCodeALlowed && <button className="underline hover:text-red-900" disabled={resendCodeMutation.isPending} onClick={() => {
              resendCodeMutation.mutate()
            }}>
              {resendCodeMutation.isPending ? "جاري الإرسال" : "إعادة إرسال الكود"}
            </button>}
          </GeneralAlert>}

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
            <DialogFooter className="flex flex-col">
              <div className="w-full">
                <div>
                  <Button type="submit" className="bg-purple text-white px-4 py-2 rounded w-full" disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? '... جاري الدخول' : 'دخول'}
                  </Button>
                </div>
                <button
                  type="button"
                  className="text-purple px-4 py-2 rounded w-full"
                  onClick={() => setIsSignupOpen(true)}
                >
                  تسجيل جديد
                </button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog >

      <Dialog
        open={isForgotPasswordOpen}
        onOpenChange={setIsForgotPasswordOpen}
      >
        <DialogContent className="sm:max-w-[425px] gap-1" dir="rtl">
          <DialogHeader dir="rtl">
            <DialogTitle className="text-right">نسيت كلمة المرور</DialogTitle>
            <DialogDescription className="text-right mb-1">
              أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitForgotPassword(onSubmitForgotPassword)}>
            <Input
              id="forgotPasswordEmail"
              placeholder="البريد الإلكتروني"
              className="focus-visible:ring-purple-500 text-right mb-2"
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
                  ? "جاري الإرسال"
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
