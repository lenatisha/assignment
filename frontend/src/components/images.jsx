import { Upload, X } from "@phosphor-icons/react";
import React from "react";

function ImagesPage() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className=" container mx-auto">
      <button
        onClick={() => {
          setOpen(true);
        }}
      >
        Add image
      </button>
      <dialog open={open} className="backdrop:bg-black">
        <UploadImages />
      </dialog>
    </div>
  );
}

export default ImagesPage;

function UploadImages({ person }) {
  const [images, setImages] = React.useState([]);
  console.log(person);
  return (
    <div className="border max-w-screen-md mx-auto p-6 grid gap-5 shadow-stone-200 mt-5">
      <div className="grid gap-1 border-b pb-3">
        <h3 className="text- font-bold">Upload Your Images</h3>
        <span className="text-stone-700 text-sm">
          {" "}
          Choose an image from your computer that you wish to upload.
        </span>{" "}
      </div>
      <div className="grid gap-4">
        <span className="font-bold">Upload</span>

        <label
          className="p-10 pt-4 border-dashed grid items-center w-full border min-h-[140px]"
          onDrop={(e) => {
            e.preventDefault();
            console.log(e.dataTransfer.files);
            setImages((prev) => [...prev, ...e.dataTransfer.files]);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            console.log(e.target.files);
          }}
        >
          <div className="grid justify-center items-center text-center">
            <Upload color="#0f0f0f" weight="duotone" size={32} className="mx-auto" />
            Click or drag and drop to upload your file
            <span className="text-gray-400 text-xs"> PNG. JPG, POE, GIF, SVG (Max 5Mb)</span>
          </div>
          <input
            className="hidden"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setImages((prev) => [...prev, file]);
            }}
          />
        </label>
      </div>
      <div className="grid gap-2">
        <span className="font-bold">Selected Images</span>
        <div className="flex flex-wrap   gap-2">
          {!!images.length &&
            images.map((image, index) => (
              <div key={index} className="relative">
                <img src={URL.createObjectURL(image)} alt="image" className="size-52 object-cover peer" />
                <button
                  onClick={() => {
                    setImages((prev) => prev.filter((_, i) => i !== index));
                  }}
                  className="hidden peer-hover:grid hover:grid  place-content-center  absolute top-2 right-2 bg-stone-300/50  size-10 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
