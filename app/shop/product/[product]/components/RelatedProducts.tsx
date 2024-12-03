import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingBag, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const addToCartMutation = async (productId: string) => {
  const response = await axiosInstance.post(`cart/add-product/${productId}`, {
    quantity: 1,
  });
  return response.data;
};

function RelatedProducts({ data }: { data: any }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (productId: string) => addToCartMutation(productId),
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم إضافة العنصر إلى السلة",
        // يمكنك إضافة المزيد من الخصائص هنا إذا لزم الأمر
      });

      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Error adding product to cart:", error);
      // Handle error (e.g., show an error message to the user)
    },
  });

  const handleAddToCart = (id: string) => {
    mutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      {data.map((item: any, index: number) => (
        <div
          key={index}
          className="bg-white rounded-lg overflow-hidden shadow-md md:p-4 flex md:gap-2 flex-col sm:flex-row-reverse items-start md:items-center"
        >
          <div className="relative  w-full sm:w-1/2  md:w-1/3  h-[230px] md:h-[270px] ">
            <Link href={`/shop/product/${item._id}`}>
              <Image
                src={item.images[0]}
                alt={`Related product ${index}`}
                layout="fill"
                objectFit="cover"
                className="md:rounded-lg w-full"
              />
            </Link>
          </div>
          <div className="mt-4 sm:w-1/2 sm:px-2 px-2 md:px-0  md:w-2/3 lg:mt-0 lg:w-4/5 lg:pr-4 flex flex-col justify-between">
            <div className="flex md:flex-row flex-col-reverse justify-between md:items-center mb-2">
              <span
                dir="rtl"
                className="text-base hidden md:flex font-bold text-purple  justify-center items-center gap-1"
              >
                <span>{item.price.finalPrice}</span>
                <span>ر.س</span>
              </span>
              <div className="flex md:flex-row flex-col-reverse items-end md:items-center">
                <Link href={`/shop/product/${item._id}`}>
                  <h3 className="text-lg font-semibold text-right">
                    {item.name}
                  </h3>
                </Link>
              </div>
            </div>
            <div className="flex justify-between md:justify-end items-center">
              <span
                dir="rtl"
                className="text-base md:hidden  flex font-bold text-purple  justify-center items-center gap-1"
              >
                <span>{item.price.finalPrice}</span>
                <span>ر.س</span>
              </span>
              <div className="flex flex-row-reverse items-center  md:mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < item.stars
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-justify text-sm text-gray-600 mb-4 whitespace-pre-wrap" dir="rtl">
              {item.description.length > 300
                ? `${item.description.slice(0, 300)}...`
                : item.description}
            </p>
            <div className="flex justify-end items-center">
              <button
                onClick={() => handleAddToCart(item._id)}
                disabled={mutation.isPending}
                className=" hidden mt-3 border-2 md:flex items-center border-purple text-purple px-4 py-2 rounded-lg hover:bg-purple hover:text-white transition duration-300 disabled:opacity-50"
              >
                <p>{mutation.isPending ? "جاري الإضافة..." : "إضافة للسلة"}</p>
                <ShoppingBag className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RelatedProducts;
