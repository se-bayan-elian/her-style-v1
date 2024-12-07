import React from "react";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Autoplay, Pagination } from "swiper/modules";
import useAxiosInstance from "@/utils/axiosInstance";



function Testmonial() {
  const axiosInstance = useAxiosInstance()
  async function getTestmonials() {
    const response = await axiosInstance.get("/comments");
    return response.data;
  }
  const { data, isLoading, error } = useQuery({
    queryKey: ["testmonials"],
    queryFn: getTestmonials,
  });

  // Skeleton Loader
  if (isLoading) {
    return (
      <div className="w-full py-5 mb-5">
        <div className="w-full p-4 h-[230px] bg-gray-200 animate-pulse rounded-lg shadow-md">
          <div className="flex flex-col justify-center items-center h-full space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-300"></div>
            <div className="w-20 h-4 bg-gray-300 rounded"></div>
            <div className="w-48 h-6 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error handling
  if (error)
    return (
      <div className="text-center text-red-600">Error: {error.message}</div>
    );

  return (
    <Swiper
      slidesPerView={1} // Default for mobile
      spaceBetween={20}
      pagination={{ enabled: false }} // Pagination is disabled by removing this line
      autoplay={{
        delay: 1500, // Delay in ms for auto sliding
        disableOnInteraction: false, // Keeps autoplay running after interaction
        reverseDirection: true,
        pauseOnMouseEnter: true,
      }}
      breakpoints={{
        640: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
      }}
      modules={[Autoplay, Pagination]} // Use correct modules
      className="mySwiper w-full py-5 mb-5"
    >
      {data &&
        data.data.comments.slice(0, 5).map((comment: any, index: number) => (
          <SwiperSlide
            key={index}
            className="shadow-lg rounded-lg bg-white p-6 flex flex-col justify-between items-center space-y-4 !h-[240px]"
          >
            <div className="flex flex-col justify-center items-center space-y-4">
              <Image
                className="mx-auto rounded-full"
                width={70}
                height={70}
                alt="user_avatar"
                src={"/avatar-purple.png"}
              />
              <div className="flex gap-1 justify-center items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < comment.stars
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                      }`}
                  />
                ))}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {comment.userId?.name}
              </h3>
              <p className="text-sm text-gray-600 text-ellipsis line-clamp-2 text-center">
                {comment.content}
              </p>
            </div>
          </SwiperSlide>
        ))}
    </Swiper>
  );
}

export default Testmonial;
