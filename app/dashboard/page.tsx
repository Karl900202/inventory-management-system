import Sidebar from "@/component/sidebar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/dashboard" />
      <div className="ml-64 p-6">
        <div></div>
      </div>
    </div>
  );
}
