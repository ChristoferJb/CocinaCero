import React from 'react';
import { Home, Package, Utensils, History, AlertTriangle, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'inventory' | 'recipes' | 'history';
  setActiveTab: (tab: 'dashboard' | 'inventory' | 'recipes' | 'history') => void;
  criticalCount: number;
  cookableRecipesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  criticalCount,
  cookableRecipesCount
}) => {
  return (
    <nav className="navbar-container">
      <div className="navbar-brand">
        <div className="brand-logo">CC</div>
        <span className="brand-name">Cocina<span style={{ color: '#fff' }}>Cero</span></span>
      </div>

      <div className="navbar-links">
        <button
          className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Home size={18} />
          <span>Resumen</span>
        </button>

        <button
          className={`nav-button ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <Package size={18} />
          <span>Despensa</span>
          {criticalCount > 0 && (
            <span className="nav-badge critical-badge">
              <AlertTriangle size={12} />
              <span>{criticalCount}</span>
            </span>
          )}
        </button>

        <button
          className={`nav-button ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          <Utensils size={18} />
          <span>Recetas</span>
          {cookableRecipesCount > 0 && (
            <span className="nav-badge good-badge">
              <Sparkles size={12} />
              <span>{cookableRecipesCount}</span>
            </span>
          )}
        </button>

        <button
          className={`nav-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={18} />
          <span>Historial</span>
        </button>
      </div>
    </nav>
  );
};
