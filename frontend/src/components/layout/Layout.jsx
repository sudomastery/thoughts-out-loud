import { Sidebar } from "./Sidebar";

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 max-w-2xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Thoughts Out Loud</h1>
          {children}
        </main>
      </div>
    </div>
  );
}
