"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from "@/utils/axiosInstance";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import Image from "next/image";
import Alert from "../../(components)/Alert";

import { useForm } from "react-hook-form";

export interface Order {
  _id: string;
  user: {
    name: string;
    phoneNumber: string;
  };
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    googleLocation: string;
  };
  cart: {
    totalPrice: number;
    products: {
      productId: {
        _id: string;
        name: string;
      };
      quantity: number;
      totalPrice: number;
    }[];
    packages: {
      packageId: {
        _id: string;
        name: string;
      };
      quantity: number;
      totalPrice: number;
    }[];
  };
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  paymentId?: string;
}

const fetchOrders = async () => {
  const response = await axiosInstance.get("orders");
  return response.data;
};

// Form validation schema using Zod

function Orders({ defaultId }: { defaultId: string }) {
  const [selectedOrder, setSelectedOrder] = useState < Order | null > ();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useQuery({
    queryKey: ["client-order"],
    queryFn: fetchOrders,
  });

  const sendOrderMutation = useMutation({
    mutationFn: (data: { orderId: string; email: string }) =>
      axiosInstance.post("/send-order", data),
    onSuccess: () => {
      alert("تم إرسال الطلب بنجاح!");
      setIsEmailDialogOpen(false);
    },
    onError: () => {
      alert("حدث خطأ أثناء إرسال الطلب.");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm < { email: string } > ();

  const handleEmailSubmit = (data: { email: string }) => {
    if (selectedOrder) {
      sendOrderMutation.mutate({
        orderId: selectedOrder._id,
        email: data.email,
      });
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleSendDeliveryClick = () => {
    setIsEmailDialogOpen(true);
  };

  return (
    <>
      <h2 className="text-2xl font-bold my-4 text-right">طلباتي</h2>
      <Card>
        <CardContent>
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">رقم الطلب</TableHead>
                <TableHead className="text-center">التاريخ</TableHead>
                <TableHead className="text-center">المبلغ الإجمالي</TableHead>
                <TableHead className="text-center">حالة الطلب</TableHead>
                <TableHead className="text-center">إرسال التوصيل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isOrdersLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-5">
                    <div className="flex justify-center items-center space-x-2">
                      <span className="text-gray-500 text-lg">
                        جاري تحميل الطلبات...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : isOrdersError ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-5 text-red-500"
                  >
                    حدث خطأ أثناء تحميل الطلبات. يرجى المحاولة مرة أخرى.
                  </TableCell>
                </TableRow>
              ) : ordersData?.data.orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-5 text-gray-500"
                  >
                    لا توجد طلبات حتى الآن.
                  </TableCell>
                </TableRow>
              ) : (
                ordersData?.data.orders.map((order: Order) => (
                  <TableRow key={order._id}>
                    <TableCell className="text-center">
                      <Button
                        variant="link"
                        onClick={() => handleOrderClick(order)}
                      >
                        {order._id}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      {new Date(order.createdAt).toLocaleDateString(
                        "ar-EG-u-nu-arab"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.cart.totalPrice} ريال
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-1 rounded-full text-nowrap`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button onClick={handleSendDeliveryClick}>
                        إرسال التوصيل
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إرسال التوصيل</DialogTitle>
          </DialogHeader>
          {sendOrderMutation.isError && (
            <Alert type="error" message={"لم يتم إرسال الطلب"} />
          )}

          <form
            onSubmit={handleSubmit(handleEmailSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                className="w-full border rounded-md px-4 py-2"
                {...register("email", {
                  required: "الإيميل مطلوب",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "البريد الإلكتروني غير صالح",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" disabled={sendOrderMutation.isPending}>
              {sendOrderMutation.isPending ? "...جاري الإرسال" : "إرسال"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Orders;
