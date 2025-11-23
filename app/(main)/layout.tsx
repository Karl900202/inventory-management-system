// app/(dashboard)/layout.tsx
import Sidebar from "@/component/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <main className="w-full ml-64 p-8">{children}</main>
      </div>
    </div>
  );
}
