import React, { useState } from 'react';
import { FoodItem, UnitOfMeasure, FoodCategory } from '../models/types';
import { X, PlusCircle, Calendar, Tag, QrCode, CheckCircle2, Sparkles } from 'lucide-react';
import { normalizeText } from '../services/recipeMatcherService';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { ProductLookupResult } from '../services/barcodeService';

interface AddFoodModalProps {
  onClose: () => void;
  onAdd: (newItem: FoodItem) => void;
}

const UNITS: UnitOfMeasure[] = ['g', 'kg', 'ml', 'l', 'unidad', 'taza', 'cucharada', 'cucharadita'];
const CATEGORIES: { label: string; value: FoodCategory }[] = [
  { label: 'Carnes & Pescados', value: 'carnes_pescados' },
  { label: 'Vegetales & Verduras', value: 'vegetales' },
  { label: 'Lácteos & Huevos', value: 'lacteos' },
  { label: 'Despensa & Granos', value: 'despensa' },
  { label: 'Frutas', value: 'frutas' },
  { label: 'Panadería', value: 'panaderia' },
  { label: 'Congelados', value: 'congelados' },
  { label: 'Otros', value: 'otros' }
];

export const AddFoodModal: React.FC<AddFoodModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number>(500);
  const [unit, setUnit] = useState<UnitOfMeasure>('g');
  const [category, setCategory] = useState<FoodCategory>('vegetales');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedProductAlert, setScannedProductAlert] = useState<string | null>(null);
  
  // Date selection helper
  const getDefaultDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  };

  const [expirationDate, setExpirationDate] = useState<string>(getDefaultDate(3));

  const handleProductDetectedFromQR = (product: ProductLookupResult) => {
    setIsScannerOpen(false);
    setName(product.name);
    setQuantity(product.quantity);
    setUnit(product.unit);
    setCategory(product.category);
    setExpirationDate(getDefaultDate(product.suggestedDaysToExpiration));
    setScannedProductAlert(`Producto detectado (${product.barcode}): "${product.name}" autocompletado con éxito.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: FoodItem = {
      id: `food-${Date.now()}`,
      name: name.trim(),
      normalizedName: normalizeText(name),
      quantity: Number(quantity) || 1,
      unit,
      category,
      expirationDate,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAdd(newItem);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', backgroundColor: 'var(--bg-primary)', zIndex: 5000, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: '850px', width: '100%', margin: '0 auto', padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <PlusCircle size={24} color="var(--accent-emerald)" />
            <h2 style={{ fontSize: '1.6rem' }}>Registrar Nuevo Alimento</h2>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        {/* QR Scanner Trigger Button */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(6, 182, 212, 0.18))',
              border: '1px dashed var(--accent-emerald)',
              padding: '1rem',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)',
              transition: 'all 0.25s'
            }}
          >
            <QrCode size={24} color="var(--accent-emerald)" />
            <span>Escanear Código QR / Barcode para Autocompletar</span>
          </button>
        </div>

        {/* Success Alert when QR matches */}
        {scannedProductAlert && (
          <div className="animate-fade-in" style={{ background: 'rgba(16, 185, 129, 0.18)', border: '1px solid var(--accent-emerald)', padding: '0.85rem 1rem', borderRadius: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#6ee7b7', fontSize: '0.9rem', marginBottom: '1.25rem', fontWeight: 500 }}>
            <CheckCircle2 size={20} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{scannedProductAlert}</span>
            <Sparkles size={18} color="var(--accent-amber)" />
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Nombre del Producto *
            </label>
            <input
              type="text"
              required
              placeholder="ej. Pechuga de Pollo Fresca, Tomates Cherry..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%' }}
              autoFocus
            />
          </div>

          {/* Quantity & Unit */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Cantidad
              </label>
              <input
                type="number"
                min="0.1"
                step="any"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Unidad de Medida
              </label>
              <select value={unit} onChange={(e) => setUnit(e.target.value as UnitOfMeasure)} style={{ width: '100%' }}>
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <Tag size={15} /> Categoría
            </label>
            <select value={category} onChange={(e) => setCategory(e.target.value as FoodCategory)} style={{ width: '100%' }}>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Expiration Date with quick pickers */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <Calendar size={15} /> Fecha de Vencimiento
            </label>
            
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
              <button
                type="button"
                onClick={() => setExpirationDate(getDefaultDate(0))}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.78rem', fontWeight: 600, background: 'rgba(239, 68, 68, 0.2)', color: '#ff8a8a', border: '1px solid rgba(239, 68, 68, 0.4)' }}
              >
                Vence Hoy (0d)
              </button>
              <button
                type="button"
                onClick={() => setExpirationDate(getDefaultDate(1))}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.78rem', fontWeight: 600, background: 'rgba(239, 68, 68, 0.15)', color: '#ff8a8a', border: '1px solid rgba(239, 68, 68, 0.3)' }}
              >
                Mañana (1d)
              </button>
              <button
                type="button"
                onClick={() => setExpirationDate(getDefaultDate(3))}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.78rem', fontWeight: 600, background: 'rgba(245, 158, 11, 0.15)', color: '#fde68a', border: '1px solid rgba(245, 158, 11, 0.3)' }}
              >
                En 3 días
              </button>
              <button
                type="button"
                onClick={() => setExpirationDate(getDefaultDate(10))}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.78rem', fontWeight: 600, background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.3)' }}
              >
                En 10 días
              </button>
            </div>

            <input
              type="date"
              required
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', justifySelf: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              Guardar en Despensa
            </button>
          </div>
        </form>
      </div>

      {/* Barcode Scanner Sub-Modal */}
      {isScannerOpen && (
        <BarcodeScannerModal
          onClose={() => setIsScannerOpen(false)}
          onProductDetected={handleProductDetectedFromQR}
        />
      )}
    </div>
  );
};
