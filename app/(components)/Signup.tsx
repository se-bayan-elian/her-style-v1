import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

import Alert from "./Alert";
import useAxiosInstance from "@/utils/axiosInstance";

interface SignupProps {
  isSignupOpen: boolean;
  setIsSignupOpen: (open: boolean) => void;
}

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

function Signup({ isSignupOpen, setIsSignupOpen }: SignupProps) {
  const [error, setError] = useState<string | null>(null);
  const axiosInstance = useAxiosInstance()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<SignupFormData>();

  const router = useRouter();

  const signup = async (data: SignupFormData) => {
    const response = await axiosInstance.post("/users/signup", {
      ...data,
      role: "CLIENT",
    });
    return response.data;
  };

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      setIsSignupOpen(false); // Close the dialog
      reset(); // Reset the form
      toast({
        title: "نجاح",
        description:
          "تم إنشاء حسابك بنجاح، ولكن يجب عليك التحقق من حسابك وتنشيط حسابك عبر البريد الإلكتروني.",
        // يمكنك إضافة المزيد من الخصائص هنا إذا لزم الأمر
      });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || "هذا المستخدم موجود بالفعل");
    },
  });

  const onSubmit = (data: SignupFormData) => {
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    signupMutation.mutate(data);
  };

  return (
    <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex justify-between items-end">
          <DialogTitle>تسجيل جديد</DialogTitle>
          <DialogDescription className="text-right">
            .قم بإدخال بياناتك للتسجيل. انقر على تسجيل عند الانتهاء
          </DialogDescription>
        </DialogHeader>
        {error && <Alert type="error" message={error} />}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 pm-4">
            <div className="grid grid-cols-4 items-center ">
              <Input
                dir="rtl"
                id="signup-name"
                placeholder="الاسم"
                className="col-span-4 focus-visible:ring-purple-500 text-right"
                {...register("name", { required: "الاسم مطلوب" })}
              />
              {errors.name && (
                <span className="text-red text-sm col-span-4 text-right">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center">
              <Input
                id="signup-email"
                placeholder="البريد الإلكتروني"
                className="col-span-4 focus-visible:ring-purple-500 text-right"
                {...register("email", {
                  required: "البريد الإلكتروني مطلوب",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "البريد الإلكتروني غير صالح",
                  },
                })}
              />
              {errors.email && (
                <span className="text-red text-sm col-span-4 text-right">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 items-center">
              <Input
                id="signup-phone"
                placeholder="رقم الهاتف"
                className="col-span-4 focus-visible:ring-purple-500 text-right"
                type="text" // Use "text" for phone numbers
                {...register("phoneNumber", {
                  required: "رقم الهاتف مطلوب",
                  pattern: {
                    value: /^0\d{9}$/, // Example pattern for a 10-digit phone number
                    message: "تنسيق خاطئ ، مثال: 0553612533",
                  },
                })}
              />
              {errors.phoneNumber && (
                <span className="text-red text-sm col-span-4 text-right">
                  {errors.phoneNumber.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 items-center">
              <Input
                id="signup-password"
                placeholder="كلمة المرور"
                className="col-span-4 focus-visible:ring-purple-500 text-right"
                type="password"
                {...register("password", {
                  required: "كلمة المرور مطلوبة",
                  minLength: {
                    value: 6,
                    message: "كلمة المرور يجب أن تكون على الأقل 6 أحرف",
                  },
                })}
              />
              {errors.password && (
                <span className="text-red text-sm col-span-4 text-right">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 items-center mb-3">
              <Input
                id="signup-confirm-password"
                placeholder="تأكيد كلمة المرور"
                className="col-span-4 focus-visible:ring-purple-500 text-right"
                type="password"
                {...register("confirmPassword", {
                  required: "تأكيد كلمة المرور مطلوب",
                  validate: (val: string) => {
                    if (watch("password") != val) {
                      return "كلمات المرور غير متطابقة";
                    }
                  },
                })}
              />
              {errors.confirmPassword && (
                <span className="text-red text-sm col-span-4 text-right">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-purple text-white px-4 py-2 rounded w-full"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "...جاري التسجيل" : "تسجيل"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Signup;
