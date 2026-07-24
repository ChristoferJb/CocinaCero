import React from 'react';
import { FoodItem, RecipeMatchResult } from '../models/types';
import { calculateDaysRemaining, calculateExpirationStatus } from '../services/expirationService';
import { AlertTriangle, Clock, CheckCircle2, ArrowRight, TrendingUp, Sparkles, Flame, DollarSign } from 'lucide-react';

interface DashboardOverviewProps {
  inventory: FoodItem[];
  matchedRecipes: RecipeMatchResult[];
  onNavigateToInventory: (filter?: 'CRITICAL' | 'WARNING' | 'GOOD' | 'EXPIRED') => void;
  onNavigateToRecipes: () => void;
  onSelectRecipe: (match: RecipeMatchResult) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  inventory,
  matchedRecipes,
  onNavigateToInventory,
  onNavigateToRecipes,
  onSelectRecipe
}) => {
  // Compute KPI statistics
  const criticalItems = inventory.filter(i => {
    const status = calculateExpirationStatus(i.expirationDate);
    return status === 'CRITICAL' || status === 'EXPIRED';
  });

  const warningItems = inventory.filter(i => calculateExpirationStatus(i.expirationDate) === 'WARNING');
  
  const cookableRecipes = matchedRecipes.filter(r => r.canBeCooked);

  // Top recommended recipes sorted by Zero-Waste Score
  const topRecommendations = [...matchedRecipes]
    .sort((a, b) => b.zeroWasteScore - a.zeroWasteScore)
    .slice(0, 3);

  const estimatedSavedMoney = criticalItems.length * 4.50;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Hero Welcome & KPI Cards */}
      <section>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Centro de Mando Zero-Waste
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Auditoría en tiempo real de tu despensa y sugerencias inteligentes de rescate alimentario.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
          
          {/* Total Items */}
          <div className="glass-card glass-card-interactive" onClick={() => onNavigateToInventory()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Alimentos en Despensa</span>
              <div style={{ background: 'var(--accent-emerald-glow)', padding: '0.5rem', borderRadius: '10px', color: 'var(--accent-emerald)' }}>
                <CheckCircle2 size={20} />
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fff' }}>{inventory.length}</div>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.4rem' }}>
              <span>Ver inventario completo</span>
              <ArrowRight size={14} />
            </span>
          </div>

          {/* Critical Items (Semaforo Rojo) */}
          <div className="glass-card glass-card-interactive" onClick={() => onNavigateToInventory('CRITICAL')} style={{ borderColor: criticalItems.length > 0 ? 'rgba(239, 68, 68, 0.4)' : undefined }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Semáforo Crítico (0-2 días)</span>
              <div style={{ background: 'var(--accent-rose-glow)', padding: '0.5rem', borderRadius: '10px', color: 'var(--accent-rose)' }}>
                <AlertTriangle size={20} />
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: criticalItems.length > 0 ? '#ff8a8a' : '#fff' }}>
              {criticalItems.length}
            </div>
            <span style={{ fontSize: '0.8rem', color: criticalItems.length > 0 ? '#ff8a8a' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.4rem' }}>
              <span>{criticalItems.length > 0 ? 'Requieren consumo urgente' : 'Sin alertas críticas'}</span>
              <ArrowRight size={14} />
            </span>
          </div>

          {/* Warning Items (Semaforo Amarillo) */}
          <div className="glass-card glass-card-interactive" onClick={() => onNavigateToInventory('WARNING')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Por Vencer (3-5 días)</span>
              <div style={{ background: 'var(--accent-amber-glow)', padding: '0.5rem', borderRadius: '10px', color: 'var(--accent-amber)' }}>
                <Clock size={20} />
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: warningItems.length > 0 ? '#fde68a' : '#fff' }}>
              {warningItems.length}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.4rem' }}>
              <span>Planificar en recetas</span>
              <ArrowRight size={14} />
            </span>
          </div>

          {/* Cookable Recipes */}
          <div className="glass-card glass-card-interactive" onClick={onNavigateToRecipes}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Recetas Listas (100%)</span>
              <div style={{ background: 'rgba(6, 182, 212, 0.25)', padding: '0.5rem', borderRadius: '10px', color: 'var(--accent-cyan)' }}>
                <Sparkles size={20} />
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fff' }}>{cookableRecipes.length}</div>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.4rem' }}>
              <span>Ver catálogo disponible</span>
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </section>

      {/* Critical Alert Banner if there are items expiring immediately */}
      {criticalItems.length > 0 && (
        <section className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(245, 158, 11, 0.1))', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '0.8rem', borderRadius: '14px', color: '#ff8a8a' }}>
                <AlertTriangle size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#ff8a8a', marginBottom: '0.2rem' }}>
                  Alerta de Caducidad Urgente: {criticalItems.length} producto(s) en riesgo
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Tienes ingredientes como <span style={{ color: '#fff', fontWeight: 600 }}>{criticalItems[0].name}</span> por vencer o vencidos hoy. Utiliza nuestro motor de recetas para aprovecharlos.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Ahorro potencial en rescate</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center' }}>
                  <DollarSign size={16} /> ~{estimatedSavedMoney.toFixed(2)} USD
                </span>
              </div>
              <button className="btn-primary" onClick={onNavigateToRecipes} style={{ background: 'var(--accent-rose)' }}>
                <span>Ver Recetas de Salvamento</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Recommended Zero-Waste Recipes Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>Recetas Recomendadas para Salvar Alimentos</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Algoritmo ponderado que da máxima prioridad a los ingredientes que vencen en las próximas 48 horas.
            </p>
          </div>
          <button onClick={onNavigateToRecipes} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <span>Ver Todo el Catálogo</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {topRecommendations.map((match) => (
            <div 
              key={match.recipe.id} 
              className="glass-card glass-card-interactive"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}
              onClick={() => onSelectRecipe(match)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <span className={match.canBeCooked ? 'badge badge-good' : 'badge badge-warning'}>
                    {match.canBeCooked ? '100% Viable hoy' : `${match.matchPercentage}% Viabilidad`}
                  </span>

                  {match.zeroWasteScore > 0 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                      <Flame size={13} fill="var(--accent-amber)" />
                      +{match.zeroWasteScore} pts rescate
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>
                  {match.recipe.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {match.recipe.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={14} color="var(--accent-emerald)" />
                  {match.recipe.prepTimeMinutes} min • {match.recipe.servings} porciones
                </span>

                <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                  <span>Preparar</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
