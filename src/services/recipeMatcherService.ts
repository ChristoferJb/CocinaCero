import { 
  FoodItem, 
  Recipe, 
  RecipeIngredient, 
  RecipeMatchResult, 
  UnitOfMeasure, 
  ExpirationStatus 
} from '../models/types';
import { calculateDaysRemaining, calculateExpirationStatus } from './expirationService';

/**
 * Tabla de conversión simplificada de unidades equivalentes (en gramos/mililitros)
 * para realizar matching de cantidades aun si el usuario tiene "kg" y la receta pide "g".
 */
const UNIT_CONVERSION_TO_BASE: Record<UnitOfMeasure, { baseUnit: 'mass' | 'volume' | 'unit' | 'cup_tbsp', factor: number }> = {
  g: { baseUnit: 'mass', factor: 1 },
  kg: { baseUnit: 'mass', factor: 1000 },
  ml: { baseUnit: 'volume', factor: 1 },
  l: { baseUnit: 'volume', factor: 1000 },
  unidad: { baseUnit: 'unit', factor: 1 },
  taza: { baseUnit: 'cup_tbsp', factor: 240 },
  cucharada: { baseUnit: 'cup_tbsp', factor: 15 },
  cucharadita: { baseUnit: 'cup_tbsp', factor: 5 }
};

/**
 * Normaliza textos (nombres de alimentos o ingredientes) para una comparación insensible
 * a mayúsculas, tildes y espacios extras.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remueve tildes y acentos diacríticos
    .trim();
}

/**
 * Evalúa si una cantidad disponible satisface una cantidad requerida teniendo en cuenta las unidades.
 */
export function isQuantitySufficient(
  availableQty: number,
  availableUnit: UnitOfMeasure,
  requiredQty: number,
  requiredUnit: UnitOfMeasure
): boolean {
  // Si las unidades son idénticas, comparación directa
  if (availableUnit === requiredUnit) {
    return availableQty >= requiredQty;
  }

  const availInfo = UNIT_CONVERSION_TO_BASE[availableUnit];
  const reqInfo = UNIT_CONVERSION_TO_BASE[requiredUnit];

  // Si pertenecen a la misma magnitud base (ej. 'mass' para g/kg o 'volume' para ml/l), convertimos a la base
  if (availInfo && reqInfo && availInfo.baseUnit === reqInfo.baseUnit) {
    const availInBase = availableQty * availInfo.factor;
    const reqInBase = requiredQty * reqInfo.factor;
    return availInBase >= reqInBase;
  }

  // Si las unidades no son directamente convertibles sin densidad (ej. tazas vs gramos),
  // se asume compatibilidad si la cantidad numérica supera una estimación o comparación flexible
  return availableQty >= requiredQty;
}

/**
 * Evalúa una única receta frente al inventario actual.
 * 
 * @param recipe La receta a evaluar
 * @param inventory Lista de alimentos en el inventario del hogar
 * @param currentDate Fecha actual para calcular la urgencia (zero-waste score)
 */
