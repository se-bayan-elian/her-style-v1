import React from "react";
import Image from "next/image";
import Link from "next/link";
function Footer() {
  return (
    <footer className="bg-purple text-white py-8 text-right  ">
      <div className="container mx-auto w-[95%] md:w-[90%] lg:w-[80%]  grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-12 gap-8">
        <div className="lg:text-right text-center mx-auto md:col-span-6 xl:col-span-1">
          <h3 className="font-bold mb-4">طرق الدفع لدينا</h3>
          <div className="flex lg:justify-end justify-center space-x-2 space-x-reverse">
            <Image
              className="mr-2 hover:opacity-80"
              src="/mada.svg"
              alt="mada"
              width={40}
              height={25}
            />
            <Image
              className="mr-2 hover:opacity-80 rounded"
              src="/bankak.jpg"
              alt="mada"
              width={40}
              height={25}
            />
            <Image
              className="hover:opacity-80"
              src="/visa.svg"
              alt="Visa"
              width={40}
              height={25}
            />
          </div>

          <h3 className="font-bold mt-4 mb-2">التواصل الاجتماعي</h3>
          <div className="flex lg:justify-end justify-center space-x-2 space-x-reverse">
            <Link
              href="https://www.facebook.com/noon.mohanad2018?mibextid=ZbWKwL"
              className="mr-2 hover:text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.675 0H1.325C.595 0 0 .595 0 1.325v21.35C0 23.405.595 24 1.325 24h11.495v-9.294h-3.123v-3.622h3.123v-2.669c0-3.091 1.828-4.782 4.58-4.782 1.329 0 2.727.098 3.055.142v3.45h-2.05c-1.605 0-2.077.759-2.077 1.951v2.611h4.146l-.543 3.622h-3.603v9.294h7.073c.73 0 1.325-.595 1.325-1.325V1.325C24 .595 23.405 0 22.675 0z" />
              </svg>
            </Link>
            <Link
              href="https://vm.tiktok.com/ZMhnyKkJa/"
              className="hover:text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </Link>
            <Link
              href="https://www.instagram.com/hawa.ak1?igsh=cG9ldWZrYnJ5bHcw"
              className="hover:text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </Link>
          </div>

          <h3 className="font-bold mt-4 mb-2">عنواننا</h3>
          <p className="text-sm">جمهورية السودان - الخرطوم - جبرة</p>

          {/* <div className="flex items-center justify-center lg:justify-end mt-4">
            <p>الرقم الضريبي : 0</p>
            <Image
              className="ml-2"
              width={30}
              height={30}
              src="/rkm.png"
              alt="rkm"
            />
          </div> */}
          <h3 className="font-bold mt-4 mb-2">الإيميل</h3>
          <p className="mt-2">omniamahmmed199@gmail.com</p>
        </div>
        <div className="text-center lg:text-right mx-auto xl:col-span-1 md:col-span-6 order-last  mt-4 ">
          <ul className="space-y-5 mb-5">
            <li>
              <Link href="/">الرئيسية</Link>
            </li>
            <li>
              <Link href="/shop">جميع المنتجات</Link>
            </li>
            <li>
              <Link href="/service">سياسة الاستخدام</Link>
            </li>
            <li>
              <Link href="/about">من نحن</Link>
            </li>
          </ul>
          <div className="text-center flex items-center justify-center">
            <Link
              href="https://rab-t.com/"
              className="text-right flex items-center flex-col"
            >
              <p className="text-right mb-2">
                جميع الحقوق محفوظة لدى &copy; {" " + new Date().getFullYear()}
              </p>{" "}
              {/* <span className="">لدى</span>{" "} */}
              <Image
                src="/company.png"
                className="mr-3"
                alt="company logo"
                height={180}
                width={180}
              />
            </Link>
          </div>
        </div>
        <div className="flex flex-col md:col-span-12 xl:col-span-1 xl:order-last order-first  lg:items-end items-center col-span-1 ">
          <Image
            src="/whiteLogo.png"
            alt="Herstyle"
            width={130}
            height={100}
            objectFit="cover"
            className="mb-3 mx-auto "
          />
          <p dir="rtl" className="xl:text-justify text-center w-full ">
            هي منصة المنتجات والعطور السودانية وهي وجهة مميزة تهدف إلى تسليط
            الضوء على المنتجات المحلية والعطور التقليدية التي تتميز بها السودان.
            تبرز هذه المنصة الحرف اليدوية والفنون التقليدية، كما تسعى لدعم
            الحرفيين المحليين وتمكينهم من الوصول إلى أسواق أوسع ، وتهدف المنصة
            أيضًا إلى تعزيز الوعي بالثقافة السودانية وتراثها .
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
