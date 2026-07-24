import React, { useState, useMemo } from 'react';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonBadge
} from '@ionic/react';
import { homeOutline, cubeOutline, restaurantOutline, timeOutline } from 'ionicons/icons';

import { FoodItem, Recipe, ConsumptionLog, RecipeMatchResult, ExpirationStatus } from './models/types';
import { INITIAL_INVENTORY, INITIAL_RECIPES, INITIAL_CONSUMPTION_LOG } from './data/initialData';
import { findMatchingRecipes } from './services/recipeMatcherService';
import { calculateExpirationStatus } from './services/expirationService';

import { DashboardOverview } from './components/DashboardOverview';
import { InventoryView } from './components/InventoryView';
import { RecipesView } from './components/RecipesView';
import { HistoryView } from './components/HistoryView';
import { AddFoodModal } from './components/AddFoodModal';
import { RecipeDetailModal } from './components/RecipeDetailModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'recipes' | 'history'>('dashboard');
  const [inventory, setInventory] = useState<FoodItem[]>(INITIAL_INVENTORY);
  const [recipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [logs, setLogs] = useState<ConsumptionLog[]>(INITIAL_CONSUMPTION_LOG);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecipeMatch, setSelectedRecipeMatch] = useState<RecipeMatchResult | null>(null);
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState<ExpirationStatus | 'ALL'>('ALL');

  React.useEffect(() => {
    // Solicitar permiso de cámara de forma preventiva al iniciar la app
    const requestCameraPermissionOnStartup = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          // Detener el stream preventivo de inmediato para no mantener la cámara encendida
          stream.getTracks().forEach(track => track.stop());
        }
      } catch (err) {
        console.warn("Permiso de cámara no concedido en el inicio de la app:", err);
      }
    };

    const timer = setTimeout(() => {
      requestCameraPermissionOnStartup();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const matchedRecipes = useMemo(() => {
    return findMatchingRecipes(inventory, recipes, 0);
  }, [inventory, recipes]);

  const criticalCount = useMemo(() => {
    return inventory.filter(item => {
      const s = calculateExpirationStatus(item.expirationDate);
      return s === 'CRITICAL' || s === 'EXPIRED';
    }).length;
  }, [inventory]);

  const cookableCount = useMemo(() => {
    return matchedRecipes.filter(r => r.canBeCooked).length;
  }, [matchedRecipes]);

  const handleAddFood = (newItem: FoodItem) => {
    setInventory(prev => [newItem, ...prev]);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setInventory(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = Math.round(Math.max(0, item.quantity + delta) * 100) / 100;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const handleConsumeItem = (item: FoodItem) => {
    const newLog: ConsumptionLog = {
      id: `log-${Date.now()}`,
      foodItemId: item.id,
      foodItemName: item.name,
      quantity: item.quantity,
      unit: item.unit,
      action: 'CONSUMED',
      reason: 'EATEN_AS_SNACK',
      timestamp: new Date().toISOString().split('T')[0],
      estimatedMonetaryValue: 3.50
    };
    setLogs(prev => [newLog, ...prev]);
    setInventory(prev => prev.filter(i => i.id !== item.id));
  };

  const handleDiscardItem = (item: FoodItem) => {
    const newLog: ConsumptionLog = {
      id: `log-${Date.now()}`,
      foodItemId: item.id,
      foodItemName: item.name,
      quantity: item.quantity,
      unit: item.unit,
      action: 'DISCARDED',
      reason: 'EXPIRED_SPOILED',
      timestamp: new Date().toISOString().split('T')[0],
      estimatedMonetaryValue: 3.50
    };
    setLogs(prev => [newLog, ...prev]);
    setInventory(prev => prev.filter(i => i.id !== item.id));
  };

  const handleCookRecipe = (match: RecipeMatchResult) => {
    let currentInventory = [...inventory];
    const newLogs: ConsumptionLog[] = [];

    for (const used of match.matchedInventoryItems) {
      const index = currentInventory.findIndex(i => i.id === used.foodItem.id);
      if (index !== -1) {
        const item = currentInventory[index];
        const remainingQty = item.quantity - used.quantityUsed;

        newLogs.push({
          id: `log-${Date.now()}-${Math.random()}`,
          foodItemId: item.id,
          foodItemName: item.name,
          quantity: used.quantityUsed,
          unit: item.unit,
          action: 'CONSUMED',
          reason: 'EATEN_IN_RECIPE',
          timestamp: new Date().toISOString().split('T')[0],
          estimatedMonetaryValue: 4.00
        });

        if (remainingQty <= 0) {
          currentInventory.splice(index, 1);
        } else {
          currentInventory[index] = { ...item, quantity: remainingQty };
        }
      }
    }

    setInventory(currentInventory);
    setLogs(prev => [...newLogs, ...prev]);
    setActiveTab('history');
  };

  return (
    <IonApp>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle style={{ color: 'var(--accent-emerald)', fontSize: '1.25rem' }}>
              Cocina<span style={{ color: '#fff' }}>Cero</span>
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding" style={{ '--background': 'var(--bg-primary)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '80px' }}>
            {activeTab === 'dashboard' && (
              <DashboardOverview
                inventory={inventory}
                matchedRecipes={matchedRecipes}
                onNavigateToInventory={(filter) => {
                  if (filter) setInventoryStatusFilter(filter);
                  setActiveTab('inventory');
                }}
                onNavigateToRecipes={() => setActiveTab('recipes')}
                onSelectRecipe={(match) => setSelectedRecipeMatch(match)}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryView
                inventory={inventory}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                onUpdateQuantity={handleUpdateQuantity}
                onConsumeItem={handleConsumeItem}
                onDiscardItem={handleDiscardItem}
                initialStatusFilter={inventoryStatusFilter}
              />
            )}

            {activeTab === 'recipes' && (
              <RecipesView
                matchedRecipes={matchedRecipes}
                onSelectRecipe={(match) => setSelectedRecipeMatch(match)}
              />
            )}

            {activeTab === 'history' && (
              <HistoryView logs={logs} />
            )}
          </div>
        </IonContent>

        {/* Ionic Native Mobile Bottom Tab Bar */}
        <IonTabBar slot="bottom" style={{ borderTop: '1px solid var(--border-glass)', background: 'rgba(13, 17, 26, 0.95)' }}>
          <IonTabButton
            tab="dashboard"
            selected={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          >
            <IonIcon icon={homeOutline} />
            <IonLabel>Resumen</IonLabel>
          </IonTabButton>

          <IonTabButton
            tab="inventory"
            selected={activeTab === 'inventory'}
            onClick={() => setActiveTab('inventory')}
          >
            <IonIcon icon={cubeOutline} />
            <IonLabel>Despensa</IonLabel>
            {criticalCount > 0 && (
              <IonBadge color="danger">{criticalCount}</IonBadge>
            )}
          </IonTabButton>

          <IonTabButton
            tab="recipes"
            selected={activeTab === 'recipes'}
            onClick={() => setActiveTab('recipes')}
          >
            <IonIcon icon={restaurantOutline} />
            <IonLabel>Recetas</IonLabel>
            {cookableCount > 0 && (
              <IonBadge color="success">{cookableCount}</IonBadge>
            )}
          </IonTabButton>

          <IonTabButton
            tab="history"
            selected={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
          >
            <IonIcon icon={timeOutline} />
            <IonLabel>Historial</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonPage>

      {/* Modals */}
      {isAddModalOpen && (
        <AddFoodModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddFood}
        />
      )}

      {selectedRecipeMatch && (
        <RecipeDetailModal
          match={selectedRecipeMatch}
          onClose={() => setSelectedRecipeMatch(null)}
          onCookRecipe={handleCookRecipe}
        />
      )}
    </IonApp>
  );
};
