import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";

function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Alert className="mt-5" color="failure" icon={HiInformationCircle}>
        <span className="font-medium">Info alert!</span> The page you are looking for does not exist
      </Alert>

      <div className="flex-1 flex items-center justify-center px-4">
        <h1
          className="leading-none font-extrabold text-center text-gray-900 dark:text-gray-100 select-none"
          style={{ fontSize: '350px' }}
        >
          404
        </h1>
      </div>
    </div>
  );
}

export default PageNotFound;
