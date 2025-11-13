import { Button, Checkbox, Label, TextInput } from "flowbite-react";

function LoginPage() {
  return (
    <div className="inset-0 min-h-screen w-full flex items-start justify-center bg-transparent px-4 pt-[20px]">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-md xl:max-w-md">
        {/* Brand/header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-black dark:bg-white flex items-center justify-center shadow-sm">
            <span className="text-white dark:text-black text-xl font-bold">T</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Sign in to Thoughts</h1>
        </div>

        <div
          className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-800 shadow-xl p-6 sm:p-8"
        >
          {/* spotlight overlay follows the mouse using CSS variables --mx and --my */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background:
                "radial-gradient(420px circle at 50% 30%, rgba(255,255,255,0.10), rgba(255,255,255,0.04) 18%, transparent 40%)",
              opacity: 1,
              mixBlendMode: "overlay",
            }}
          />
          <form className="space-y-5 text-left">
            <div>
              <div className="mb-2 block text-left">
                <Label htmlFor="email1" className="text-left font-semibold text-gray-700 dark:text-gray-200">
                  Email address
                </Label>
              </div>
              <TextInput
                id="email1"
                type="email"
                required
                sizing="lg"
                shadow
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 
                           text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300 
                           focus:ring-blue-500/30 focus:border-blue-400/50 transition-colors"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label htmlFor="password1" className="text-gray-700 dark:text-gray-200">
                  Password
                </Label>
                <a href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                  Forgot password?
                </a>
              </div>
              <TextInput
                id="password1"
                type="password"
                required
                sizing="lg"
                shadow
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 
                           text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300 
                           focus:ring-blue-500/30 focus:border-blue-400/50 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-gray-700 dark:text-gray-200">
                Remember me
              </Label>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full !bg-blue-600 !hover:bg-blue-700 !text-white !border-0 focus:!ring-4 !ring-blue-500/30"
            >
              Sign in
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Don’t have an account?{' '}
          <a href="#" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;