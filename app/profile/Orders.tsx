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
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from "@/utils/axiosInstance";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import Image from "next/image";

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
}

const fetchOrders = async () => {
  const response = await axiosInstance.get("orders");
  return response.data;
};

// Utility functions for status handling
const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-orange-200 text-orange-800";
    case "DELIVERED":
      return "bg-green-200 text-green-800";
    case "CANCELLED":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};
// Utility functions for status handling
const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-orange-200 text-orange-800";
    case "SUCCESS":
      return "bg-green-200 text-green-800";
    case "CANCELLED":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "PENDING":
      return "قيد الانتظار";
    case "DELIVERED":
      return "مكتمل";
    case "CANCELLED":
      return "ملغي";
    default:
      return status;
  }
};
const getPaymentStatusText = (status: string) => {
  switch (status) {
    case "PENDING":
      return "قيد المراجعة";

    case "NOT_PAID":
      return "قيد المراجعة";

    case "SUCCESS":
      return "تم الدفع";
    case "CANCELLED":
      return "ملغي";
    default:
      return status;
  }
};
const getPaymentMethodText = (status: string) => {
  switch (status) {
    case "COD":
      return "عند الاستلام";
    case "BANKAK":
      return "تطبيق بنكك";
    case "INSTANT":
      return "دفع فوري";
    default:
      return status;
  }
};

function Orders({ defaultId }: { defaultId: string }) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>();
  const initialRender = useRef<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useQuery({
    queryKey: ["client-order"],
    queryFn: fetchOrders,
  });

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setTimeout(() => {
      console.log(order);
      setIsDialogOpen(true); // Open dialog after state update
    }, 0);
  };
  useEffect(() => {
    if (ordersData?.data && defaultId) {
      console.log("first");
      const order = ordersData.data.orders.filter(
        (order: any) => order._id === defaultId
      )[0];
      handleOrderClick(order);
    }
  }, [defaultId, ordersData]);

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
                <TableHead className="text-center">حالة الدفع</TableHead>
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
                      <span
                        className={`px-2 py-1 rounded-full text-nowrap ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order?.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-nowrap ${getPaymentStatusColor(
                          order.paymentStatus
                        )}`}
                      >
                        {getPaymentStatusText(order?.paymentStatus)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {selectedOrder && isDialogOpen && (
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (open === false) {
                  setSelectedOrder(null);
                }
              }}
            >
              <DialogContent className="sm:max-w-[625px] ">
                <DialogHeader>
                  <DialogTitle className="text-right">تفاصيل الطلب</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-right">
                        <strong>اسم العميل</strong>
                        <br /> {selectedOrder?.user.name}
                      </div>
                      <div className="text-right">
                        <strong>رقم الهاتف</strong>
                        <br /> {selectedOrder?.user.phoneNumber}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-right">
                        <strong>العنوان</strong> <br />{" "}
                        <Link
                          href={selectedOrder?.address?.googleLocation || ""}
                          target="_blank"
                        >{`${selectedOrder?.address.street},${selectedOrder?.address.postalCode},${selectedOrder?.address.city} `}</Link>
                      </div>
                      <div className="text-right">
                        <strong>حالة الطلب</strong>
                        <br /> {getStatusText(selectedOrder?.status || "")}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-right">
                        <strong>حالة الدفع</strong> <br />{" "}
                        {getPaymentStatusText(
                          selectedOrder?.paymentStatus || ""
                        )}
                      </div>
                      <div className="text-right">
                        <strong>طريقة الدفع</strong>
                        <br />{" "}
                        {getPaymentMethodText(
                          selectedOrder?.paymentMethod || ""
                        )}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <h3 className="text-lg font-semibold mb-2 text-right">
                        تفاصيل السلة
                      </h3>
                      <Table dir="rtl" className="mb-2">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right">المنتج</TableHead>
                            <TableHead className="text-right">الكمية</TableHead>
                            <TableHead className="text-right">السعر</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedOrder?.cart.products.map((product) => (
                            <TableRow key={product.productId._id}>
                              <TableCell className="text-right">
                                {product.productId.name}
                              </TableCell>
                              <TableCell className="text-right">
                                {product.quantity}
                              </TableCell>
                              <TableCell className="text-right">
                                {product.totalPrice} ريال
                              </TableCell>
                            </TableRow>
                          ))}
                          {selectedOrder?.cart.packages.map((product) => (
                            <TableRow key={product.packageId._id}>
                              <TableCell className="text-right">
                                {product.packageId.name}
                              </TableCell>
                              <TableCell className="text-right">
                                {product.quantity}
                              </TableCell>
                              <TableCell className="text-right">
                                {product.totalPrice} ريال
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      <div
                        className="text-right flex flex-col md:flex-row justify-between mb-3 font-bold"
                        dir="rtl"
                      >
                        <strong className="mb-2 md:mb-0">
                          المجموع الكلي: {selectedOrder?.cart.totalPrice} ريال
                        </strong>
                        <Image
                          width={150}
                          height={150}
                          src={"/hwwak-khatem.png"}
                          alt="hawwak ختم"
                          className="mr-auto md:mr-0"
                        ></Image>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default Orders;
