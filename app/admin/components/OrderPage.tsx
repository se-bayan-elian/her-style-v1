"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useForm } from "react-hook-form";
import Alert from "../../(components)/Alert";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import useAxiosInstance from "@/utils/axiosInstance";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function OrderPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const axiosInstance = useAxiosInstance()


  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", page, limit],
    queryFn: async () => {
      const response = await axiosInstance.get(`/orders`, {
        params: { page, limit }
      });
      setCount(response?.data?.data?.options?.count || 0);
      return response;
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) => axiosInstance.put(`orders/${orderId}`, { status })
    ,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", page, limit] });
    },
  });
  const updateOrderPaymentStatus = useMutation({
    mutationFn: ({
      orderId,
      paymentStatus,
    }: {
      orderId: string;
      paymentStatus: string;
    }) => axiosInstance.put(`orders/${orderId}`, { paymentStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", page, limit] });
    },
  });

  const orders = data?.data?.data?.orders || [];

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
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-200 text-orange-800";
      case "SUCCESS":
        return "bg-green-200 text-green-800";
      case "REFUNDED":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };
  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "قيد المراجعة";
      case "NOT_PAID":
        return "لم يتم الدفع";
      case "SUCCESS":
        return "تم الدفع";
      case "REFUNDED":
        return "مرجع";
      default:
        return status;
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatus.mutate({ orderId, status: newStatus });
  };
  const handlePaymentStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderPaymentStatus.mutate({ orderId, paymentStatus: newStatus });
  };
  const {
    register,
    handleSubmit,
    setValue: setDeliverEmailValue,
    formState: { errors: deliverEmailErrors },
  } = useForm<{ email: string }>();

  // Fetch deliver-emails data
  const {
    data: emails,
    isLoading: emailsLoading,
    isError: emailsError,
  } = useQuery({
    queryKey: ["deliverEmails"], queryFn: () =>
      axiosInstance.get("/deliver-emails").then((res) => res.data.data.deliveryEmails)
  });
  const sendOrderMutation = useMutation({
    mutationFn: (data: { orderId: string; email: string }) =>
      axiosInstance.post("/orders/send-order", data),
    onSuccess: () => {
      setIsEmailDialogOpen(false);
      toast({
        title: "نجاح",
        description: "تم إرسال الطلب بنجاح إلى العميل عبر البريد الإلكتروني.",
        // يمكنك إضافة المزيد من الخصائص هنا إذا لزم الأمر
      });
    },
  });

  const handleEmailSubmit = (data: { email: string }) => {
    if (selectedOrder) {
      sendOrderMutation.mutate({
        orderId: selectedOrder._id,
        email: data.email,
      });
    }
  };
  const handleSendDeliveryClick = (order: any) => {
    setIsEmailDialogOpen(true);
    setSelectedOrder(order);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>الطلبات</CardTitle>
      </CardHeader>
      <CardContent>
        <Table dir="rtl" className="h-[400px]">
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
              orders.map((order: any) => (
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
                            onClick={() => handleSendDeliveryClick(order)}
                            disabled={updateOrderStatus.isPending}
                          >
                            إرسال التوصيل
                          </Button>
                          {order.paymentMethod === "BANKAK" &&
                            order.paymentStatus === "PENDING" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-green-700 text-white hover:bg-green-600 hover:text-white"
                                onClick={() =>
                                  handlePaymentStatusUpdate(
                                    order._id,
                                    "SUCCESS"
                                  )
                                }
                                disabled={
                                  updateOrderPaymentStatus.isPending ||
                                  updateOrderStatus.isPending
                                }
                              >
                                تأكيد الدفع
                              </Button>
                            )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-green-700 text-white hover:bg-green-600 hover:text-white"
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
                      target="_blank"
                    >{`${selectedOrder?.address.street}, ${selectedOrder.address.postalCode}, ${selectedOrder?.address.city}`}</Link>
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
                    {getPaymentMethodText(selectedOrder?.paymentMethod || "")}
                  </div>
                </div>
                {selectedOrder?.paymentId && (
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    dir="rtl"
                  >
                    <div className="text-right">
                      <strong>معرف الدفع</strong> <br />{" "}
                      {selectedOrder?.paymentId || "لا يوجد"}
                    </div>
                  </div>
                )}
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
      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle dir="rtl" className="text-right">
              إرسال التوصيل
            </DialogTitle>
          </DialogHeader>
          {sendOrderMutation.isError && (
            <Alert type="error" message={"لم يتم إرسال الطلب"} />
          )}

          <form
            onSubmit={handleSubmit(handleEmailSubmit)}
            className="space-y-4"
          >
            <label className="block text-md font-medium">
              البريد الإلكتروني
            </label>
            {emailsLoading ? (
              <div className="flex justify-center items-center">
                جاري تحميل البيانات
              </div>
            ) : emailsError ? (
              <p className="text-red-500">حدث خطأ أثناء تحميل البريد الإلكتروني.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {/* ChadCN Select Dropdown */}
                <Select dir="rtl" onValueChange={(email) => {
                  setDeliverEmailValue("email", email)
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر بريدًا إلكترونيًا" />
                  </SelectTrigger>
                  <SelectContent>
                    {emails?.map((email: any) => (
                      <SelectItem key={email._id} value={email.email}>
                        {email.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {deliverEmailErrors.email && (
                  <p className="text-red-500 text-sm">{deliverEmailErrors.email.message}</p>
                )}

              </div>
            )}
            <Button
              type="submit"
              className="mr-auto"
              disabled={sendOrderMutation.isPending}
            >
              إرسال
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default OrderPage;
