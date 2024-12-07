import Product from "@/app/(components)/Product";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import ProductSkelton from "@/app/(components)/ProductSkelton";
import useAxiosInstance from "@/utils/axiosInstance";


function RecommendedProducts() {
  const axiosInstance = useAxiosInstance()
  async function getProducts() {
    const { data } = await axiosInstance.get("products");
    return data.data;
  }

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["recommended-products"],
    queryFn: getProducts,
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 py-4 justify-items-center">
      {/* Repeat this product card 4 times */}
      {[...Array(4)].map((_, index) => (
        <ProductSkelton key={index} isLoading={productsLoading} />
      ))}
      {productsData &&
        productsData.products
          .slice(0, 4)
          .map((product: any, i: number) => (
            <Product
              id={`/product/${product._id}`}
              key={product._id}
              image={product.images[0]}
              title={product.name}
              rating={product.stars}
              reviewCount={product.numReviews}
              price={product.price.finalPrice}
              originalPrice={product.price.originalPrice}
              discount={product.price.discount}
            />
          ))}
      {/* ... Repeat for other products */}
    </div>
  );
}

export default RecommendedProducts;
