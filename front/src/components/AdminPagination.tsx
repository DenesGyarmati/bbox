import Link from "next/link";

interface AdminPaginationProps {
  page: number;
  totalPages: number;
}

export default function AdminPagination({
  page,
  totalPages,
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex justify-center items-center gap-4">
      {page > 1 && (
        <Link
          href={`?page=${page - 1}`}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 cursor-pointer text-gray-900"
        >
          Previous
        </Link>
      )}
      <span className="text-gray-200">
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <Link
          href={`?page=${page + 1}`}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 cursor-pointer text-gray-900"
        >
          Next
        </Link>
      )}
    </div>
  );
}
