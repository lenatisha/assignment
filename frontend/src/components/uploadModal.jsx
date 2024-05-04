import { Plus, XCircle } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router-dom";

export function UploadModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open}>
      <Dialog.Trigger
        onClick={() => {
          setOpen(true);
        }}
        className="bg-black text-white p-2 rounded-md text-xs flex gap-1 items-center"
      >
        <Plus />
        Upload
      </Dialog.Trigger>
      <Dialog.Overlay
        className="bg-black/30 z-10  fixed inset-0"
        onClick={() => {
          setOpen(false);
        }}
      />
      <Dialog.Content className="fixed top-[50%] z-20  left-[50%] max-h-[85vh] w-[90vw] max-w-[40%] grid gap-2  translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[25px]  focus:outline-none">
        <UploadImages setOpen={setOpen} />
      </Dialog.Content>
    </Dialog.Root>
  );
}

function UploadImages({ setOpen }) {
  const fetcher = useFetcher();

  useEffect(() => {
    (() => {
      fetcher.state === "loading" && setOpen(false);
    })();
  }, [fetcher.state, setOpen]);

  return (
    <div className="border max-w-screen-md mx-auto p-6 grid gap-2 shadow-lg mt-5 bg-white relative">
      <div className="grid  pb-2 gap-1">
        <h3 className="font-bold">Upload File </h3>
        <span className="text-gray-400 text-xs"> Choose an image from your computer that you wish to upload.</span>{" "}
      </div>

      <fetcher.Form method="post" action="/upload" encType="multipart/form-data" className="grid gap-2 ">
        <input required type="file" name="image" accept="image/*" />

        <button type="submit" className="w-full bg-black text-white p-2 text-[13px]">
          Upload
        </button>
      </fetcher.Form>

      <button
        className="absolute right-0 top-0 "
        aria-label="Close"
        onClick={() => {
          setOpen(false);
        }}
      >
        <XCircle size={24} className="text-white bg-black/60 rounded-full" />
      </button>
    </div>
  );
}
