// app/add-product/loading.tsx

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin h-10 w-10 rounded-full border-4 border-gray-300 border-t-gray-600 mb-4" />
      <p className="text-gray-600">loading page....</p>
    </div>
  );
}
