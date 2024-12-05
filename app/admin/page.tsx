"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { deleteCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { deleteName } from "@/utils/cart";
import CuponPage from "./components/CuponPage";
import Productpage from "./components/Productpage";
import PackagePage from "./components/PackagePage";
import OrderPage from "./components/OrderPage";
import SlidersPage from "./components/SlidersPage";
export default function AdminDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    deleteCookie("auth_token");
    dispatch(deleteName());
    queryClient.invalidateQueries({ queryKey: ["cart"] });
    location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 text-right" dir="rtl">
      <div className="container mx-auto w-[95%] md:w-[90%] lg:w-[80%]  py-6 ">
        <div className="flex justify-between items-center mb-8  flex-col md:flex-row">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0 text-right md:text-center">
            لوحة التحكم الإدارية
          </h1>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 mr-auto md:mr-0"
          >
            <LogOut size={18} />
            تسجيل الخروج
          </Button>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-white p-1 rounded-lg shadow-sm flex-wrap bg-white mb-5 md:mb-0">
            <TabsTrigger value="orders" className="px-4 py-2">
              الطلبات
            </TabsTrigger>
            <TabsTrigger value="products" className="px-4 py-2">
              المنتجات
            </TabsTrigger>
            <TabsTrigger value="packages" className="px-4 py-2">
              الحزم
            </TabsTrigger>
            <TabsTrigger value="coupons" className="px-4 py-2">
              الكوبونات
            </TabsTrigger>
            <TabsTrigger value="sliders" className="px-4 py-2">
              البانرات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrderPage />
          </TabsContent>

          <TabsContent value="products">
            <Productpage />
          </TabsContent>

          <TabsContent value="packages">
            <PackagePage />
          </TabsContent>

          <TabsContent value="coupons">
            <CuponPage />
          </TabsContent>
          <TabsContent value="sliders">
            <SlidersPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
