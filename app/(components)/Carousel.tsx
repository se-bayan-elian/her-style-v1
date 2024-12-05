"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import axiosInstance from "@/utils/axiosInstance";

// Fetch slider data from API
const fetchSliderData = async () => {
  const response = await axiosInstance.get("/sliders");
  return response.data.data;
};

function Carousel() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sliders"],
    queryFn: fetchSliderData,
  });
  const router = useRouter();

  // Handle different integration types and routing
  const handleLinkClick = (link: string, type: string) => {
    if (type === "URL") {
      window.open(link, "_blank");
    } else if (type === "PACKAGE") {
      router.push(`/shop/package/${link}`);
    } else if (type === "PRODUCT") {
      router.push(`/shop/product/${link}`);
    }
  };

  if (isLoading) {
    return (
      <div className="mb-2">
        <Skeleton className="lg:h-[400px] h-[25vh] w-full" />
      </div>
    );
  }

  if (error) {
    throw error;
  }

  return (
    <div className="mb-2">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          enabled: false,
        }}
        modules={[Autoplay, Pagination]}
        className="mySwiper"
      >
        {data?.sliders?.map((slider: any) => (
          <SwiperSlide key={slider._id}>
            <div
              onClick={() =>
                handleLinkClick(slider.link, slider.integration_type)
              }
              className="cursor-pointer"
            >
              <Image
                src={slider.image}
                alt={slider.name}
                width={1200}
                height={400}
                className="w-full rounded-lg lg:h-full h-[25vh] sm:h-60 bg-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Carousel;
