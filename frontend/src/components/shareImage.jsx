import { Copy, Globe } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { useMemo } from "react";
import { useRouteLoaderData, useSearchParams } from "react-router-dom";
import { API_URL } from "../utils/auth";

export function ShareImage() {
  const [searchParams] = useSearchParams();
  const { images } = useRouteLoaderData("images");

  const currentImg = useMemo(
    () => images.find((img) => img.url === searchParams.get("imageUrl")),
    [searchParams, images]
  );

  if (!currentImg) return null;

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/30 z-10  fixed inset-0" />
      <Dialog.Content className="fixed z-20 top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[80%] lg:max-w-[45%]  grid gap-2  translate-x-[-50%] translate-y-[-50%]   focus:outline-none">
        <div className="bg-white p-6 rounded-md grid gap-2">
          <div className="pb-2 grid gap-1 border-b">
            <span className="items-center block font-semibold">Share Image</span>
            <span className="text-sm block font-normal text-zinc-700">
              By using the link below you can share this image with anyone
            </span>
          </div>
          <div className="flex gap-2 items-center justify-between">
            <div className="flex gap-4 items-center">
              <span className="inline-block p-2 rounded-md h-fit bg-zinc-200">
                <Globe className="text-zinc-900" size={20} />
              </span>
              <p className="space-y-0.5">
                <span className="font-semibold text-[14px]">Public Access</span>
                <span className="block text-[13px] text-zinc-700">Anyone with the link can view this image</span>
              </p>
            </div>

            <input
              className={"size-4 accent-black rounded-full"}
              type="checkbox"
              defaultChecked={currentImg?.public}
              onChange={async (e) => {
                await fetch(API_URL + currentImg.url, {
                  method: "PATCH",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: currentImg.id,
                    isPublic: e.target.checked,
                  }),
                });

                // fetcher.load("images");
              }}
            />
          </div>

          <span className="relative block">
            <input
              disabled={!currentImg?.isPublic}
              type="text"
              value={API_URL + currentImg?.url}
              className={"w-full p-2 disabled:text-gray-400 border border-gray-20 "}
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(API_URL + currentImg?.url);
              }}
              className="absolute right-0 top-0 h-full bg-black/10 hover:bg-black/20"
            >
              <Copy size={14} className="absolute right-4 top-1/3" />
            </button>
          </span>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
