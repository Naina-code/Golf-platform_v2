export default function AdminCard({ title, value }) {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-gray-400">{title}</h2>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}