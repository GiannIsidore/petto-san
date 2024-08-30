import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PawPrintIcon, HomeIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center">
        <PawPrintIcon className="mx-auto h-24 w-24 text-gray-400 mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          404 - Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! Looks like this page has run away.
        </p>
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Button asChild>
            <Link href="/dashboard" className="inline-flex items-center">
              <HomeIcon className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/pets" className="inline-flex items-center">
              <PawPrintIcon className="mr-2 h-4 w-4" />
              View Pets
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-12 text-center">
        <p className="text-gray-500">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
}
