export default function LinkTable({ links }) {
  if (!links.length) return <p className="p-4 text-center">No links available</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 mt-6">
      <h2 className="text-3xl font-bold mb-4 text-center">All URLs</h2>
      <table className="w-full border bg-white shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Code</th>
            <th className="p-2">Original URL</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.code} className="border-t">
              <td className="p-2 font-bold text-blue-600">{link.code}</td>
              <td className="p-2 break-all">{link.url}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
