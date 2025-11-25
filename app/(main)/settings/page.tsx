import { getCurrentUser } from "@/lib/auth";
import { AccountSettings } from "@stackframe/stack";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>
      <p className="text-sm text-gray-500">
        Manage your account settings and preferences.
      </p>
      <div className="max-w-6xl mt-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <AccountSettings fullPage />
        </div>
      </div>
    </div>
  );
}
