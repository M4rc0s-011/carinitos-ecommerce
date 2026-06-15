import { useState, useEffect } from 'react'
import { Package, ShoppingBag, Clock, RefreshCw, Loader2 } from 'lucide-react'
import { getProductosAdmin, getPedidosAdmin } from '../../api/admin'

function StatCard({ icon: Icon, label, value, subtitle, loading }) {
  return (
    <div className="bg-white rounded-2xl border border-[#fbddc3] p-6 flex flex-col gap-4">
      <div className="w-10 h-10 rounded-xl bg-[#fbddc3]/30 flex items-center justify-center">
        <Icon size={18} className="text-[#3d2314]" />
      </div>
      <div>
        <p className="text-xs font-medium text-[#3d2314]/50 mb-1">{label}</p>
        {loading ? (
          <Loader2 size={20} className="animate-spin text-[#3d2314]/30 my-2" />
        ) : (
          <p className="text-5xl font-bold text-[#3d2314] leading-none">{value}</p>
        )}
        {subtitle && !loading && (
          <p className="text-xs text-[#3d2314]/40 mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProductosAdmin(), getPedidosAdmin()])
      .then(([productos, pedidos]) => {
        setStats({
          productosActivos: productos.filter((p) => p.activo).length,
          totalProductos:   productos.length,
          totalPedidos:     pedidos.length,
          pendientes:       pedidos.filter((p) => p.estado === 'pendiente').length,
          enProceso:        pedidos.filter((p) => p.estado === 'en_proceso').length,
          completados:      pedidos.filter((p) => p.estado === 'completado').length,
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    {
      icon:     Package,
      label:    'Productos activos',
      value:    stats?.productosActivos ?? 0,
      subtitle: stats ? `${stats.totalProductos} en total` : null,
    },
    {
      icon:     ShoppingBag,
      label:    'Total pedidos',
      value:    stats?.totalPedidos ?? 0,
      subtitle: stats ? `${stats.completados} completados` : null,
    },
    {
      icon:     Clock,
      label:    'Pedidos pendientes',
      value:    stats?.pendientes ?? 0,
      subtitle: 'Esperando confirmación',
    },
    {
      icon:     RefreshCw,
      label:    'En proceso',
      value:    stats?.enProceso ?? 0,
      subtitle: 'En preparación',
    },
  ]

  return (
    <div>
      <h1 className="font-display text-3xl text-[#3d2314] mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} loading={loading} />
        ))}
      </div>
    </div>
  )
}
