import { Eye, ShareFat } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { useSearchParams } from "react-router-dom";
import { API_URL } from "../utils/auth";
import { ImageViewModal } from "./ImageViewModal";
import { DeleteModal } from "./deleteModal";
import { ShareImage } from "./shareImage";

export function Image(props) {
  const [, setSearchParam] = useSearchParams();

  return (
    <div className="col-span-1 bg-gray-300 relative group overflow-hidden ">
      <div className="absolute inset-0 z-10  place-content-center grid-flow-col gap-4 hidden group-hover:grid hover:grid bg-black/40">
        {/*image view modal  */}
        <Dialog.Root onOpenChange={(open) => !open && setSearchParam("")}>
          <Dialog.Trigger onClick={() => setSearchParam(`imageUrl=${props.image.url}`)}>
            <Eye size={16} className="text-gray-100" />
          </Dialog.Trigger>
          <ImageViewModal />
        </Dialog.Root>

        {/* share image modal */}
        <Dialog.Root onOpenChange={(open) => !open && setSearchParam("")}>
          <Dialog.Trigger asChild onClick={() => setSearchParam(`imageUrl=${props.image.url}`)}>
            <button>
              <ShareFat size={16} className="text-gray-100" />
            </button>
          </Dialog.Trigger>
          <ShareImage />
        </Dialog.Root>

        {/* delete image modal */}
        <DeleteModal image={props.image} />
        {/* <Dialog.Root>
          <Dialog.Trigger
            asChild
            onOpenChange={(open) => !open && setSearchParam("")}
            onClick={() => setSearchParam(`imageUrl=${props.image.url}`)}
          >
            <button>
              <Trash size={16} className="text-gray-100" />
            </button>
          </Dialog.Trigger>
          <DeleteImage />
        </Dialog.Root> */}
      </div>
      <img
        className="w-full z-10 object-cover group-hover:scale-105 transition-transform duration-300"
        src={`${API_URL}${props.image.url}`}
      />
    </div>
  );
}

// function DeleteImage() {
//   const [searchParams] = useSearchParams();
//   const { images } = useRouteLoaderData("images");

//   const currentImg = images.find((img) => img.url === searchParams.get("imageUrl"));
//   console.log(currentImg?.url);
//   return (
//     <div>
//       <Dialog.Portal>
//         <Dialog.Overlay className="bg-black/30 z-10  fixed inset-0" />
//         <Dialog.Content className="fixed z-20 top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[80%] md:max-w-[60%] lg:max-w-[40%]  grid gap-2  translate-x-[-50%] translate-y-[-50%]   focus:outline-none">
//           <div>
//             <div className="bg-white p-6 rounded-md grid gap-2">
//               <div className="pb-2 grid gap-1 border-b">
//                 <span className="items-center block font-semibold">Delete Image</span>
//                 <span className="text-sm block font-normal text-zinc-700">
//                   Are you sure you want to delete this image?
//                 </span>
//               </div>
//               <div className="flex gap-2 items-center justify-end">
//                 <button
//                   className="bg-red-500 text-white px-4 py-2 rounded-md"
//                   onClick={async () => {
//                     fetch(API_URL + currentImg.url, {
//                       method: "DELETE",
//                       credentials: "include",
//                       headers: { "Content-Type": "application/json" },
//                     })
//                       .then(() => {
//                         fetcher.load("images");
//                       })
//                       .catch((e) => console.log(e));
//                   }}
//                 >
//                   Delete
//                 </button>
//                 {/* <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">Cancel</button> */}
//               </div>
//             </div>
//           </div>
//         </Dialog.Content>
//       </Dialog.Portal>
//     </div>
//   );
// }
