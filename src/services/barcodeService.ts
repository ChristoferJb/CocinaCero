import { UnitOfMeasure, FoodCategory } from '../models/types';
import { normalizeText } from './recipeMatcherService';

export interface ProductLookupResult {
  barcode: string;
  name: string;
  normalizedName: string;
  quantity: number;
  unit: UnitOfMeasure;
  category: FoodCategory;
  suggestedDaysToExpiration: number;
  source: 'LOCAL_QR_DATABASE' | 'OPEN_FOOD_FACTS_API';
}

/**
 * Base de datos simulada y códigos QR de prueba para demostración instantánea
 * y emparejamiento con el motor Zero-Waste.
 */
export const MOCK_BARCODE_DATABASE: Record<string, Omit<ProductLookupResult, 'barcode' | 'normalizedName' | 'source'>> = {
  // Códigos QR de prueba / EAN estándar
  'QR-POLLO-789012': {
    name: 'Pollo Fresco Orgánico en Trozos',
    quantity: 500,
    unit: 'g',
    category: 'carnes_pescados',
    suggestedDaysToExpiration: 2 // CRITICAL para mostrar cómo entra al semáforo de inmediato
  },
  'QR-LECHE-123456': {
    name: 'Leche Descremada Entera',
    quantity: 1,
    unit: 'l',
    category: 'lacteos',
    suggestedDaysToExpiration: 4 // WARNING
  },
  'QR-MOZZARELLA-555888': {
    name: 'Queso Mozzarella Rallado Especial',
    quantity: 300,
    unit: 'g',
    category: 'lacteos',
    suggestedDaysToExpiration: 1 // CRITICAL
  },
  'QR-TOMATES-999000': {
    name: 'Tomates Cherry Frescos de Huerta',
    quantity: 450,
    unit: 'g',
    category: 'vegetales',
    suggestedDaysToExpiration: 2 // CRITICAL
  },
  'QR-HUEVOS-333444': {
    name: 'Huevos Frescos de Granja (12 unidades)',
    quantity: 12,
    unit: 'unidad',
    category: 'lacteos',
    suggestedDaysToExpiration: 12 // GOOD
  },
  'QR-ARROZ-777111': {
    name: 'Arroz Blanco Extra Grano Largo',
    quantity: 1,
    unit: 'kg',
    category: 'despensa',
    suggestedDaysToExpiration: 365 // GOOD
  },
  '7891000100103': { // EAN real de ejemplo
    name: 'Yogurt Griego Natural',
    quantity: 4,
    unit: 'unidad',
    category: 'lacteos',
    suggestedDaysToExpiration: 3
  }
};

/**
 * Obtiene sugerencia de días para expiración basados en la categoría del alimento
 */
export function getSuggestedDaysByCategory(category: FoodCategory): number {
  switch (category) {
    case 'carnes_pescados':
      return 3; // Carnes frescas duran poco
    case 'vegetales':
      return 5; // Vegetales frescos
    case 'lacteos':
      return 7; // Lácteos y huevos
    case 'frutas':
      return 7; // Frutas frescas
    case 'panaderia':
      return 5; // Panadería fresca
    case 'congelados':
      return 90; // Congelados duran meses
    case 'despensa':
      return 180; // Abarrotes y granos duran 6 meses aprox.
    case 'otros':
    default:
      return 14;
  }
}

/**
 * Intenta inferir la categoría culinaria combinando etiquetas de Open Food Facts y el nombre del producto.
 * Soporta términos comunes en inglés y español.
 */
