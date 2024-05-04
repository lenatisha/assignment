import { WarningOctagon } from "@phosphor-icons/react";
import { Suspense } from "react";
import { Form, Link, useActionData } from "react-router-dom";

function RegisterPage() {
  const actionData = useActionData();

  return (
    <Suspense fallback={<div>...Loading</div>}>
      <div className="grid  place-content-center min-h-dvh">
        <div className="p-6 border grid gap-3 bg-white">
          <div className="grid gap-1 py-2 border-b">
            <h1 className="text-lg font-bold"> Sign up </h1>
            <p className=" text-sm  text-gray-600">Please Fill the following form to register.</p>
          </div>

          <Form method="post" action="/register" className="grid gap-3 min-w-[400px]">
            <label className="grid gap-1 font-medium text-sm">
              Email
              <input type="email" className="border p-2" required name="email" />
            </label>

            <label className="grid gap-1 font-medium text-sm">
              Password
              <input type="password" className="border p-2" name="password" required />
            </label>
            <label className="grid gap-1 font-medium text-sm">
              Confirm Password
              <input type="password" className="border p-2" required name="confirmPassword" />
            </label>

            <button className="bg-black text-white p-2 rounded-md mt-1 text-sm">Register</button>
          </Form>

          <div>
            <p className="font-medium text-xs">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500">
                Login
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

export default RegisterPage;
