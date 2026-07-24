import React, { useState } from 'react';
import { RecipeMatchResult } from '../models/types';
import { Sparkles, Clock, CheckCircle2, AlertTriangle, ArrowRight, Flame, Utensils } from 'lucide-react';

interface RecipesViewProps {
  matchedRecipes: RecipeMatchResult[];
  onSelectRecipe: (match: RecipeMatchResult) => void;
}

export const RecipesView: React.FC<RecipesViewProps> = ({
  matchedRecipes,
  onSelectRecipe
}) => {
  const [filter, setFilter] = useState<'ALL' | 'READY' | 'HIGH_RESCUE'>('ALL');

  const sortedRecipes = [...matchedRecipes].sort((a, b) => {
    if (a.canBeCooked !== b.canBeCooked) {
      return a.canBeCooked ? -1 : 1;
    }
    return b.zeroWasteScore - a.zeroWasteScore;
  });

  const displayedRecipes = sortedRecipes.filter(r => {
    if (filter === 'READY') return r.canBeCooked;
    if (filter === 'HIGH_RESCUE') return r.zeroWasteScore >= 3;
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Utensils size={28} color="var(--accent-emerald)" />
            <span>Sugerencias Inteligentes</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            El motor Zero-Waste evalúa tus ingredientes y prioriza las recetas que salvan comida por caducar.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.35rem', borderRadius: '0.85rem', border: '1px solid var(--border-glass)' }}>
          {[
            { label: 'Todas las Recetas', value: 'ALL' },
            { label: '100% Listas', value: 'READY' },
            { label: 'Alto Rescate', value: 'HIGH_RESCUE' }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as any)}
              style={{
                background: filter === tab.value ? 'var(--accent-emerald)' : 'transparent',
                color: filter === tab.value ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.6rem',
                fontSize: '0.85rem',
                fontWeight: filter === tab.value ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {displayedRecipes.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No hay recetas con el filtro seleccionado</h3>
          <p style={{ color: 'var(--text-muted)' }}>Intenta cambiar a "Todas las Recetas" para ver opciones que requieran pocos ingredientes adicionales.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {displayedRecipes.map((match) => (
            <div
              key={match.recipe.id}
              className="glass-card glass-card-interactive"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}
              onClick={() => onSelectRecipe(match)}
            >
              <div>
                {/* Top Badge bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span className={match.canBeCooked ? 'badge badge-good' : 'badge badge-warning'}>
                    {match.canBeCooked ? 'Listo para Cocinar' : `Faltan ${match.missingIngredients.filter(m => !m.isOptional).length} ingredientes`}
                  </span>

                  {match.zeroWasteScore > 0 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.15)', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                      <Flame size={14} fill="var(--accent-amber)" />
                      +{match.zeroWasteScore} pts rescate
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {match.recipe.title}
                </h3>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {match.recipe.description}
                </p>

                {/* Ingredients Match Breakdown */}
                <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '0.85rem', borderRadius: '0.85rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Evaluación de ingredientes ({match.matchPercentage}% coincidencia)
                  </span>

                  {/* Matched items */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {match.matchedInventoryItems.map((matched, idx) => (
                      <span 
                        key={idx}
                        style={{
                          fontSize: '0.78rem',
                          background: matched.status === 'CRITICAL' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.15)',
                          color: matched.status === 'CRITICAL' ? '#ff8a8a' : '#6ee7b7',
                          border: `1px solid ${matched.status === 'CRITICAL' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.3)'}`,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <CheckCircle2 size={12} />
                        <span>{matched.foodItem.name}</span>
                      </span>
                    ))}

                    {/* Missing non-optional */}
                    {match.missingIngredients.filter(m => !m.isOptional).map((missing, idx) => (
                      <span
                        key={`miss-${idx}`}
                        style={{
                          fontSize: '0.78rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--text-dim)',
                          border: '1px solid var(--border-glass)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <AlertTriangle size={12} />
                        <span>Falta: {missing.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={14} color="var(--accent-emerald)" />
                  {match.recipe.prepTimeMinutes} mins • {match.recipe.servings} porciones
                </span>

                <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  <span>Ver Detalle</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
