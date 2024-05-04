import { Trash, XCircle } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";

import { useRouteLoaderData, useSearchParams } from "react-router-dom";
import { API_URL } from "../utils/auth";

export function ImageViewModal() {
  const [searchParams] = useSearchParams();
  const { images } = useRouteLoaderData("images");

  const currentImg = images.find((img) => img.url === searchParams.get("imageUrl"));
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/30 z-10  fixed inset-0" />
      <Dialog.Content className="fixed z-20 top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[40%] grid gap-2  translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[25px]  focus:outline-none">
        <div className="relative">
          <img
            className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-300"
            src={API_URL + searchParams.get("imageUrl")}
          />
        </div>
        <Dialog.Close asChild>
          <button className="absolute right-0 top-0 " aria-label="Close">
            <XCircle size={24} className="text-white bg-black/60 rounded-full" />
          </button>
        </Dialog.Close>

        <div className="flex justify-between mx-auto gap-4 w-full bg-white p-4">
          <div className="p-2 text-xs ">
            <span className="font-medium font-mono block">Name: {currentImg?.fileName}</span>
            <span className="font-medium font-mono block">Resolution: {currentImg?.resolution}</span>
            <span className="font-medium font-mono block">
              Uploaded at: {new Date(currentImg?.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex gap-2">
            {/* <button>
              <ShareFat size={16} />
            </button> */}
            <button>
              <Trash size={16} />
            </button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