function inferCategory(tags: string[] = [], productName: string = ''): FoodCategory {
  const searchStr = (tags.join(' ') + ' ' + productName).toLowerCase();
  
  if (searchStr.includes('meat') || searchStr.includes('chicken') || searchStr.includes('beef') || 
      searchStr.includes('fish') || searchStr.includes('carne') || searchStr.includes('pollo') || 
      searchStr.includes('res') || searchStr.includes('cerdo') || searchStr.includes('pescado') || 
      searchStr.includes('atun') || searchStr.includes('atún') || searchStr.includes('jamon') || 
      searchStr.includes('jamón') || searchStr.includes('tocino') || searchStr.includes('pavo') ||
      searchStr.includes('salchicha') || searchStr.includes('pork') || searchStr.includes('steak') ||
      searchStr.includes('chuleta')) {
    return 'carnes_pescados';
  }
  if (searchStr.includes('dairy') || searchStr.includes('milk') || searchStr.includes('cheese') || 
      searchStr.includes('yogurt') || searchStr.includes('leche') || searchStr.includes('queso') || 
      searchStr.includes('yogur') || searchStr.includes('mantequilla') || searchStr.includes('crema') || 
      searchStr.includes('huevo') || searchStr.includes('egg') || searchStr.includes('lacteo') || 
      searchStr.includes('lácteo') || searchStr.includes('mozzarella') || searchStr.includes('cheddar') ||
      searchStr.includes('parmesano') || searchStr.includes('ricotta') || searchStr.includes('suero')) {
    return 'lacteos';
  }
  if (searchStr.includes('vegetable') || searchStr.includes('tomato') || searchStr.includes('spinach') || 
      searchStr.includes('vegetal') || searchStr.includes('verdura') || searchStr.includes('tomate') || 
      searchStr.includes('papa') || searchStr.includes('cebolla') || searchStr.includes('lechuga') || 
      searchStr.includes('zanahoria') || searchStr.includes('aguacate') || searchStr.includes('ajo') ||
      searchStr.includes('brocoli') || searchStr.includes('brócoli') || searchStr.includes('pimiento') ||
      searchStr.includes('calabaza') || searchStr.includes('espinaca') || searchStr.includes('cilantro')) {
    return 'vegetales';
  }
  if (searchStr.includes('fruit') || searchStr.includes('apple') || searchStr.includes('banana') || 
      searchStr.includes('fruta') || searchStr.includes('manzana') || searchStr.includes('platano') || 
      searchStr.includes('plátano') || searchStr.includes('banano') || searchStr.includes('fresa') || 
      searchStr.includes('naranja') || searchStr.includes('limon') || searchStr.includes('limón') || 
      searchStr.includes('uva') || searchStr.includes('piña') || searchStr.includes('durazno') ||
      searchStr.includes('melon') || searchStr.includes('melón') || searchStr.includes('sandia') ||
      searchStr.includes('sandía') || searchStr.includes('cereza')) {
    return 'frutas';
  }
  if (searchStr.includes('bread') || searchStr.includes('bakery') || searchStr.includes('pan') || 
      searchStr.includes('galleta') || searchStr.includes('cookie') || searchStr.includes('torta') || 
      searchStr.includes('bizcocho') || searchStr.includes('pastel') || searchStr.includes('croissant') ||
      searchStr.includes('donas') || searchStr.includes('dona') || searchStr.includes('ponqué') ||
      searchStr.includes('tarta') || searchStr.includes('panadería') || searchStr.includes('repostería')) {
    return 'panaderia';
  }
  if (searchStr.includes('frozen') || searchStr.includes('ice cream') || searchStr.includes('congelado') || 
      searchStr.includes('helado') || searchStr.includes('nugget') || searchStr.includes('pizza') ||
      searchStr.includes('hielo')) {
    return 'congelados';
  }
  
  // Si no coincide con ninguna de las anteriores, por defecto es despensa
  return 'despensa';
}

/**
 * Extrae la cantidad y unidad de la cadena de texto de peso (ej. "500 g", "1 l", "330 ml").
 */
function parseQuantityAndUnit(quantityStr: string = ''): { quantity: number; unit: UnitOfMeasure } {
  const clean = quantityStr.toLowerCase().trim();
  const match = clean.match(/^([\d.,]+)\s*(kg|g|ml|l|unidad|piezas?)?/);
  
  if (match) {
    const qty = parseFloat(match[1].replace(',', '.')) || 1;
    const rawUnit = match[2] || 'unidad';
    let unit: UnitOfMeasure = 'unidad';
    
    if (rawUnit === 'kg') unit = 'kg';
    else if (rawUnit === 'g') unit = 'g';
    else if (rawUnit === 'ml') unit = 'ml';
    else if (rawUnit === 'l') unit = 'l';
    
    return { quantity: qty, unit };
  }
  
  return { quantity: 1, unit: 'unidad' };
}

