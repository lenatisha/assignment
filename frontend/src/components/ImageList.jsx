import { useRouteLoaderData } from "react-router-dom";
import { Image } from "./Image";

export function ImageList() {
  const { images } = useRouteLoaderData("images");

  return (
    <div className="grid grid-cols-[repeat(auto-fill,200px)]  grid-rows-[repeat(auto-fill,200px)] grid-flow-row  gap-4 ">
      {images.map((image, i) => (
        <Image key={i} image={image} />
      ))}
    </div>
  );
}
