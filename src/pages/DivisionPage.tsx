import React from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageNav from "../components/PageNav";
import { getDivisions } from "../services/api";

function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const DivisionPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [divisions, setDivisions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [pagination, setPagination] = React.useState<any>(null);

  const page = Number(searchParams.get("page") || 1);
  const name = searchParams.get("name") || "";
  const debouncedName = useDebounce(name, 400);

  React.useEffect(() => {
    const fetchDivisions = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getDivisions({ page, name: debouncedName });
        setDivisions(res.data.data.divisions || []);
        setPagination(res.data.pagination);
      } catch {
        setError("Gagal mengambil data division");
      } finally {
        setLoading(false);
      }
    };
    fetchDivisions();
  }, [page, debouncedName]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ name: e.target.value, page: "1" });
  };

  const goToPage = (newPage: number) => {
    setSearchParams({ name, page: String(newPage) });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto py-8 px-4">
        <PageNav />
        <h2 className="text-2xl font-bold mb-4">Divisions</h2>
        <div className="mb-4 flex gap-2">
          <input type="text" name="name" placeholder="Cari nama division..." value={name} onChange={handleSearch} className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring" />
        </div>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="bg-white rounded shadow p-4">
            {divisions.length === 0 ? (
              <div className="text-center text-gray-500">Tidak ada data division</div>
            ) : (
              <ul>
                {divisions.map((div: any, idx: number) => (
                  <li key={div.id || idx} className="py-2 border-b last:border-b-0">
                    {div.name || div}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {pagination && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button className="px-3 py-1 rounded border disabled:opacity-50" onClick={() => goToPage(page - 1)} disabled={page <= 1}>
              Prev
            </button>
            <span>
              Page {pagination.current_page} of {pagination.last_page}
            </span>
            <button className="px-3 py-1 rounded border disabled:opacity-50" onClick={() => goToPage(page + 1)} disabled={page >= Number(pagination.last_page)}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DivisionPage;
