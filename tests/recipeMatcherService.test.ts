import { describe, it, expect } from 'vitest';
import { findMatchingRecipes, matchSingleRecipe, isQuantitySufficient } from '../src/services/recipeMatcherService';
import { FoodItem, Recipe } from '../src/models/types';

describe('RecipeMatcherService - Algoritmo Inteligente de Búsqueda y Aprovechamiento', () => {
  const MOCK_CURRENT_DATE = '2026-07-13';

  describe('isQuantitySufficient (Evaluación de cantidades y unidades básicas)', () => {
    it('debe aprobar cuando la cantidad disponible es mayor o igual y las unidades coinciden', () => {
      expect(isQuantitySufficient(300, 'g', 200, 'g')).toBe(true);
      expect(isQuantitySufficient(100, 'g', 200, 'g')).toBe(false);
    });

    it('debe convertir adecuadamente entre kilogramos y gramos (y litros/ml)', () => {
      expect(isQuantitySufficient(1, 'kg', 500, 'g')).toBe(true); // 1kg = 1000g >= 500g
      expect(isQuantitySufficient(0.2, 'kg', 300, 'g')).toBe(false); // 0.2kg = 200g < 300g
      expect(isQuantitySufficient(1.5, 'l', 1200, 'ml')).toBe(true); // 1.5l = 1500ml >= 1200ml
    });
  });

  describe('findMatchingRecipes (Emparejamiento con el catálogo de recetas)', () => {
    const inventory: FoodItem[] = [
      {
        id: '1',
        name: 'Tomates Maduros',
        normalizedName: 'tomate',
        quantity: 600,
        unit: 'g',
        expirationDate: '2026-07-13', // Vence HOY (CRITICAL) - ¡Aprovechamiento urgente!
        category: 'vegetales',
        createdAt: '2026-07-08'
      },
      {
        id: '2',
        name: 'Queso Mozzarella',
        normalizedName: 'queso mozzarella',
        quantity: 300,
        unit: 'g',
        expirationDate: '2026-07-14', // Vence MAÑANA (CRITICAL)
        category: 'lacteos',
        createdAt: '2026-07-08'
      },
      {
        id: '3',
        name: 'Aceite de Oliva',
        normalizedName: 'aceite de oliva',
        quantity: 1,
        unit: 'l',
        expirationDate: '2027-01-01', // GOOD
        category: 'despensa',
        createdAt: '2026-07-01'
      }
    ];

    const recipes: Recipe[] = [
      {
        id: 'rec-1',
        title: 'Ensalada Caprese Salvavidas',
        description: 'Receta rápida que aprovecha tomates y queso frescos antes de vencer.',
        prepTimeMinutes: 10,
        servings: 2,
        ingredients: [
          { name: 'Tomate', normalizedName: 'tomate', quantity: 400, unit: 'g', isOptional: false },
          { name: 'Queso Mozzarella', normalizedName: 'queso mozzarella', quantity: 200, unit: 'g', isOptional: false },
          { name: 'Aceite de Oliva', normalizedName: 'aceite de oliva', quantity: 2, unit: 'cucharada', isOptional: true },
          { name: 'Albahaca Fresca', normalizedName: 'albahaca', quantity: 1, unit: 'unidad', isOptional: true } // Opcional que falta
        ],
        instructions: ['Cortar el tomate y el queso en rodajas', 'Rociar con aceite de oliva y decorar con albahaca si se tiene'],
        tags: ['aprovechamiento', 'rapido', 'vegetariano']
      },
      {
        id: 'rec-2',
        title: 'Sopa de Tomate Rápida',
        description: 'Una crema caliente de tomates.',
        prepTimeMinutes: 20,
        servings: 2,
        ingredients: [
          { name: 'Tomate', normalizedName: 'tomate', quantity: 500, unit: 'g', isOptional: false },
          { name: 'Ajo', normalizedName: 'ajo', quantity: 2, unit: 'unidad', isOptional: false } // Ingrediente que no tenemos
        ],
        instructions: ['Licuar tomates con ajo', 'Cocinar por 15 minutos'],
        tags: ['sopa', 'tomate']
      }
    ];

    it('debe marcar una receta como canBeCooked=true si se poseen todos los ingredientes obligatorios (aunque falten opcionales)', () => {
      const matchCaprese = matchSingleRecipe(recipes[0], inventory, MOCK_CURRENT_DATE);
      expect(matchCaprese.canBeCooked).toBe(true);
      expect(matchCaprese.matchPercentage).toBe(100);
      // Albahaca falta pero era opcional
      expect(matchCaprese.missingIngredients.length).toBe(0);
    });

    it('debe marcar canBeCooked=false si falta un ingrediente obligatorio', () => {
      const matchSopa = matchSingleRecipe(recipes[1], inventory, MOCK_CURRENT_DATE);
      expect(matchSopa.canBeCooked).toBe(false);
      expect(matchSopa.matchPercentage).toBe(50); // 1 de 2 ingredientes obligatorios
      expect(matchSopa.missingIngredients[0].normalizedName).toBe('ajo');
    });

    it('debe otorgar un mayor zeroWasteScore a recetas que consumen alimentos en estado CRITICAL o WARNING', () => {
      const results = findMatchingRecipes(inventory, recipes, 0, MOCK_CURRENT_DATE);
      expect(results[0].recipe.title).toBe('Ensalada Caprese Salvavidas');
      expect(results[0].zeroWasteScore).toBeGreaterThan(0);
      // Como usa tomate y queso (ambos CRITICAL), el score de rescate es altísimo (50 + 50 = 100+)
      expect(results[0].zeroWasteScore).toBeGreaterThanOrEqual(100);
    });
  });
});
