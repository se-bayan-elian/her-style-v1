import { Button } from "@/components/ui/button";
import React from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

function CartItems({
  id,
  price,
  name,
  quantity,
  onDelete,
  stateOfDeleting,
  type,
  image,
}: {
  id: string;
  price: number;
  name: string;
  quantity: number;
  onDelete: () => void;
  stateOfDeleting: boolean;
  type: string;
  image: string;
}) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  async function updatePackageQuantity(
    id: any,
    type: string,
    newQuantity: number
  ) {
    try {
      const response = await axiosInstance.put(
        `cart/update-${type}/${id._id}`,
        {
          quantity: newQuantity,
        }
      );
      return response.data;
    } catch (error) {}
  }

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      type,
      newQuantity,
    }: {
      id: string;
      type: string;
      newQuantity: number;
    }) => updatePackageQuantity(id, type, newQuantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const arrayOfName = name.split(" ");

  return (
    <div
      className={`grid grid-cols-12 md:gap-4 gap-2 mb-4 w-full   ${
        stateOfDeleting ? "opacity-50" : ""
      }`}
    >
      <p className="col-span-3 text-sm  text-right text-muted-foreground   mb-auto">
        <span className="text-xs">: الإجمالي</span>
        <br />
        <span className="text-nowrap text-xs justify-end flex ">
          <span>ر.س</span>
          <span>{(quantity * price).toFixed(2)}</span>
        </span>
      </p>
      <div className="flex flex-col gap-1 col-span-5 items-end text-right justify-between">
        <h3 className="font-medium">
          {arrayOfName[0] && arrayOfName[0]} {arrayOfName[1] && arrayOfName[1]}
        </h3>
        <p className="text-sm text-muted-foreground flex gap-1/3">
          <span>ر.س</span>
          <span>{price.toFixed(2)}</span>
        </p>
        <div className="flex items-start justify-start space-x-1">
          <div className="flex">
            <Button
              variant="outline"
              size="sm"
              className=" h-6 w-6 rounded-r-none border-r-0"
              onClick={() =>
                updateMutation.mutate({ id, type, newQuantity: quantity - 1 })
              }
              disabled={updateMutation.isPending || quantity <= 1}
            >
              -
            </Button>
            <div className="flex items-center justify-center h-6 w-6 border-y border-input px-2">
              {quantity}
            </div>
            <Button
              variant="outline"
              size="sm"
              className=" h-6 w-6 rounded-l-none border-l-0"
              onClick={() =>
                updateMutation.mutate({ id, type, newQuantity: quantity + 1 })
              }
              disabled={updateMutation.isPending}
            >
              +
            </Button>
          </div>
        </div>
      </div>
      <div className="relative h-[100px] col-span-4">
        <Image
          src={image}
          layout="fill"
          objectFit="cover"
          alt="Product"
          className="rounded"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top- -right-0 h-6 w-6 p-0 bg-purple text-white hover:bg-white hover:border-purple-950 border hover:text-purple"
        >
          <X onClick={onDelete} className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default CartItems;