export function matchSingleRecipe(
  recipe: Recipe,
  inventory: FoodItem[],
  currentDate?: string | Date
): RecipeMatchResult {
  // Indexar inventario por nombre normalizado para búsqueda O(1) / O(N)
  const inventoryMap = new Map<string, FoodItem>();
  for (const item of inventory) {
    const cleanName = normalizeText(item.normalizedName || item.name);
    inventoryMap.set(cleanName, item);
  }

  const mandatoryIngredients = recipe.ingredients.filter(i => !i.isOptional);
  const optionalIngredients = recipe.ingredients.filter(i => i.isOptional);

  let satisfiedMandatoryCount = 0;
  const missingIngredients: RecipeIngredient[] = [];
  const insufficientIngredients: RecipeMatchResult['insufficientIngredients'] = [];
  const matchedInventoryItems: RecipeMatchResult['matchedInventoryItems'] = [];
  let zeroWasteScore = 0;

  // 1. Evaluar ingredientes obligatorios
  for (const req of mandatoryIngredients) {
    const cleanReqName = normalizeText(req.normalizedName || req.name);
    const foundItem = inventoryMap.get(cleanReqName);

    if (!foundItem) {
      missingIngredients.push(req);
    } else {
      const daysRemaining = calculateDaysRemaining(foundItem.expirationDate, currentDate);
      const status = calculateExpirationStatus(foundItem.expirationDate, currentDate);

      if (isQuantitySufficient(foundItem.quantity, foundItem.unit, req.quantity, req.unit)) {
        satisfiedMandatoryCount++;
        matchedInventoryItems.push({
          foodItem: foundItem,
          quantityUsed: req.quantity,
          daysRemaining,
          status
        });

        // Calcular puntaje Zero-Waste: premiar enormemente si la receta rescata un ítem CRÍTICO o en ADVERTENCIA
        if (status === 'CRITICAL') zeroWasteScore += 50;
        else if (status === 'EXPIRED') zeroWasteScore += 30; // Si el usuario decide aprovecharlo con precaución
        else if (status === 'WARNING') zeroWasteScore += 20;
        else zeroWasteScore += 5;
      } else {
        // El ingrediente existe en inventario pero la cantidad no alcanza
        insufficientIngredients.push({
          ingredient: req,
          availableQuantity: foundItem.quantity,
          requiredQuantity: req.quantity,
          unit: req.unit
        });
      }
    }
  }

  // 2. Evaluar ingredientes opcionales (aportan al score de rescate si coinciden)
  for (const opt of optionalIngredients) {
    const cleanOptName = normalizeText(opt.normalizedName || opt.name);
    const foundItem = inventoryMap.get(cleanOptName);
    if (foundItem) {
      const daysRemaining = calculateDaysRemaining(foundItem.expirationDate, currentDate);
      const status = calculateExpirationStatus(foundItem.expirationDate, currentDate);
      
      matchedInventoryItems.push({
        foodItem: foundItem,
        quantityUsed: opt.quantity,
        daysRemaining,
        status
      });

      if (status === 'CRITICAL') zeroWasteScore += 25;
      else if (status === 'WARNING') zeroWasteScore += 10;
      else zeroWasteScore += 2;
    }
  }

  // Ordenar los ítems del inventario utilizados por urgencia de vencimiento (menor días restantes primero)
  matchedInventoryItems.sort((a, b) => a.daysRemaining - b.daysRemaining);

  const totalMandatory = mandatoryIngredients.length;
  const matchPercentage = totalMandatory === 0 
    ? 100.0 
    : Math.round((satisfiedMandatoryCount / totalMandatory) * 1000) / 10;

  const canBeCooked = missingIngredients.length === 0 && insufficientIngredients.length === 0;

  return {
    recipe,
    matchPercentage,
    canBeCooked,
    missingIngredients,
    insufficientIngredients,
    matchedInventoryItems,
    zeroWasteScore
  };
}

/**
 * Cruza los ingredientes disponibles en el inventario con una lista de recetas,
 * devolviendo las recetas viables y ordenadas inteligentemente para reducir desperdicio.
 * 
 * Criterio de Ordenamiento (CocinaCero Engine):
 * 1. Primero: Recetas 100% cocinables (`canBeCooked === true`).
 * 2. Segundo: Mayor `zeroWasteScore` (recetas que rescatan mayor cantidad de alimentos a punto de vencer).
 * 3. Tercero: Mayor porcentaje de coincidencia (`matchPercentage`).
 * 
 * @param inventory Lista de alimentos disponibles en casa
 * @param recipes Lista completa de recetas disponibles en catálogo
 * @param minMatchPercentage Porcentaje mínimo de coincidencia para incluir la receta (por defecto: 50%)
 * @param currentDate Fecha de referencia para cálculo de vencimiento
 */
export function findMatchingRecipes(
  inventory: FoodItem[],
  recipes: Recipe[],
  minMatchPercentage: number = 0,
  currentDate?: string | Date
): RecipeMatchResult[] {
  const results: RecipeMatchResult[] = [];

  for (const recipe of recipes) {
    const match = matchSingleRecipe(recipe, inventory, currentDate);
    if (match.matchPercentage >= minMatchPercentage || match.canBeCooked) {
      results.push(match);
    }
  }

  return results.sort((a, b) => {
    // 1. Prioridad principal: si se puede cocinar inmediatamente
    if (a.canBeCooked !== b.canBeCooked) {
      return a.canBeCooked ? -1 : 1;
    }
    // 2. Prioridad de aprovechamiento (Zero-Waste Score)
    if (a.zeroWasteScore !== b.zeroWasteScore) {
      return b.zeroWasteScore - a.zeroWasteScore;
    }
    // 3. Porcentaje de coincidencia
    return b.matchPercentage - a.matchPercentage;
  });
}
