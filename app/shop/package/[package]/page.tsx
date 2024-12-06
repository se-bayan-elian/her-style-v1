import React from 'react'
import PackagePage from '../PackagePage'
import axios from 'axios';


const fetchProduct = async (id: string) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://herstyleapi.onrender.com/api/v1'}/packages/${id}`);
    return res.data.data.Package

  } catch (error: any) {
    console.log(error.response)
    return null;
  }
}


export async function generateMetadata({ params }: { params: { package: string } }) {
  const { package: packageId } = params;
  const productData = await fetchProduct(packageId); // Fetch dynamic data
  return {
    title: productData?.name,
    description: productData?.description,
    openGraph: {
      title: productData?.name,
      description: productData?.description,
      images: productData?.images,
      type: 'article',
    },
  };
}

const Page = () => {
  return (
    <PackagePage />
  )
}

export default Page