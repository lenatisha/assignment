import { Image } from "@phosphor-icons/react";
import { Suspense } from "react";
import { Outlet, useFetcher } from "react-router-dom";
import { AuthProvider } from "./utils/auth";

function App() {
  const fetcher = useFetcher();

  return (
    <Suspense fallback={<div>...Loading</div>}>
      <div>
        <nav className="p-5  bg-black text-white sticky inset-0 z-40">
          <div className="container justify-between flex items-center mx-auto">
            <div className="flex items-center gap-2">
              <Image size={16} weight="duotone" />
              <h1 className="uppercase">Image Gallery</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm "> {AuthProvider.isAuthenticated && AuthProvider?.user.email} </span>
              <fetcher.Form method="post" action="/logout">
                <button className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-sm p-2 bg-white text-black">
                  Logout
                </button>
              </fetcher.Form>
            </div>
          </div>
        </nav>

        <div className="container mx-auto">
          <Outlet />
        </div>
      </div>
    </Suspense>
  );
}

export default App;
