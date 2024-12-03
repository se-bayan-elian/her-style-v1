import React from "react";
import Product from "@/app/(components)/Product";
import { Button } from "@/components/ui/button";
import ProductSkelton from "@/app/(components)/ProductSkelton";
import { ShoppingCartIcon } from "lucide-react";

function ProductGrid({
  products,
  packages,
  isLoading,
  loadMore,
  hasMore,
  isFetchingNext,
}: {
  products: any;
  packages: any;
  isLoading: boolean;
  loadMore: () => void;
  hasMore: boolean;
  isFetchingNext: boolean;
}) {
  return (
    <div className="min-h-screen w-full">
      <div
        style={{ direction: "rtl" }}
        className="product-grid w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-4 justify-items-center"
      >
        {products.length === 0 && packages.length === 0 && !isLoading && (
          <div className="h-full w-full flex items-center justify-center md:col-span-2 lg:col-span-3">
            <div className="flex flex-col items-center justify-center p-8  text-center ">
              <ShoppingCartIcon className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-xl font-semibold text-gray-800">
                لا توجد منتجات ملائمة في المتجر
              </p>
              <p className="text-sm text-gray-500 mt-2">
                نأسف، لم نجد أي منتج لعرضه في الوقت الحالي.
              </p>
            </div>
          </div>
        )}

        {isLoading ? (
          Array(6)
            .fill(null)
            .map((_, index) => (
              <ProductSkelton key={index} isLoading={isLoading} />
            ))
        ) : (
          <>
            {products?.map((product: any) => (
              <Product
                key={product._id}
                className="w-[250px]"
                id={`/product/${product._id}`}
                image={product.images[0]}
                title={product.name}
                rating={product.stars}
                reviewCount={product.numReviews}
                price={product.price.finalPrice}
                originalPrice={product.price.originalPrice}
                discount={product.price.discount}
              />
            ))}
          </>
        )}

        {packages &&
          packages.map((el: any) => (
            <Product
              key={el._id}
              id={`/package/${el._id}`}
              image={el.images[0]}
              title={el.name}
              rating={el.stars}
              reviewCount={el.numReviews}
              price={el.price.finalPrice}
              originalPrice={el.price.originalPrice}
              discount={el.price.discount}
            />
          ))}
        {isFetchingNext &&
          Array(6)
            .fill(null)
            .map((_, index) => (
              <ProductSkelton key={index} isLoading={isFetchingNext} />
            ))}
      </div>
      {hasMore && (
        <div className=" my-2 flex justify-center items-center w-full">
          <Button
            className="bg-purple hover:bg-white hover:text-purple hover:border-purple border-2 border-purple text-white"
            onClick={loadMore}
            disabled={isFetchingNext}
          >
            تحميل المزيد
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProductGrid;
