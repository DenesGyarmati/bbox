export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-red-500">403</h1>
      <h2 className="text-2xl mt-4">Access Denied</h2>
      <p className="mt-2 text-gray-600">
        You don’t have permission to view this page.
      </p>
    </div>
  );
}
