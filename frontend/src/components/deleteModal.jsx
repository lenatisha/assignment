import { Trash } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useFetcher, useRouteLoaderData, useSearchParams } from "react-router-dom";

export function DeleteModal({ image }) {
  const [open, setOpen] = useState(false);
  console.log(image);
  return (
    <Dialog.Root open={open}>
      <Dialog.Trigger
        asChild
        onClick={() => {
          setOpen(true);
        }}
      >
        <button className=" text-white p-2 rounded-md text-xs flex gap-1 items-center">
          <Trash size={16} className="text-gray-100" />
        </button>
      </Dialog.Trigger>
      <Dialog.Overlay className="bg-black/30 z-10 fixed inset-0" onClick={() => setOpen(false)} />
      <Dialog.Content className="fixed top-[50%] z-20  left-[50%] max-h-[85vh] w-[90vw] max-w-[40%] grid gap-2  translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[25px]  focus:outline-none">
        <DeleteImage setOpen={setOpen} imageUrl={image.url} />
      </Dialog.Content>
    </Dialog.Root>
  );
}

function DeleteImage({ setOpen, imageUrl }) {
  const [searchParams] = useSearchParams();
  const { images } = useRouteLoaderData("images");
  const fetcher = useFetcher();

  const currentImg = images.find((img) => img.url === searchParams.get("imageUrl"));
  console.log(currentImg);
  useEffect(() => {
    (() => {
      fetcher.state === "loading" && setOpen(false);
    })();
  }, [fetcher.state, setOpen]);
  return (
    <div className="bg-white p-6 rounded-md grid gap-2">
      <div className="pb-2 grid gap-1 border-b">
        <span className="items-center block font-semibold">Delete Image</span>
        <span className="text-sm block font-normal text-zinc-700">Are you sure you want to delete this image?</span>
      </div>
      <div className="flex items-end gap-2 w-full ">
        <fetcher.Form method="post" action={`/delete`} className="inline">
          <input type="hidden" name="imageUrl" value={imageUrl} />
          <button className="bg-red-500 text-white px-4 py-2 rounded-md" type="submit">
            Delete
          </button>
        </fetcher.Form>
        <Dialog.DialogClose asChild>
          <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md" onClick={() => setOpen(false)}>
            Cancel
          </button>
        </Dialog.DialogClose>
      </div>
    </div>
  );
}
