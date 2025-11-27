// app/(dashboard)/layout.tsx
import Sidebar from "@/component/sidebar";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <main className="w-full ml-64 p-8">
          {children}
          <Toaster position="bottom-center" />
        </main>
      </div>
    </div>
  );
}
