import { WarningOctagon } from "@phosphor-icons/react";
import { Suspense } from "react";
import { Form, Link, useActionData, useNavigation } from "react-router-dom";

function LoginPage() {
  let navigation = useNavigation();
  console.log(navigation.state);

  //  returned from the login action
  const actionData = useActionData();
  console.log(actionData);

  return (
    <Suspense fallback={<div>...Loading</div>}>
      <div className="grid  place-content-center min-h-dvh">
        <div className="p-6 border grid gap-5 bg-white">
          <div className="grid gap-1 py-2 border-b">
            <h1 className="text-lg font-bold"> Sign in </h1>
            <p className=" text-sm text-gray-600"> Enter your credential to sign in.</p>
          </div>

          <Form method="post" action="/login" className="grid gap-2 min-w-[400px]">
            <label className="grid gap-1 font-medium text-sm">
              Email
              <input type="email" className="border p-2" name="email" />
            </label>

            <label className="grid gap-1 font-medium text-sm">
              Password
              <input type="password" className="border p-2" name="password" />
            </label>

            <button className="bg-black text-white p-2 rounded-md mt-2 text-sm">Login</button>
          </Form>

          <div>
            <p className="font-medium text-xs">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-blue-500">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        <div className="h-5">
          {actionData?.error && (
            <div className="bg-red-100 text-red-500 p-2 mt-2 rounded-md text-xs flex gap-1 items-center font-medium">
              <WarningOctagon size={16} className="mx-2" />
              {actionData.error}
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
}

export default LoginPage;
