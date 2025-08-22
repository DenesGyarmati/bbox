export default function LogoutButton() {
  return (
    <form action="/api/logout" method="post">
      <button
        type="submit"
        className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-900 transition cursor-pointer"
      >
        Logout
      </button>
    </form>
  );
}
