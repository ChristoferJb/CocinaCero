import { FoodItem, Recipe, ConsumptionLog } from '../models/types';
import { normalizeText } from '../services/recipeMatcherService';

/**
 * Datos iniciales pre-cargados para la demostración interactiva de CocinaCero.
 * Sin emojis y con tipado estricto al 100% compatible con la entidad Recipe.
 */

export const INITIAL_INVENTORY: FoodItem[] = [
  {
    id: 'inv-1',
    name: 'Pechuga de Pollo Fresca',
    normalizedName: normalizeText('Pechuga de Pollo Fresca'),
    quantity: 600,
    unit: 'g',
    expirationDate: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0], // Mañana (CRITICAL)
    category: 'carnes_pescados',
    createdAt: new Date().toISOString().split('T')[0]
  },
  {
    id: 'inv-2',
    name: 'Tomates Cherry Frescos',
    normalizedName: normalizeText('Tomates Cherry Frescos'),
    quantity: 400,
    unit: 'g',
    expirationDate: new Date(Date.now() + 86400000 * 0).toISOString().split('T')[0], // Hoy (CRITICAL)
    category: 'vegetales',
    createdAt: new Date().toISOString().split('T')[0]
  },
  {
    id: 'inv-3',
    name: 'Queso Mozzarella',
    normalizedName: normalizeText('Queso Mozzarella'),
    quantity: 250,
    unit: 'g',
    expirationDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0], // 4 días (WARNING)
    category: 'lacteos',
    createdAt: new Date().toISOString().split('T')[0]
  },
  {
    id: 'inv-4',
    name: 'Espinacas Frescas Orgánicas',
    normalizedName: normalizeText('Espinacas Frescas Orgánicas'),
    quantity: 150,
    unit: 'g',
    expirationDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 días (CRITICAL)
    category: 'vegetales',
    createdAt: new Date().toISOString().split('T')[0]
  },
  {
    id: 'inv-5',
    name: 'Huevos de Granja',
    normalizedName: normalizeText('Huevos de Granja'),
    quantity: 8,
    unit: 'unidad',
    expirationDate: new Date(Date.now() + 86400000 * 12).toISOString().split('T')[0], // 12 días (GOOD)
    category: 'lacteos',
    createdAt: new Date().toISOString().split('T')[0]
  },
  {
    id: 'inv-6',
    name: 'Arroz Blanco Grano Largo',
    normalizedName: normalizeText('Arroz Blanco Grano Largo'),
    quantity: 1.5,
    unit: 'kg',
    expirationDate: new Date(Date.now() + 86400000 * 180).toISOString().split('T')[0], // 180 días (GOOD)
    category: 'despensa',
    createdAt: new Date().toISOString().split('T')[0]
  },
  {
    id: 'inv-7',
    name: 'Yogurt Griego Natural',
    normalizedName: normalizeText('Yogurt Griego Natural'),
    quantity: 500,
    unit: 'g',
    expirationDate: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], // Ayer (EXPIRED)
    category: 'lacteos',
    createdAt: new Date().toISOString().split('T')[0]
  }
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    title: 'Wok de Pollo y Tomates Cherry',
    description: 'Una receta exprés para aprovechar al máximo el pollo y los tomates a punto de caducar.',
    prepTimeMinutes: 20,
    servings: 2,
    instructions: [
      'Cortar la pechuga de pollo en cubos medianos y salpimentar al gusto.',
      'Calentar una sartén o wok con un chorrito de aceite de oliva a fuego alto.',
      'Dorar el pollo durante 6-8 minutos hasta que esté bien cocido por dentro.',
      'Añadir los tomates cherry enteros o cortados a la mitad junto con las espinacas frescas.',
      'Saltear durante 3 minutos hasta que los tomates suelten sus jugos y servir caliente sobre arroz o solo.'
    ],
    ingredients: [
      {
        name: 'Pechuga de Pollo Fresca',
        normalizedName: normalizeText('Pechuga de Pollo Fresca'),
        quantity: 400,
        unit: 'g',
        isOptional: false
      },
      {
        name: 'Tomates Cherry Frescos',
        normalizedName: normalizeText('Tomates Cherry Frescos'),
        quantity: 250,
        unit: 'g',
        isOptional: false
      },
      {
        name: 'Espinacas Frescas Orgánicas',
        normalizedName: normalizeText('Espinacas Frescas Orgánicas'),
        quantity: 50,
        unit: 'g',
        isOptional: true
      }
    ],
    tags: ['aprovechamiento', 'proteico', 'rapido']
  },
  {
    id: 'rec-2',
    title: 'Tortilla Verde de Espinacas, Queso y Huevos',
    description: 'Ideal para el desayuno o cena. Rescata las espinacas frescas y aprovecha la cremosidad del queso.',
    prepTimeMinutes: 15,
    servings: 2,
    instructions: [
      'Batir 4 huevos en un tazón con una pizca de sal y pimienta.',
      'Picar las espinacas en tiras finas e incorporarlas al huevo batido.',
      'Calentar una sartén antiadherente a fuego medio y verter la mezcla.',
      'Cuando los bordes comiencen a cuajar, añadir el queso mozzarella desmenuzado en el centro.',
      'Doblar la tortilla por la mitad, dejar fundir el queso por 2 minutos y servir.'
    ],
    ingredients: [
      {
        name: 'Huevos de Granja',
        normalizedName: normalizeText('Huevos de Granja'),
        quantity: 4,
        unit: 'unidad',
        isOptional: false
      },
      {
        name: 'Espinacas Frescas Orgánicas',
        normalizedName: normalizeText('Espinacas Frescas Orgánicas'),
        quantity: 100,
        unit: 'g',
        isOptional: false
      },
      {
        name: 'Queso Mozzarella',
        normalizedName: normalizeText('Queso Mozzarella'),
        quantity: 100,
        unit: 'g',
        isOptional: false
      }
    ],
    tags: ['desayuno', 'vegetariano', 'keto']
  },
  {
    id: 'rec-3',
    title: 'Ensalada Caprese Mediterránea Rápida',
    description: 'Un clásico fresco y saludable donde el queso mozzarella y los tomates cherry brillan sin necesidad de cocción.',
    prepTimeMinutes: 10,
    servings: 2,
    instructions: [
      'Lavar los tomates cherry y cortarlos por la mitad.',
      'Cortar el queso mozzarella en cubos pequeños o rodajas.',
      'Mezclar en un bowl junto con hojas de espinaca como cama verde.',
      'Aderezar con aceite de oliva virgen extra, sal en escamas y un toque de aceto balsámico o limón.'
    ],
    ingredients: [
      {
        name: 'Tomates Cherry Frescos',
        normalizedName: normalizeText('Tomates Cherry Frescos'),
        quantity: 200,
        unit: 'g',
        isOptional: false
      },
      {
        name: 'Queso Mozzarella',
        normalizedName: normalizeText('Queso Mozzarella'),
        quantity: 150,
        unit: 'g',
        isOptional: false
      },
      {
        name: 'Espinacas Frescas Orgánicas',
        normalizedName: normalizeText('Espinacas Frescas Orgánicas'),
        quantity: 50,
        unit: 'g',
        isOptional: true
      }
    ],
    tags: ['ensalada', 'crudo', 'rapido']
  },
  {
    id: 'rec-4',
    title: 'Bowl Proteico de Arroz Blanco con Pollo Doradito',
    description: 'Plato nutritivo y equilibrado. Perfecto para meal-prep o almuerzo fuerte en familia.',
    prepTimeMinutes: 30,
    servings: 3,
    instructions: [
      'Cocinar 300g de arroz blanco en agua con sal hasta que esté tierno y esponjoso.',
      'Sazonar la pechuga de pollo con ajo, sal y paprika.',
      'Dorar el pollo en una sartén con una cucharada de aceite hasta que esté bien cocido y dorado por fuera.',
      'Cortar en rebanadas y servir sobre una base generosa de arroz caliente.'
    ],
    ingredients: [
      {
        name: 'Arroz Blanco Grano Largo',
        normalizedName: normalizeText('Arroz Blanco Grano Largo'),
        quantity: 300,
        unit: 'g',
        isOptional: false
      },
      {
        name: 'Pechuga de Pollo Fresca',
        normalizedName: normalizeText('Pechuga de Pollo Fresca'),
        quantity: 350,
        unit: 'g',
        isOptional: false
      }
    ],
    tags: ['familiar', 'meal-prep', 'proteico']
  }
];

export const INITIAL_CONSUMPTION_LOG: ConsumptionLog[] = [
  {
    id: 'log-1',
    foodItemId: 'inv-old-1',
    foodItemName: 'Leche Descremada 1L',
    quantity: 1,
    unit: 'l',
    action: 'CONSUMED',
    reason: 'EATEN_IN_RECIPE',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    estimatedMonetaryValue: 3.80
  },
  {
    id: 'log-2',
    foodItemId: 'inv-old-2',
    foodItemName: 'Pan Integral Tajado',
    quantity: 1,
    unit: 'unidad',
    action: 'DISCARDED',
    reason: 'EXPIRED_SPOILED',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    estimatedMonetaryValue: 2.50
  }
];
