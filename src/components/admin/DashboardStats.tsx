import { useEffect, useState } from 'react';

interface Stats {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
}

export default function DashboardStats() {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        fetch('https://cms-api-latest-aef6.onrender.com/api/testimonials/stats',{
            method: 'GET',
            credentials: 'include',
            })
        .then((res) => (res.ok ? res.json() : Promise.rejected(res)))
        .then((data: stats) => setStats(data))
        .catch(() => setStats(null));
        }, []);

    if(!stats) return <p>Cargando estadísticas...</p>;

    return (
        <section style = {{display: 'flex', gap: '1rem',marginBottom: '2rem'}}>
            <article style = {{border: '1px solid #ccc', padding: '1rem', borderRadius: 8}
            }>
              <h3>Total</h3>
              <p>{stats.total}</p>
            </article>
            <article style = {{border: '1px solid #ccc', padding: '1rem', borderRadius: 8}
            }>
              <h3>Pendientes</h3>
              <p>{stats.pending}</p>
            </article>
            <article style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: 8 }
            }>
              <h3>Rechazados</h3>
              <p>{stats.rejected}</p>
            </article>
        </section>
        );
    }