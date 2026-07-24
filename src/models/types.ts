/**
 * Modelado de Entidades del Dominio - CocinaCero
 * 
 * Este archivo define las estructuras fundamentales para el sistema:
 * 1. Alimentos en inventario (FoodItem)
 * 2. Recetas e ingredientes (Recipe, RecipeIngredient)
 * 3. Historial de consumo y desperdicio (ConsumptionLog)
 * 4. Alertas de vencimiento (ExpirationAlert)
 */

/** Unidades de medida soportadas para estandarización en inventario y recetas */
export type UnitOfMeasure = 
  | 'g'       // Gramos
  | 'kg'      // Kilogramos
  | 'ml'      // Mililitros
  | 'l'       // Litros
  | 'unidad'  // Unidades/piezas (ej. 3 manzanas, 2 huevos)
  | 'taza'    // Tazas estándar (~240ml/g)
  | 'cucharada' // Cucharada sopera (~15ml/g)
  | 'cucharadita'; // Cucharadita (~5ml/g)

/** Categorías de almacenamiento o tipo de alimento */
export type FoodCategory = 
  | 'lacteos'
  | 'vegetales'
  | 'frutas'
  | 'carnes_pescados'
  | 'despensa'
  | 'panaderia'
  | 'congelados'
  | 'otros';

/** Estado de vencimiento calculado según diferencia en días */
export type ExpirationStatus = 
  | 'EXPIRED'   // Vencido (días < 0)
  | 'CRITICAL'  // Crítico / Por vencer muy pronto (0 <= días <= 2)
  | 'WARNING'   // Advertencia / Por vencer pronto (3 <= días <= 5)
  | 'GOOD';     // Buen estado (días > 5)

/**
 * Entidad: Alimento en Inventario (FoodItem)
 * Representa un producto físico almacenado por el usuario en casa.
 */
export interface FoodItem {
  /** Identificador único del ítem (UUID) */
  id: string;
  /** Nombre visual o comercial del producto (ej. "Tomates Cherry Maduros") */
  name: string;
  /** 
   * Nombre normalizado para el algoritmo de matching (ej. "tomate").
   * Sin tildes, en minúsculas y en singular para cruzar eficientemente con recetas.
   */
  normalizedName: string;
  /** Cantidad actual disponible */
  quantity: number;
  /** Unidad de medida asociada a la cantidad */
  unit: UnitOfMeasure;
  /** Fecha de vencimiento en formato ISO (YYYY-MM-DD) o Date */
  expirationDate: string | Date;
  /** Categoría del alimento para agrupación visual */
  category: FoodCategory;
  /** Fecha de registro en el sistema */
  createdAt: string | Date;
  /** Estado actual de vencimiento (puede recalcularse dinámicamente) */
  status?: ExpirationStatus;
}

/**
 * Entidad: Ingrediente de una Receta (RecipeIngredient)
 * Define los requerimientos para preparar un plato.
 */
export interface RecipeIngredient {
  /** Nombre visual del ingrediente en la receta (ej. "Dientes de ajo picados") */
  name: string;
  /** Nombre normalizado para emparejar con FoodItem.normalizedName (ej. "ajo") */
  normalizedName: string;
  /** Cantidad requerida para la receta */
  quantity: number;
  /** Unidad de medida de la receta */
  unit: UnitOfMeasure;
  /** 
   * Si es true, la ausencia del ingrediente no impide cocinar la receta,
   * permitiendo sugerir platos aunque falte un decorativo o especia opcional.
   */
  isOptional: boolean;
}

/**
 * Entidad: Receta (Recipe)
 * Representa una preparación culinaria sugerida al usuario.
 */
export interface Recipe {
  /** Identificador único de la receta */
  id: string;
  /** Título del plato (ej. "Tortilla de Espinacas y Queso") */
  title: string;
  /** Breve descripción del plato */
  description: string;
  /** Tiempo estimado de preparación en minutos */
  prepTimeMinutes: number;
  /** Porciones que rinde la receta con las cantidades especificadas */
  servings: number;
  /** Lista de ingredientes requeridos y opcionales */
  ingredients: RecipeIngredient[];
  /** Pasos ordenados para la preparación */
  instructions: string[];
  /** Etiquetas temáticas (ej. ["aprovechamiento", "rapido", "vegetariano"]) */
  tags: string[];
}

/**
 * Entidad: Registro de Consumo y Desperdicio (ConsumptionLog)
 * Permite auditar qué ingredientes se aprovechan y cuáles terminan en la basura,
 * generando métricas de impacto económico y ecológico.
 */
export interface ConsumptionLog {
  /** Identificador único del registro */
  id: string;
  /** ID del alimento asociado (si existe aún o existió en inventario) */
  foodItemId: string;
  /** Nombre del alimento registrado */
  foodItemName: string;
  /** Cantidad consumida o desechada */
  quantity: number;
  /** Unidad de medida */
  unit: UnitOfMeasure;
  /** Acción realizada: Consumo (aprovechado) o Desecho (basura) */
  action: 'CONSUMED' | 'DISCARDED';
  /** Razón técnica de la acción */
  reason: 'EATEN_IN_RECIPE' | 'EATEN_AS_SNACK' | 'EXPIRED_SPOILED' | 'ACCIDENTAL_LOSS' | 'OTHER';
  /** Fecha en que se registró la acción */
  timestamp: string | Date;
  /** Estimación en moneda local del valor rescatado o perdido (opcional para métricas) */
  estimatedMonetaryValue?: number;
}

/**
 * Entidad: Alerta de Vencimiento (ExpirationAlert)
 * Estructura para notificaciones in-app o push para alertar al usuario.
 */
export interface ExpirationAlert {
  /** ID del alimento que generó la alerta */
  foodItemId: string;
  /** Nombre del alimento */
  foodItemName: string;
  /** Fecha de vencimiento original */
  expirationDate: string;
  /** Diferencia calculada en días enteros desde la fecha actual */
  daysRemaining: number;
  /** Estado de urgencia */
  status: ExpirationStatus;
  /** Mensaje legible preparado para notificación (ej. "¡Tu pollo vence mañana!") */
  message: string;
  /** Nivel de prioridad para ordenar notificaciones (1 = máxima urgencia) */
  priority: number;
}

/**
 * Resultado del Algoritmo de Matching para una Receta
 */
export interface RecipeMatchResult {
  /** La receta evaluada */
  recipe: Recipe;
  /** Porcentaje de emparejamiento (0.0 a 100.0) basado en ingredientes obligatorios satisfechos */
  matchPercentage: number;
  /** Indica si el usuario tiene TODOS los ingredientes obligatorios y en cantidad suficiente */
  canBeCooked: boolean;
  /** Lista de ingredientes obligatorios que faltan por completo en inventario */
  missingIngredients: RecipeIngredient[];
  /** Lista de ingredientes que están en inventario pero su cantidad no alcanza el mínimo */
  insufficientIngredients: {
    ingredient: RecipeIngredient;
    availableQuantity: number;
    requiredQuantity: number;
    unit: UnitOfMeasure;
  }[];
  /** 
   * Ingredientes del inventario que se utilizarán en esta receta.
   * Ordenados por urgencia de vencimiento para promover el "Aprovechamiento Máximo".
   */
  matchedInventoryItems: {
    foodItem: FoodItem;
    quantityUsed: number;
    daysRemaining: number;
    status: ExpirationStatus;
  }[];
  /** Puntaje extra por usar ingredientes críticos/a punto de vencer (para ordenamiento) */
  zeroWasteScore: number;
}
