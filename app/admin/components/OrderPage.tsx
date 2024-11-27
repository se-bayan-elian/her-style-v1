"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Pagination from "@/app/(components)/Pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Order } from "@/app/profile/Orders";

function OrderPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", page, limit],
    queryFn: () => axiosInstance.get(`orders`),
  });

  const updateOrderStatus = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      axiosInstance.put(`orders/${orderId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const orders = data?.data?.data?.orders || [];
  const { count } = data?.data?.data?.options || {};

  const filteredOrders = orders.filter(
    (order: any) => order.status !== "CANCELLED"
  );

  const openDialog = (order: any) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

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

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "قيد الانتظار";
      case "DELIVERED":
        return "تم التوصيل";
      case "CANCELLED":
        return "ملغي";
      default:
        return status;
    }
  };
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
  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "قيد المراجعة";
      case "SUCCESS":
        return "تم الدفع";
      case "CANCELLED":
        return "ملغي";
      default:
        return status;
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatus.mutate({ orderId, status: newStatus });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>الطلبات</CardTitle>
      </CardHeader>
      <CardContent>
        <>
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">رقم الطلب</TableHead>
                <TableHead className="text-right">الإجمالي</TableHead>
                <TableHead className="text-right">حالة الطلب</TableHead>
                <TableHead className="text-right">حالة الدفع</TableHead>
                <TableHead className="text-right">المشتري</TableHead>
                <TableHead className="text-right">تاريخ الطلب</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-5">
                    <div className="flex justify-center items-center space-x-2">
                      <span className="text-gray-500 text-lg">
                        جاري تحميل الطلبات...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-5 text-red-500"
                  >
                    حدث خطأ أثناء تحميل الطلبات. يرجى المحاولة مرة أخرى.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order: any) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <button
                        onClick={() => openDialog(order)}
                        className="text-blue-600 hover:underline"
                      >
                        {order._id}
                      </button>
                    </TableCell>
                    <TableCell>{order.cart.totalPrice} ريال</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-nowrap ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-nowrap ${getPaymentStatusColor(
                          order.paymentStatus
                        )}`}
                      >
                        {getPaymentStatusText(order.paymentStatus)}
                      </span>
                    </TableCell>
                    <TableCell>{order.user?.name}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString(
                        "ar-EG-u-nu-arab"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {order.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-purple text-white"
                              onClick={() =>
                                handleStatusUpdate(order._id, "DELIVERED")
                              }
                              disabled={updateOrderStatus.isPending}
                            >
                              تم التوصيل
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleStatusUpdate(order._id, "CANCELLED")
                              }
                              disabled={updateOrderStatus.isPending}
                            >
                              إلغاء
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <Pagination
            currentPage={page}
            totalCount={count}
            limit={limit}
            onPageChange={(newPage) => setPage(newPage)}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1); // Reset to first page when limit changes
            }}
          />
        </>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-right">تفاصيل الطلب</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
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
                      href={selectedOrder.address.googleLocation}
                    >{`${selectedOrder?.address.street}, ${selectedOrder?.address.city}, ${selectedOrder.address.country}`}</Link>
                  </div>
                  <div className="text-right">
                    <strong>حالة الطلب</strong>
                    <br /> {getStatusText(selectedOrder?.status)}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-right">
                    <strong>حالة الدفع</strong> <br />{" "}
                    {getPaymentStatusText(selectedOrder?.paymentStatus)}
                  </div>
                  <div className="text-right">
                    <strong>طريقة الدفع</strong>
                    <br />{" "}
                    {selectedOrder?.paymentMethod === "COD"
                      ? "عند الاستلام"
                      : "دفع إلكتروني"}
                  </div>
                </div>
                <div className="col-span-1">
                  <h3 className="text-lg font-semibold mb-2 text-right">
                    تفاصيل السلة
                  </h3>
                  <Table dir="rtl">
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
                    </TableBody>
                  </Table>
                  <div className="text-right mt-4 font-bold">
                    <strong>
                      المجموع الكلي: {selectedOrder.cart.totalPrice} ريال
                    </strong>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// function CartInfo({ order }: { order: any }) {
//   return (
//     <div className="space-y-4 text-right">
//       <div>
//         <h3 className="font-semibold">معلومات المشتري</h3>
//         <p>{order.user.name} :الاسم</p>
//         <p> {order.user.phoneNumber} :رقم الهاتف</p>
//       </div>
//       <div>
//         <h3 className="font-semibold">عنوان التوصيل</h3>
//         <p> {order.address.street} :الشارع</p>
//         <p>المدينة: {order.address.city}</p>
//         <p> {order.address.postalCode} :الرمز البريدي</p>
//         <p> {order.address.country}:الدولة</p>
//       </div>
//       <div>
//         <h3 className="font-semibold">المنتجات</h3>
//         <ul className="">
//           {order.cart.products.map((product: any) => (
//             <li key={product._id}>
//               {product.productId.name} - الكمية: {product.quantity} - السعر:{" "}
//               {product.totalPrice} ريال
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div>
//         <h3 className="font-semibold">
//           إجمالي الطلب: {order.cart.totalPrice} ريال
//         </h3>
//       </div>
//       <div>
//         <h3 className="font-semibold">معلومات الدفع</h3>
//         <p>
//           طريقة الدفع :{" "}
//           {order.paymentMethod === "COD"
//             ? "الدفع عند الاستلام"
//             : "دفع إلكتروني"}
//         </p>
//         <p>
//           حالة الدفع:{" "}
//           {order.paymentStatus === "PENDING" ? "قيد الانتظار" : "مكتمل"}
//         </p>
//       </div>
//     </div>
//   );
// }

export default OrderPage;
