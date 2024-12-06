import React from 'react'
import ProductPage from './components/ProductPage'
import axios from 'axios';


const fetchProduct = async (id: string) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://herstyleapi.onrender.com/api/v1'}/products/${id}`);
    return res.data.data.product

  } catch (error: any) {
    console.log(error.response)
    return null;
  }
}


export async function generateMetadata({ params }: { params: { product: string } }) {
  const { product } = params;
  const productData = await fetchProduct(product); // Fetch dynamic data
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
    <ProductPage />
  )
}

export default Page