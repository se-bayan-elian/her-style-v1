"use client";
import React, { useState, useCallback, useEffect } from "react";
import FilterSection from "./component/FilterSection";
import ProductGrid from "./component/ProductGrid";
import { useInfiniteQuery } from "@tanstack/react-query";
import MobileFilterSection from "./component/MobileFilter";
import useAxiosInstance from "@/utils/axiosInstance";

function Page() {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [stars, setStars] = useState<number | null>(null);
  const [areProductsExhausted, setAreProductsExhausted] = useState(false);

  const [filter, setFilter] = useState({
    rating: 0,
    productsChecked: true,
    packagesChecked: false,
    priceRange: { min: 0, max: 5000 },
  });

  const [isOnlyPackages, setIsOnlyPackages] = useState(false);
  const [isOnlyProducts, setIsOnlyProducts] = useState(false);
  const axiosInstance = useAxiosInstance()

  const fetchProducts = useCallback(
    async ({ pageParam = 1, limit = 6 }) => {
      if (isOnlyPackages)
        return {
          data: {
            data: { products: [], options: { page: 1, count: 0, limit: 6 } },
          },
        };

      const res = await axiosInstance.get("products", {
        params: {
          page: pageParam,
          limit,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          stars,
        },
      });
      return res;
    },
    [priceRange, stars, isOnlyPackages]
  );

  const fetchPackages = useCallback(
    async ({ pageParam = 1, limit = 6 }) => {
      if (isOnlyProducts)
        return {
          data: {
            data: { packages: [], options: { page: 1, count: 0, limit: 6 } },
          },
        };

      const res = await axiosInstance.get("packages", {
        params: {
          page: pageParam,
          limit,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          stars,
        },
      });
      return res;
    },
    [priceRange, stars, isOnlyProducts]
  );

  const handleOnlyPackages = () => {
    setIsOnlyPackages(true);
    setIsOnlyProducts(false);
    setFilter((prev) => ({
      ...prev,
      productsChecked: false,
      packagesChecked: true,
    }));
  };

  const handleOnlyProducts = () => {
    setIsOnlyPackages(false);
    setIsOnlyProducts(true);
    setFilter((prev) => ({
      ...prev,
      productsChecked: true,
      packagesChecked: false,
    }));
  };

  const {
    data: productsData,
    fetchNextPage: fetchNextProducts,
    hasNextPage: hasNextProducts,
    isFetchingNextPage: isFetchingNextProducts,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
  } = useInfiniteQuery({
    queryKey: ["shop-products", priceRange, stars, isOnlyPackages],
    queryFn: fetchProducts,
    enabled: !isOnlyPackages,
    getNextPageParam: (lastPage, pages) => {
      const currentPage = lastPage.data.data.options.page;
      const totalPages = Math.ceil(
        lastPage.data.data.options.count / lastPage.data.data.options.limit
      );
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const {
    data: packagesData,
    fetchNextPage: fetchNextPackages,
    hasNextPage: hasNextPackages,
    isFetchingNextPage: isFetchingNextPackages,
    isLoading: isLoadingPackages,
    refetch: refetchPackages,
  } = useInfiniteQuery({
    queryKey: ["packages", priceRange, stars, isOnlyProducts],
    queryFn: fetchPackages,
    enabled: isOnlyPackages || (!isOnlyPackages && !hasNextProducts),
    getNextPageParam: (lastPage, pages) => {
      const currentPage = lastPage.data.data.options.page;
      const totalPages = Math.ceil(
        lastPage.data.data.options.count / lastPage.data.data.options.limit
      );
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Reset exhaustion when filters change
  useEffect(() => {
    setAreProductsExhausted(false);
  }, [priceRange, stars, isOnlyPackages, isOnlyProducts]);

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    refetchProducts();
    refetchPackages();
  };

  const handleStarsChange = (rating: number) => {
    setStars(rating);
    refetchProducts();
    refetchPackages();
  };

  const isLoading =
    isLoadingProducts || (areProductsExhausted && isLoadingPackages);

  const loadMore = () => {
    if (hasNextProducts) {
      fetchNextProducts(); // Load more products if available
    } else if (!hasNextProducts && hasNextPackages) {
      fetchNextPackages(); // Start loading packages if products are exhausted
    }
  };

  const hasMore = hasNextProducts || hasNextPackages;

  return (
    <div className="shop-container  mx-auto w-[95%] md:w-[90%] lg:w-[80%] py-4">
      <div className="shop-header"></div>
      <div className="shop-actions mb-2 w-full flex justify-end gap-4">
        <MobileFilterSection
          filter={filter}
          onlyPackages={handleOnlyPackages}
          onlyProducts={handleOnlyProducts}
          handlePriceFilter={handlePriceRangeChange}
          handleRatingFilter={handleStarsChange}
        />
      </div>
      <div className="shop-content flex w-full flex-1 gap-5 py-3">
        <ProductGrid
          packages={
            isOnlyPackages || areProductsExhausted
              ? packagesData?.pages.flatMap(
                (page) => page.data.data.packages
              ) || []
              : []
          }
          products={
            !isOnlyPackages
              ? productsData?.pages.flatMap(
                (page) => page.data.data.products
              ) || []
              : []
          }
          isLoading={isLoading}
          loadMore={loadMore}
          hasMore={
            hasMore
          }
          isFetchingNext={
            !isOnlyPackages
              ? isFetchingNextProducts
              : isOnlyPackages && isFetchingNextPackages
          }
        />
        <FilterSection
          filter={filter}
          onlyProducts={handleOnlyProducts}
          onlyPackages={handleOnlyPackages}
          handlePriceFilter={handlePriceRangeChange}
          handleRatingFilter={handleStarsChange}
        />
      </div>
    </div>
  );
}

export default Page;