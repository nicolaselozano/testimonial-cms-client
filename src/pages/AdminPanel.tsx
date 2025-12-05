import AdminGuard from "../components/admin/AdminGuard";
import PendingModeration from "../components/admin/PendingModeration";
import DashboardStats from "../components/admin/dashboardStats";

export default function AdminPanel() {
  return (
    <AdminGuard>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
        <DashboardStats />
        <PendingModeration />
      </div>
    </AdminGuard>
  );
}

