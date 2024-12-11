"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GeneralAlert from "../(components)/Alert";
import { toast } from "@/hooks/use-toast";
import { getCookie } from "cookies-next";

function WrapResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }

    if (newPassword.length < 8) {
      setError("يجب أن تكون كلمة المرور على الأقل 8 أحرف");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("تم إعادة تعيين كلمة المرور بنجاح");
        setNewPassword("");
        setConfirmPassword("");
        toast({
          title: "نجاح",
          description: "تم إعادة تعيين كلمة المرور بنجاح",
        });
        router.replace("/");
      } else {
        setError("الكود خاطئ أو انتهت صلاحيته ، حاول مرة آخرى");
      }
    } catch (err) {
      setError("حدث خطأ. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  if (getCookie("auth_token")) {
    router.replace("/");
  }
  return (
    <div className="lg:min-h-screen flex py-10 lg:py-0 lg:items-center justify-center rtl mx-auto w-[95%] md:w-[90%] lg:w-[50%] xl:w-[30%]">
      <Card className="w-full ">
        <CardHeader className="pb-0 mb-2">
          <CardTitle className="text-right">إعادة تعيين كلمة المرور</CardTitle>
          <CardDescription className="text-right">
            يرجى إدخال كلمة المرور الجديدة أدناه
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <GeneralAlert type="error" message={error} />}
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2 text-right">
              <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="text-right"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 top-0 h-full"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "إخفاء كلمة المرور" : "عرض كلمة المرور"}
                  </span>
                </Button>
              </div>
            </div>
            <div className="space-y-2 text-right ">
              <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="text-right"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 top-0 h-full"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword
                      ? "إخفاء كلمة المرور"
                      : "عرض كلمة المرور"}
                  </span>
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-purple hover:bg-black"
              disabled={isLoading}
            >
              {isLoading ? "جارٍ إعادة التعيين..." : "إعادة تعيين كلمة المرور"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default WrapResetPassword;
