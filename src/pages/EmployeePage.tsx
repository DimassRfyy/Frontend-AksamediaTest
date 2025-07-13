import React from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageNav from "../components/PageNav";
import { getEmployees, getDivisions, createEmployee, updateEmployee, deleteEmployee } from "../services/api";

function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

interface Employee {
  id: number;
  image: string;
  name: string;
  phone: string;
  division: { id: string; name: string };
  position: string;
}

const EmployeePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [divisions, setDivisions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [pagination, setPagination] = React.useState<any>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editData, setEditData] = React.useState<Employee | null>(null);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [form, setForm] = React.useState({
    image: "",
    name: "",
    phone: "",
    division_id: "",
    position: "",
  });

  const page = Number(searchParams.get("page") || 1);
  const name = searchParams.get("name") || "";
  const division_id = searchParams.get("division_id") || "";
  const debouncedName = useDebounce(name, 400);
  const debouncedDivisionId = useDebounce(division_id, 400);

  React.useEffect(() => {
    getDivisions().then((res) => {
      setDivisions(res.data.data.divisions || []);
    });
  }, []);

  React.useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getEmployees({ page, name: debouncedName, division_id: debouncedDivisionId });
        setEmployees(res.data.data.employees || []);
        setPagination(res.data.pagination);
      } catch {
        setError("Gagal mengambil data employee");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [page, debouncedName, debouncedDivisionId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ name: e.target.value, division_id, page: "1" });
  };
  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams({ name, division_id: e.target.value, page: "1" });
  };

  const goToPage = (newPage: number) => {
    setSearchParams({ name, division_id, page: String(newPage) });
  };

  const openModal = (emp?: Employee) => {
    if (emp) {
      setEditData(emp);
      setForm({
        image: emp.image,
        name: emp.name,
        phone: emp.phone,
        division_id: emp.division.id,
        position: emp.position,
      });
    } else {
      setEditData(null);
      setForm({ image: "https://randomuser.me/api/portraits/men/1.jpg", name: "", phone: "", division_id: "", position: "" });
    }
    setModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editData) {
        await updateEmployee(editData.id, form);
      } else {
        await createEmployee(form);
      }
      setModalOpen(false);
      setEditData(null);
      setForm({ image: "", name: "", phone: "", division_id: "", position: "" });

      const res = await getEmployees({ page, name, division_id });
      setEmployees(res.data.data.employees || []);
      setPagination(res.data.pagination);
    } catch {
      alert("Gagal menyimpan data");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteEmployee(deleteId);
      setDeleteId(null);

      const res = await getEmployees({ page, name, division_id });
      setEmployees(res.data.data.employees || []);
      setPagination(res.data.pagination);
    } catch {
      alert("Gagal menghapus data");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto py-8 px-4">
        <PageNav />
        <h2 className="text-2xl font-bold mb-4">Employees</h2>
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <input type="text" name="name" placeholder="Cari nama employee..." value={name} onChange={handleNameChange} className="px-3 py-2 border rounded focus:outline-none focus:ring" />
          <select name="division_id" value={division_id} onChange={handleDivisionChange} className="px-3 py-2 border rounded focus:outline-none focus:ring">
            <option value="">Semua Divisi</option>
            {divisions.map((div: any) => (
              <option key={div.id || div} value={div.id || div}>
                {div.name || div}
              </option>
            ))}
          </select>
          <button type="button" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-auto" onClick={() => openModal()}>
            Tambah
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="bg-white rounded shadow p-4 overflow-x-auto">
            {employees.length === 0 ? (
              <div className="text-center text-gray-500">Tidak ada data employee</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-3 text-left">#</th>
                    <th className="py-2 px-3 text-left">Foto</th>
                    <th className="py-2 px-3 text-left">Nama</th>
                    <th className="py-2 px-3 text-left">Telepon</th>
                    <th className="py-2 px-3 text-left">Divisi</th>
                    <th className="py-2 px-3 text-left">Posisi</th>
                    <th className="py-2 px-3 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, idx) => (
                    <tr key={emp.id} className="border-b last:border-b-0">
                      <td className="py-2 px-3">{(pagination?.from ? Number(pagination.from) : 0) + idx}</td>
                      <td className="py-2 px-3">
                        <img src={emp.image} alt={emp.name} className="w-10 h-10 object-cover rounded" />
                      </td>
                      <td className="py-2 px-3">{emp.name}</td>
                      <td className="py-2 px-3">{emp.phone}</td>
                      <td className="py-2 px-3">{emp.division?.name}</td>
                      <td className="py-2 px-3">{emp.position}</td>
                      <td className="py-2 px-3 flex gap-2">
                        <button className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500" onClick={() => openModal(emp)}>
                          Edit
                        </button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" onClick={() => setDeleteId(emp.id)}>
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30">
            <div className="bg-white rounded shadow p-6 w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => setModalOpen(false)}>
                &times;
              </button>
              <h3 className="text-xl font-bold mb-4">{editData ? "Edit" : "Tambah"} Employee</h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex flex-col items-center mb-2">
                  <img src={form.image} alt="Preview" className="w-20 h-20 rounded-full object-cover border mb-2" />
                  <label className="block mb-1 font-medium">URL Foto</label>
                  <input type="text" name="image" placeholder="URL Foto" value={form.image} onChange={handleFormChange} className="w-full px-3 py-2 border rounded" required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Nama</label>
                  <input type="text" name="name" placeholder="Nama" value={form.name} onChange={handleFormChange} className="w-full px-3 py-2 border rounded" required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Telepon</label>
                  <input type="text" name="phone" placeholder="Telepon" value={form.phone} onChange={handleFormChange} className="w-full px-3 py-2 border rounded" required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Divisi</label>
                  <select name="division_id" value={form.division_id} onChange={handleFormChange} className="w-full px-3 py-2 border rounded" required>
                    <option value="">Pilih Divisi</option>
                    {divisions.map((div: any) => (
                      <option key={div.id || div} value={div.id || div}>
                        {div.name || div}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Posisi</label>
                  <input type="text" name="position" placeholder="Posisi" value={form.position} onChange={handleFormChange} className="w-full px-3 py-2 border rounded" required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  Simpan
                </button>
              </form>
            </div>
          </div>
        )}
        {deleteId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30">
            <div className="bg-white rounded shadow p-6 w-full max-w-sm text-center">
              <h3 className="text-lg font-bold mb-4">Yakin hapus employee ini?</h3>
              <div className="flex justify-center gap-4">
                <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setDeleteId(null)}>
                  Batal
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" onClick={handleDelete}>
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeePage;
