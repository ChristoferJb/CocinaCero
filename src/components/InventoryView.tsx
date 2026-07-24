import React, { useState } from 'react';
import { FoodItem, ExpirationStatus, FoodCategory } from '../models/types';
import { calculateDaysRemaining, calculateExpirationStatus } from '../services/expirationService';
import { Plus, Search, Trash2, Check, AlertTriangle, Clock, PlusCircle, MinusCircle, Package } from 'lucide-react';

interface InventoryViewProps {
  inventory: FoodItem[];
  onOpenAddModal: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onConsumeItem: (item: FoodItem) => void;
  onDiscardItem: (item: FoodItem) => void;
  initialStatusFilter?: ExpirationStatus | 'ALL';
}

const CATEGORIES: { label: string; value: FoodCategory | 'ALL' }[] = [
  { label: 'Todas las Categorías', value: 'ALL' },
  { label: 'Carnes & Pescados', value: 'carnes_pescados' },
  { label: 'Vegetales & Verduras', value: 'vegetales' },
  { label: 'Lácteos & Huevos', value: 'lacteos' },
  { label: 'Despensa & Granos', value: 'despensa' },
  { label: 'Frutas', value: 'frutas' }
];

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  onOpenAddModal,
  onUpdateQuantity,
  onConsumeItem,
  onDiscardItem,
  initialStatusFilter = 'ALL'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<ExpirationStatus | 'ALL'>(initialStatusFilter);

  const getQuantityStep = (unit: string): number => {
    switch (unit) {
      case 'g':
      case 'ml':
        return 100; // Incremento de 100 en 100 para gramos y mililitros
      case 'kg':
      case 'l':
        return 0.1; // Incremento de 0.1 en 0.1 (equivalente a 100g/100ml) para kilogramos y litros
      case 'unidad':
      case 'taza':
      case 'cucharada':
      case 'cucharadita':
      default:
        return 1; // Incremento unitario (1 a 1) para piezas, tazas, etc.
    }
  };

  // Filter logic
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const itemStatus = calculateExpirationStatus(item.expirationDate);
    const matchesStatus = statusFilter === 'ALL' || itemStatus === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getBadgeForStatus = (status: ExpirationStatus, days: number) => {
    switch (status) {
      case 'EXPIRED':
        return (
          <span className="badge badge-expired">
            <AlertTriangle size={12} />
            <span>Venció hace {Math.abs(days)}d</span>
          </span>
        );
      case 'CRITICAL':
        return (
          <span className="badge badge-critical">
            <AlertTriangle size={12} />
            <span>Vence {days === 0 ? 'Hoy (0d)' : `en ${days}d`}</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="badge badge-warning">
            <Clock size={12} />
            <span>Vence en {days}d</span>
          </span>
        );
      case 'GOOD':
        return (
          <span className="badge badge-good">
            <Check size={12} />
            <span>Buen estado ({days}d)</span>
          </span>
        );
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>Despensa Inteligente</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Gestiona existencias y observa en tiempo real los días restantes antes de caducar.
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenAddModal} style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}>
          <Plus size={20} />
          <span>Registrar Nuevo Alimento</span>
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>

          {/* Search Box */}
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
            {!searchTerm && (
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }} />
            )}
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre (ej. Pollo, Tomates)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Category Dropdown */}
          <div style={{ flex: '0 1 240px' }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as FoodCategory | 'ALL')}
              style={{ width: '100%' }}
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--border-glass)' }}>
          {[
            { label: 'Todos', value: 'ALL' },
            { label: 'Críticos (0-2 d)', value: 'CRITICAL' },
            { label: 'Por Vencer (3-5 d)', value: 'WARNING' },
            { label: 'Óptimos', value: 'GOOD' },
            { label: 'Vencidos', value: 'EXPIRED' }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value as ExpirationStatus | 'ALL')}
              style={{
                background: statusFilter === tab.value ? 'var(--accent-emerald)' : 'var(--bg-tertiary)',
                color: statusFilter === tab.value ? '#ffffff' : 'var(--text-muted)',
                border: '1px solid var(--border-glass)',
                padding: '0.4rem 0.9rem',
                borderRadius: '0.6rem',
                fontSize: '0.82rem',
                fontWeight: statusFilter === tab.value ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Grid */}
      {filteredInventory.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Package size={48} color="var(--text-dim)" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No se encontraron alimentos</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
            No hay productos que coincidan con tu búsqueda actual en la despensa. Registra uno nuevo.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredInventory.map(item => {
            const days = calculateDaysRemaining(item.expirationDate);
            const status = calculateExpirationStatus(item.expirationDate);

            return (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderColor: status === 'CRITICAL' ? 'rgba(239, 68, 68, 0.4)' : undefined
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                    {getBadgeForStatus(status, days)}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', background: 'var(--bg-tertiary)', padding: '0.2rem 0.6rem', borderRadius: '6px', textTransform: 'uppercase' }}>
                      {item.category.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.6rem' }}>
                    {item.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem', background: 'var(--bg-tertiary)', padding: '0.6rem 0.85rem', borderRadius: '0.75rem', width: 'fit-content' }}>
                    <button
                      onClick={() => onUpdateQuantity(item.id, -getQuantityStep(item.unit))}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                      title={`Restar ${getQuantityStep(item.unit)} ${item.unit}`}
                    >
                      <MinusCircle size={18} />
                    </button>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                      {item.quantity} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{item.unit}</span>
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, getQuantityStep(item.unit))}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                      title={`Sumar ${getQuantityStep(item.unit)} ${item.unit}`}
                    >
                      <PlusCircle size={18} />
                    </button>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <button
                    onClick={() => onConsumeItem(item)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                  >
                    <Check size={15} />
                    <span>Consumido</span>
                  </button>

                  <button
                    onClick={() => onDiscardItem(item)}
                    className="btn-danger"
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                  >
                    <Trash2 size={15} />
                    <span>Desechar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
