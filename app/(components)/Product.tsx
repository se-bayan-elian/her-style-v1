"use client";
import Image from "next/image";
import { ShoppingBag, Star } from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import useAxiosInstance from "@/utils/axiosInstance";

interface ProductProps {
  image: string;
  title: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
  discount: number;
  id: string;
  className?: string;
}



const Product: React.FC<ProductProps> = ({
  id,
  image,
  title,
  rating,
  reviewCount,
  price,
  originalPrice,
  className,
}) => {
  const queryClient = useQueryClient();
  const axiosInstance = useAxiosInstance()
  const addToCartMutation = async (productId: string) => {
    const array = productId.split("/");
    const type = array[1];
    const id = array[array.length - 1];

    const response = await axiosInstance.post(`cart/add-${type}/${id}`, {
      quantity: 1,
    });
    console.log(response);
    return response.data;
  };
  const mutation = useMutation({
    mutationFn: (productId: string) => addToCartMutation(productId),
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم إضافة المنتج بنجاح إلى السلة",
      });

      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "لا يمكنت أضافه المنتج لانك لست مسجل دخول",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (id: string) => {
    mutation.mutate(id);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md ${className} h-fit w-full`}>
      <div className="relative overflow-hidden h-[250px]">
        <Link href={`/shop/${id}`}>
          <Image
            src={image}
            alt={title}
            width={200}
            height={200}
            className="w-full h-[250px] rounded-t-lg object-cover "
          />
        </Link>
      </div>
      <div style={{ direction: "ltr" }} className="p-4">
        <Link
          href={`/shop/${id}`}
          className="hover:text-purple hover:underline "
        >
          <h3 className="font-bold text-lg mb-2 text-right h-[57px] ">
            {title}
          </h3>
        </Link>
        <div className="flex items-center justify-end mb-2 gap-2">
          <div className="flex flex-row-reverse">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col-reverse  items-end">
          <button
            onClick={() => handleAddToCart(id)}
            disabled={mutation.isPending}
            className="mt-3 border-2 flex items-center border-purple text-purple px-4 py-2 rounded-lg hover:bg-purple hover:text-white transition duration-300 disabled:opacity-50"
          >
            <p>{mutation.isPending ? "...جاري الإضافة" : "إضافة للسلة"}</p>
            <ShoppingBag className="ml-2" />
          </button>
          <div className="text-right">
            <p className="text-purple font-bold flex flex-row-reverse">
              <span>{price.toFixed(2)}</span>
              <span>ر.س</span>

            </p>
            <div className="flex items-center ">
              <p className="text-red text-sm mr-2">
                {100 - Math.floor((price / originalPrice) * 100)}%
              </p>
              <p className="text-gray-500 line-through text-sm flex gap-0 justify-start flex-row-reverse">
                <span>{originalPrice.toFixed(2)}</span>
                <span>ر.س</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
