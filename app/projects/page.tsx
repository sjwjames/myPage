import Link from "next/link";
import { ChatBubbleLeftRightIcon, MegaphoneIcon, BuildingLibraryIcon } from "@heroicons/react/24/outline";

export default function ProjectsPage() {
  return (
    <div className="space-y-12">
      <header className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">Projects</h1>
        <p className="text-xl text-gray-600">Showcasing my current and past works.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Chatbot Project Card */}
        <Link href="/projects/chatbot" className="group block">
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200 bg-white h-full flex flex-col">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ChatBubbleLeftRightIcon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Chatbot Assistant</h2>
            </div>
            <p className="text-gray-600 mb-4 flex-grow">
              An interactive chatbot dialogue interface powered by a custom external backend service.
            </p>
            <div className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform flex items-center">
              Try it out 
              <span className="ml-1">→</span>
            </div>
          </div>
        </Link>

        <Link href="/projects/ads-platform" className="group block">
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-emerald-200 bg-white h-full flex flex-col">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <MegaphoneIcon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Ads AI Platform</h2>
            </div>
            <p className="text-gray-600 mb-4 flex-grow">
              A production-inspired text advertising marketplace with advertiser and platform operations views.
            </p>
            <div className="text-emerald-700 font-medium group-hover:translate-x-1 transition-transform flex items-center">
              Explore the platform
              <span className="ml-1">→</span>
            </div>
          </div>
        </Link>

        <Link href="/projects/luoyang/index.html#/map" target="_blank" rel="noopener noreferrer" prefetch={false} className="group block">
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-amber-200 bg-white h-full flex flex-col">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-amber-50 text-amber-800 rounded-lg group-hover:bg-amber-800 group-hover:text-white transition-colors">
                <BuildingLibraryIcon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Luoyang Chronicle</h2>
            </div>
            <p className="text-gray-600 mb-4 flex-grow">
              Explore Northern Wei Luoyang through an interactive ink-wash city map, layered temple scenes, and poetry from the Luoyang Qielan Ji.
            </p>
            <div className="text-amber-800 font-medium group-hover:translate-x-1 transition-transform flex items-center">
              Enter the ancient city
              <span className="ml-1">→</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
