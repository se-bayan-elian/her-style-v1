"use client";
import { useEffect, useState } from "react";
import { Lock, ShoppingBag, ShoppingCart, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import CartItems from "./CartItems";
import { RootState } from "@/utils/store";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Loading from "./Loading";
import CartItemsSkeleton from "./cartItemSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import useAxiosInstance from "@/utils/axiosInstance";
import { AxiosInstance } from "axios";
export async function getCart(axiosInstance: AxiosInstance) {
  try {
    const response = await axiosInstance.get("/cart");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default function Cart() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isBlock, setIsBlock] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const path = usePathname();
  const axiosInstance = useAxiosInstance()


  async function deleteProductFromCart(productId: string, type: string) {
    try {
      const response = await axiosInstance.delete(
        `/cart/remove-${type}/${productId}`
      );
      return response.data;
    } catch (error) { }
  }

  async function applyCoupon(code: string) {
    try {
      const response = await axiosInstance.post("cart/apply-coupon", { code });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(axiosInstance),
  });

  const cartItems =
    data?.data?.carts[0]?.packages.concat(data?.data?.carts[0]?.products) || [];

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: ({ productId, type }: { productId: string; type: string }) =>
      deleteProductFromCart(productId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleDeleteProduct = (productId: string, type: string) => {
    deleteMutation.mutate({ productId, type });
  };

  const applyCouponMutation = useMutation({
    mutationFn: applyCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleApplyCoupon = () => {
    if (couponCode) {
      applyCouponMutation.mutate(couponCode);
    }
  };

  useEffect(() => {
    if (path.includes("payment")) {
      setIsBlock(true);
    } else {
      setIsBlock(false);
    }
  }, [path]);

  return (
    <div className="inline-block relative">
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ShoppingBag className="h-6 w-6" />
        {data?.data?.carts[0]?.products?.length +
          data?.data?.carts[0]?.packages?.length >
          0 && (
            <Badge className="absolute bg-purple hover:bg-purple flex items-center justify-center -top-2 -right-2 h-6 w-6 rounded-full p-2">
              <p>
                {data?.data?.carts[0]?.products?.length +
                  data?.data?.carts[0]?.packages?.length}
              </p>
            </Badge>
          )}
      </Button>

      {isOpen && !isBlock && (
        <Card className="absolute left-0 top-full mt-2 md:w-80 w-72 z-50">
          <CardHeader className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[200px]">
            {isLoading ? (
              <>
                {Array.of(2, 0).map((item, index) => {
                  return <CartItemsSkeleton key={`cart-skeleton-${index}`} />;
                })}
                <div className="border-t pt-4 w-full">
                  <Skeleton className="h-6 w-1/2 mb-4 mx-auto" />
                  <div className="flex items-center justify-end mb-2 gap-1/2">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20 ml-2" />
                  </div>
                  <div className="flex flex-col items-end border-t pt-4">
                    <Skeleton className="h-4 w-40 mb-2" />
                    <div className="flex items-center mb-2 gap-2 w-full">
                      <Skeleton className="h-8 w-[67px]" />
                      <Skeleton className="h-8 flex-grow rounded-r-md" />
                    </div>
                    <Skeleton className="h-4 w-40 mb-2" />
                  </div>
                  <div className="flex justify-end  mb-2 first-line:font-medium mt-2 gap-1/2">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20 ml-2" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full mb-2" />
              </>
            ) : error ? (
              <div className="w-full">
                <Lock className="h-12 w-12 text-gray-500 mx-auto" />
                <p className="text-center text-gray-600 text-lg font-medium">
                  !عليك تسجيل الدخول أولاً
                </p>
                <p className="text-center text-gray-500 text-sm">
                  يرجى تسجيل الدخول للوصول إلى هذه الصفحة
                </p>
              </div>
            ) : cartItems.length > 0 ? (
              <div className="w-full ">
                <div
                  className={`${cartItems.length > 2
                    ? "overflow-y-scroll h-[180px]"
                    : "overflow-y-clip h-fit"
                    }  overflow-hidden cart-items p-0 m-0`}
                >
                  {cartItems.map((item: any) => {
                    return (
                      <CartItems
                        key={item._id}
                        id={item.productId ? item.productId : item.packageId}
                        price={item.totalPrice / item.quantity}
                        name={`${item.productId
                          ? item.productId.name
                          : item.packageId?.name
                          }`}
                        image={
                          item.productId
                            ? item.productId.images[0]
                            : item.packageId?.images[0]
                        }
                        quantity={item.quantity}
                        onDelete={() =>
                          handleDeleteProduct(
                            `${item.productId
                              ? item.productId._id
                              : item.packageId._id
                            }`,
                            item.productId ? "product" : "package"
                          )
                        }
                        stateOfDeleting={deleteMutation.isPending}
                        type={item.productId ? "product" : "package"}
                      />
                    );
                  })}
                </div>
                <div className="border-t pt-4 w-full">
                  <h3 className="font-medium mb-4 w-full text-center ">
                    ملخص الطلب
                  </h3>
                  <div className="flex items-center justify-end mb-2 gap-1/2">
                    <span>ر.س </span>
                    <span>{data.data.carts[0].totalPrice}</span>
                    <span className="ml-1 text-gray-500">:مجموع المنتجات</span>
                  </div>
                  <div className="flex flex-col items-end border-t pt-4">
                    <p className="mb-2 ">هل لديك كود خصم ؟</p>
                    <div className="flex items-center mb-2">
                      <Button
                        className="rounded-r-none bg-purple text-white"
                        onClick={handleApplyCoupon}
                        disabled={applyCouponMutation.isPending}
                      >
                        إضافة
                      </Button>
                      <input
                        type="text"
                        placeholder="ادخل الكود"
                        className="w-[70%] p-1 h-full  border rounded-r-md text-right"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                    </div>
                    {applyCouponMutation.isError && (
                      <p className="text-red-500 text-sm text-right">
                        .فشل تطبيق الكوبون. يرجى المحاولة مرة أخرى
                      </p>
                    )}
                    {applyCouponMutation.isSuccess && (
                      <p className="text-green-500 text-sm">
                        تم تطبيق الكوبون بنجاح!
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end  font-medium mt-2 gap-1/2">
                    <span>ر.س</span>
                    <span>{data.data.carts[0].totalPrice}</span>
                    <span className="text-gray-500 ml-2">: الإجمالي </span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <ShoppingCart className="h-12 w-12 text-gray-500" />
                <p className="text-center text-gray-600 text-lg font-medium">
                  عربة التسوق فارغة
                </p>
                <p className="text-center text-gray-500 text-sm">
                  . يبدو أنك لم تقم بإضافة أي منتجات حتى الآن
                </p>
              </>
            )}
          </CardContent>
          {!isLoading && !error && cartItems.length > 0 && (
            <CardFooter>
              <Button
                className="w-full bg-purple"
                onClick={() => {
                  setIsOpen(false);
                  router.push("/checkout");
                }}
              >
                إتمام الطلب
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
}
