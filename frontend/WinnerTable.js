export default function WinnerTable({ winners }) {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl">
      <h2 className="text-xl mb-4">Winners</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400">
            <th>User ID</th>
            <th>Match</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {winners.map((w, i) => (
            <tr key={i} className="border-t border-gray-700">
              <td>{w.user_id}</td>
              <td>{w.match_count}</td>
              <td>{w.payment_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}