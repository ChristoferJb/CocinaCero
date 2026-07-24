import React from 'react';
import { ConsumptionLog } from '../models/types';
import { Clock, DollarSign, CheckCircle2, Trash2, TrendingUp, History } from 'lucide-react';

interface HistoryViewProps {
  logs: ConsumptionLog[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ logs }) => {
  // Compute metrics
  const totalLogs = logs.length;
  const consumedLogs = logs.filter(l => l.action === 'CONSUMED');
  const discardedLogs = logs.filter(l => l.action === 'DISCARDED');
  
  const efficiencyRate = totalLogs > 0 ? Math.round((consumedLogs.length / totalLogs) * 100) : 100;

  const totalMoneySaved = consumedLogs.reduce((acc, log) => acc + (log.estimatedMonetaryValue || 0), 0);
  const totalMoneyLost = discardedLogs.reduce((acc, log) => acc + (log.estimatedMonetaryValue || 0), 0);

  const getReasonLabel = (reason?: string) => {
    switch (reason) {
      case 'EATEN_IN_RECIPE':
        return 'Cocinado en receta';
      case 'EATEN_AS_SNACK':
        return 'Consumido directamente';
      case 'EXPIRED_SPOILED':
        return 'Venció y se dañó';
      default:
        return 'Otro motivo';
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <History size={28} color="var(--accent-emerald)" />
          <span>Historial de Consumo & Auditoría de Impacto</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Monitorea tu tasa de aprovechamiento en el hogar y el valor monetario de tu eficiencia alimentaria.
        </p>
      </div>

      {/* Analytics KPI Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        
        {/* Zero-Waste Efficiency Score */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Eficiencia Zero-Waste</span>
            <div style={{ background: efficiencyRate >= 80 ? 'var(--accent-emerald-glow)' : 'var(--accent-amber-glow)', padding: '0.5rem', borderRadius: '10px', color: efficiencyRate >= 80 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff' }}>{efficiencyRate}%</div>
          <span style={{ fontSize: '0.8rem', color: efficiencyRate >= 80 ? 'var(--accent-emerald)' : 'var(--accent-amber)', marginTop: '0.4rem' }}>
            {efficiencyRate >= 80 ? 'Aprovechamiento sobresaliente' : 'Oportunidad de mejora'}
          </span>
        </div>

        {/* Money Saved */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Valor Rescatado</span>
            <div style={{ background: 'var(--accent-emerald-glow)', padding: '0.5rem', borderRadius: '10px', color: 'var(--accent-emerald)' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff' }}>${totalMoneySaved.toFixed(2)}</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', marginTop: '0.4rem' }}>
            En {consumedLogs.length} alimentos consumidos
          </span>
        </div>

        {/* Money Lost */}
        <div className="glass-card" style={{ borderColor: totalMoneyLost > 0 ? 'rgba(239, 68, 68, 0.3)' : undefined }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Desperdicio Estimado</span>
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '0.5rem', borderRadius: '10px', color: '#ff8a8a' }}>
              <Trash2 size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: totalMoneyLost > 0 ? '#ff8a8a' : '#fff' }}>
            ${totalMoneyLost.toFixed(2)}
          </div>
          <span style={{ fontSize: '0.8rem', color: totalMoneyLost > 0 ? '#ff8a8a' : 'var(--text-muted)', marginTop: '0.4rem' }}>
            {discardedLogs.length} alimentos caducaron
          </span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-glass)' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Bitácora de Movimientos</h3>
        </div>

        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Clock size={40} color="var(--text-dim)" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-muted)' }}>Aún no hay registros de consumo ni desecho.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '1rem 1.5rem' }}>Fecha</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Producto</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Cantidad</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Acción</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Motivo</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Valor Estimado</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderTop: '1px solid var(--border-glass)', fontSize: '0.92rem', transition: 'background 0.15s' }}>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {typeof log.timestamp === 'string' ? log.timestamp : log.timestamp.toISOString().split('T')[0]}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#fff' }}>
                      {log.foodItemName}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-main)' }}>
                      {log.quantity} {log.unit}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      {log.action === 'CONSUMED' ? (
                        <span className="badge badge-good" style={{ fontSize: '0.7rem' }}>
                          <CheckCircle2 size={12} /> Consumido
                        </span>
                      ) : (
                        <span className="badge badge-expired" style={{ fontSize: '0.7rem' }}>
                          <Trash2 size={12} /> Desechado
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>
                      {getReasonLabel(log.reason)}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: log.action === 'CONSUMED' ? 'var(--accent-emerald)' : '#ff8a8a' }}>
                      ${(log.estimatedMonetaryValue || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
