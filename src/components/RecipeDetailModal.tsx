import React from 'react';
import { RecipeMatchResult } from '../models/types';
import { X, CheckCircle2, AlertTriangle, Clock, Users, Flame, Sparkles, ChefHat } from 'lucide-react';

interface RecipeDetailModalProps {
  match: RecipeMatchResult;
  onClose: () => void;
  onCookRecipe: (match: RecipeMatchResult) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  match,
  onClose,
  onCookRecipe
}) => {
  const { recipe, canBeCooked, matchedInventoryItems, missingIngredients, insufficientIngredients, zeroWasteScore } = match;

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', backgroundColor: 'var(--bg-primary)', zIndex: 5000, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span className={canBeCooked ? 'badge badge-good' : 'badge badge-warning'}>
                {canBeCooked ? 'Listo para preparar' : `${match.matchPercentage}% Viabilidad`}
              </span>
              {zeroWasteScore > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                  <Flame size={13} fill="var(--accent-amber)" />
                  +{zeroWasteScore} pts rescate Zero-Waste
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>{recipe.title}</h2>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        {/* Quick info */}
        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={16} color="var(--accent-emerald)" />
            <span>Tiempo: {recipe.prepTimeMinutes} min</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={16} color="var(--accent-cyan)" />
            <span>Porciones: {recipe.servings}</span>
          </div>
        </div>

        {/* Description */}
        <p style={{ color: 'var(--text-main)', fontSize: '0.98rem', marginBottom: '1.75rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '1rem', borderLeft: '3px solid var(--accent-emerald)' }}>
          {recipe.description}
        </p>

        {/* Ingredients Matching Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.85rem' }}>Evaluación de Ingredientes frente a tu Inventario</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {/* Matched inventory items */}
            {matchedInventoryItems.map((matched, idx) => (
              <div 
                key={`matched-${idx}`}
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--accent-emerald)" />
                  <div>
                    <span style={{ fontWeight: 600, color: '#fff' }}>{matched.foodItem.name}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                      (Requiere: {matched.quantityUsed} {matched.foodItem.unit} | Tienes: {matched.foodItem.quantity} {matched.foodItem.unit})
                    </span>
                  </div>
                </div>

                {matched.status === 'CRITICAL' && (
                  <span className="badge badge-critical" style={{ fontSize: '0.7rem' }}>
                    Salvas esto de vencer {matched.daysRemaining === 0 ? 'HOY' : 'MAÑANA'}
                  </span>
                )}
                {matched.status === 'WARNING' && (
                  <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                    Vence en {matched.daysRemaining}d
                  </span>
                )}
              </div>
            ))}

            {/* Insufficient quantity */}
            {insufficientIngredients.map((ins, idx) => (
              <div
                key={`ins-${idx}`}
                style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}
              >
                <AlertTriangle size={18} color="var(--accent-amber)" />
                <div>
                  <span style={{ fontWeight: 600, color: '#fde68a' }}>{ins.ingredient.name}</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                    (Tienes {ins.availableQuantity} {ins.unit}, pero la receta pide {ins.requiredQuantity} {ins.unit})
                  </span>
                </div>
              </div>
            ))}

            {/* Completely missing items */}
            {missingIngredients.map((missing, idx) => (
              <div
                key={`miss-${idx}`}
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}
              >
                <AlertTriangle size={18} color="var(--accent-rose)" />
                <div>
                  <span style={{ fontWeight: 600, color: '#fca5a5' }}>{missing.name}</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                    ({missing.quantity} {missing.unit}) — {missing.isOptional ? 'Opcional (puedes cocinar sin él)' : 'Obligatorio'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Pasos para la Preparación</h3>
          <ol style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingLeft: '1.2rem' }}>
            {recipe.instructions.map((step, idx) => (
              <li key={idx} style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-glass)' }}>
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
          <button
            className="btn-primary"
            style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
            onClick={() => {
              onCookRecipe(match);
              onClose();
            }}
          >
            <Sparkles size={18} />
            <span>Cocinar Ahora y Descontar del Inventario</span>
          </button>
        </div>
      </div>
    </div>
  );
};