/**
 * Consulta un código de barras o QR. Primero en la base de datos interna de prueba de CocinaCero
 * y luego en la API de Open Food Facts mundial si no se encuentra localmente.
 */
export async function lookupProductByBarcode(barcodeClean: string): Promise<ProductLookupResult | null> {
  const barcode = barcodeClean.trim();
  
  // 1. Detectar si es un QR con formato JSON dinámico o Query String (para etiquetas personalizadas en casa)
  const isJson = barcode.startsWith('{') && barcode.endsWith('}');
  const isQueryString = barcode.includes('name=') && barcode.includes('=');

  if (isJson || isQueryString) {
    try {
      let parsed: any = null;
      if (isJson) {
        // Corregir comillas simples a comillas dobles si las hay antes de parsear
        const cleanJson = barcode.replace(/'/g, '"');
        parsed = JSON.parse(cleanJson);
      } else {
        // Parsear formato Query String: name=Lentejas&quantity=1.5&unit=kg...
        parsed = {};
        const pairs = barcode.split('&');
        for (const pair of pairs) {
          const [key, val] = pair.split('=');
          if (key && val) {
            const decodedKey = decodeURIComponent(key.trim());
            const decodedVal = decodeURIComponent(val.trim());
            if (decodedKey === 'quantity' || decodedKey === 'expirationDays') {
              parsed[decodedKey] = parseFloat(decodedVal) || 0;
            } else {
              parsed[decodedKey] = decodedVal;
            }
          }
        }
      }

      if (parsed && typeof parsed === 'object') {
        const name = parsed.name || 'Producto Personalizado';
        const category = parsed.category || 'despensa';
        const defaultDays = getSuggestedDaysByCategory(category);
        const expirationDays = typeof parsed.expirationDays === 'number' ? parsed.expirationDays : parseInt(parsed.expirationDays) || defaultDays;

        return {
          barcode: 'CUSTOM-QR',
          name: name,
          normalizedName: normalizeText(name),
          quantity: typeof parsed.quantity === 'number' ? parsed.quantity : parseFloat(parsed.quantity) || 1,
          unit: parsed.unit || 'unidad',
          category: category,
          suggestedDaysToExpiration: expirationDays,
          source: 'LOCAL_QR_DATABASE'
        };
      }
    } catch (e) {
      console.warn("No se pudo procesar el código QR dinámico:", e);
    }
  }

  // 2. Verificar base local estática (MOCK_BARCODE_DATABASE)
  if (MOCK_BARCODE_DATABASE[barcode]) {
    const data = MOCK_BARCODE_DATABASE[barcode];
    return {
      barcode,
      name: data.name,
      normalizedName: normalizeText(data.name),
      quantity: data.quantity,
      unit: data.unit,
      category: data.category,
      suggestedDaysToExpiration: data.suggestedDaysToExpiration,
      source: 'LOCAL_QR_DATABASE'
    };
  }

  // 2. Consulta a Open Food Facts
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(barcode)}.json`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.status === 1 && json.product) {
        const prod = json.product;
        const name = prod.product_name_es || prod.product_name || prod.generic_name || `Producto Escaneado (#${barcode})`;
        const { quantity, unit } = parseQuantityAndUnit(prod.quantity);
        const category = inferCategory(prod.categories_tags, name);
        const suggestedDays = getSuggestedDaysByCategory(category);

        return {
          barcode,
          name: name.trim(),
          normalizedName: normalizeText(name),
          quantity,
          unit,
          category,
          suggestedDaysToExpiration: suggestedDays,
          source: 'OPEN_FOOD_FACTS_API'
        };
      }
    }
  } catch (err) {
    console.warn('No se pudo conectar a Open Food Facts o producto no registrado:', err);
  }

  return null;
}
