"use client";
import Image from "next/image";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import Carousel from "./(components)/Carousel";
import { useQuery } from "@tanstack/react-query";
import Product from "./(components)/Product";
import axiosInstance from "@/utils/axiosInstance";
import ProductSkelton from "./(components)/ProductSkelton";
import Testmonial from "./(components)/Testmonial";
import { openLogin } from "@/utils/loginSlice";
import { useDispatch } from "react-redux";
import useAxiosInstance from "@/utils/axiosInstance";

export default function Home() {
  const dispatch = useDispatch();
  const axiosInstance = useAxiosInstance()
  async function getProducts() {
    const { data: products } = await axiosInstance.get("products?tags=green");
    const { data: packages } = await axiosInstance.get("packages?tags=green");
    return {
      products: products.data.products,
      packages: packages.data.packages,
    };
  }

  // New function to get packages
  async function getPackages() {
    const { data: products } = await axiosInstance.get("products?tags=blue");
    const { data: packages } = await axiosInstance.get("packages?tags=blue");

    return {
      products: products.data.products,
      packages: packages.data.packages,
    };
  }

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["home-products"],
    queryFn: getProducts,
  });

  // New query for packages
  const {
    data: packagesData,
    isLoading: packagesLoading,
    error: packagesError,
  } = useQuery({
    queryKey: ["home-packages"],
    queryFn: getPackages,
  });

  return (
    <main className="container mx-auto pt-3 w-[95%] md:w-[90%] lg:w-[80%] ">
      {/* Hero Banner */}
      <Carousel />
      {/* Promotion Banner */}
      <div className="bg-purple py-4  px-0 backgroundFlag rounded-lg mb-8 flex justify-between items-center relative">
        <Image
          className="h-full w-full absolute z-0 rounded-lg"
          alt="sudan flag"
          src="/flagBackground.jpg"
          height={100}
          width={100}
        />
        <button
          dir="rtl"
          className=" lg:left-80 md:left-60  sm:left-[25%] left-[20%] relative z-10 text-gray-700 font-bold  py-2 flex-col"
        >
          <p className="flex items-center">
            عملاء .{" "}
            <Image src="/bankak.jpg" alt="bankak" height={45} width={45} />{" "}
          </p>
          <p className="text-xs">أطلب طلبك ورسل الإيصال... </p>
        </button>

        <div className=" items-center absolute right-0 flex">
          <Image
            src="/products.png"
            alt="Products"
            width={120}
            height={80}
            className="object-cover w-[100px] md:w-[120x]"
          />
        </div>
      </div>

      {/* Featupurple Products */}
      <section className="mb-12 flex flex-col items-center">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold  text-purple">
            قسم المنتجات الغذائية
          </h2>
          <h2 className="text-lg  mb-4 text-black"> تعكس غنى وثقافة السودان</h2>
        </div>
        <div
          style={{ direction: "rtl" }}
          className="grid grid-cols-1 w-full sm:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {[...Array(4)].map((_, index) => (
            <ProductSkelton key={index} isLoading={productsLoading} />
          ))}

          {productsData &&
            productsData?.packages.map((product: any, i: number) => (
              <Product
                id={`/package/${product._id}`}
                key={product._id}
                image={product.images[0]}
                title={product.name}
                rating={product.rating}
                reviewCount={product.numReviews}
                price={product.price.finalPrice}
                originalPrice={product.price.originalPrice}
                discount={product.price.discount}
                className="w-full"
              />
            ))}

          {productsData &&
            productsData?.products.map((product: any, i: number) => (
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
                className="w-full"
              />
            ))}
          {/* ... Repeat for other products */}
        </div>
      </section>

      {/* Suggested Products Section */}
      <section className="mb-5 flex flex-col items-center py-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-purple">
            قسم الكريمات والأرياح السودانية الاصيلة
          </h3>
          <h2 className="text-lg mb-4  text-black">
            كريمات وعطور فاخرة من مكونات طبيعية، تعكس عبق التراث السوداني
          </h2>
        </div>
        <div
          style={{ direction: "rtl" }}
          className="grid  w-full grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {/* Repeat this product card 4 times */}

          {/* Repeat this product card 4 times */}
          {[...Array(4)].map((_, index) => (
            <ProductSkelton key={index} isLoading={packagesLoading} />
          ))}

          {packagesData &&
            packagesData.packages.map((packageItem: any, i: number) => (
              <Product
                id={`/package/${packageItem._id}`} // Adjusted to use package ID
                key={packageItem._id}
                image={packageItem.images[0]} // Adjusted to use package image
                title={packageItem.name}
                rating={packageItem.stars}
                reviewCount={packageItem.numReviews}
                price={packageItem.price.finalPrice}
                originalPrice={packageItem.price.originalPrice}
                discount={packageItem.price.discount}
                className="w-full"
              />
            ))}

          {packagesData &&
            packagesData.products.map((packageItem: any, i: number) => (
              <Product
                id={`/product/${packageItem._id}`} // Adjusted to use package ID
                key={packageItem._id}
                image={packageItem.images[0]} // Adjusted to use package image
                title={packageItem.name}
                rating={packageItem.stars}
                reviewCount={packageItem.numReviews}
                price={packageItem.price.finalPrice}
                originalPrice={packageItem.price.originalPrice}
                discount={packageItem.price.discount}
                className="w-full"
              />
            ))}

          {/* ... Repeat for other products */}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="mb-5 ">
        <div className="relative rounded-lg overflow-hidden">
          <Image
            src="/sudanImage.png"
            alt="Newsletter Background"
            width={1200}
            height={300}
            className="w-full object-cover h-64"
          />
          <div className="absolute inset-0 z-[50] flex flex-col justify-between  items-center p-2 py-3 text-white">
            <h2 className="lg:text-xl text-center font-bold mb-4  text-white ">
              في كل زاوية من بلادي، حكاية تُروى، منتجاتنا أصالة، في كل قلب تُشوى
            </h2>

            <div className="flex flex-col items-center justify-between ">
              <p className=" text-nowrap text-center w-fit mb-3 py-2 bg-purple  text-white  px-6 rounded ">
                إحساس + طعم سوداني
              </p>
              <p
                className=" text-white   underline transition duration-300 hover:cursor-pointer"
                onClick={() => dispatch(openLogin(true))}
              >
                سجل دخولك هنا
              </p>
            </div>
          </div>
          <div className="absolute inset-0 bg-purple bg-opacity-50"></div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="flex flex-col items-center">
        <div className="text-center mb-3 ">
          <h2 className="text-xl font-bold mb-2 text-purple">
            ماذا قالوا عنا ؟
          </h2>
          <h2 className="text-lg mb-4  text-black">
            يمتاز متجرنا بالتقييم الإيجابي من قبل العملاء
          </h2>
        </div>
        <Testmonial />
      </section>
    </main>
  );
}
