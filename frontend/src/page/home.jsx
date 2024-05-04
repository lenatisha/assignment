import { ImageList } from "../components/ImageList";
import { UploadModal } from "../components/uploadModal";

function HomePage() {
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="flex p-4 justify-between">
          <h2 className="font-bold">Your Images</h2>

          <div className="flex items-center gap-3">
            <UploadModal />
          </div>
        </div>

        <ImageList />
      </div>
    </div>
  );
}

export default HomePage;
