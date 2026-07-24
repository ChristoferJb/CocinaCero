import { FoodItem, ExpirationStatus, ExpirationAlert } from '../models/types';

/**
 * Normaliza una fecha o string ISO a un objeto Date a las 00:00:00 UTC
 * para calcular diferencias precisas en días calendarios sin desviación por zona horaria.
 */
export function normalizeToMidnightUTC(dateInput: string | Date): Date {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : new Date(dateInput.getTime());
  // Normalizar a medianoche UTC
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/**
 * Calcula la diferencia exacta en días enteros entre la fecha de vencimiento y la fecha actual.
 * 
 * @param expirationDate Fecha de vencimiento (string ISO o Date)
 * @param currentDate Fecha actual de referencia (por defecto: hoy a medianoche UTC)
 * @returns Número entero de días restantes:
 *          - negativo (< 0): ya venció
 *          - 0: vence exactamente hoy
 *          - positivo (> 0): días en el futuro
 */
export function calculateDaysRemaining(
  expirationDate: string | Date,
  currentDate?: string | Date
): number {
  const targetDate = normalizeToMidnightUTC(expirationDate);
  const now = currentDate ? normalizeToMidnightUTC(currentDate) : normalizeToMidnightUTC(new Date());

  const diffInMilliseconds = targetDate.getTime() - now.getTime();
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  return Math.round(diffInMilliseconds / millisecondsPerDay);
}

/**
 * Determina el estado de vencimiento en base a la diferencia de días.
 * Lógica de negocio (Reto Técnico 1):
 * - EXPIRED: días < 0 (El producto ya pasó su fecha de vencimiento).
 * - CRITICAL: 0 <= días <= 2 (Vence hoy, mañana o pasado mañana - ¡Atención inmediata!).
 * - WARNING: 3 <= días <= 5 (Vence en los próximos 3 a 5 días - Planificar consumo).
 * - GOOD: días > 5 (Producto en óptimas condiciones de conservación).
 * 
 * @param expirationDate Fecha de vencimiento del producto
 * @param currentDate Fecha actual opcional para inyección de dependencias y testing
 */
export function calculateExpirationStatus(
  expirationDate: string | Date,
  currentDate?: string | Date
): ExpirationStatus {
  const days = calculateDaysRemaining(expirationDate, currentDate);

  if (days < 0) {
    return 'EXPIRED';
  } else if (days <= 2) {
    return 'CRITICAL';
  } else if (days <= 5) {
    return 'WARNING';
  } else {
    return 'GOOD';
  }
}

/**
 * Genera un mensaje comprensible y amigable según el estado de vencimiento.
 */
export function generateAlertMessage(foodName: string, daysRemaining: number, status: ExpirationStatus): string {
  switch (status) {
    case 'EXPIRED':
      const absDays = Math.abs(daysRemaining);
      return absDays === 1 
        ? `¡Atención! "${foodName}" venció ayer. Revisa su estado antes de consumirlo o deséchalo.`
        : `¡Atención! "${foodName}" venció hace ${absDays} días.`;
    case 'CRITICAL':
      if (daysRemaining === 0) {
        return `¡Urgente! "${foodName}" vence HOY. ¡Cocínalo en tu próxima comida!`;
      } else if (daysRemaining === 1) {
        return `¡Alerta! "${foodName}" vence MAÑANA. Prioriza su uso.`;
      } else {
        return `"${foodName}" vence en 2 días. Busca recetas para aprovecharlo.`;
      }
    case 'WARNING':
      return `"${foodName}" vencerá en ${daysRemaining} días. Tenlo en mente al planificar tu semana.`;
    case 'GOOD':
      return `"${foodName}" está en buen estado (vence en ${daysRemaining} días).`;
  }
}

/**
 * Analiza un inventario completo de alimentos y genera una lista ordenada de alertas de vencimiento.
 * Prepara la arquitectura para alimentar sistemas de notificaciones automáticas (push/email/in-app).
 * 
 * @param inventory Lista de alimentos (FoodItem[])
 * @param currentDate Fecha de referencia opcional
 * @param includeGoodStatus Si es true, incluye ítems con estado 'GOOD' en la respuesta
 */
export function getExpirationAlerts(
  inventory: FoodItem[],
  currentDate?: string | Date,
  includeGoodStatus: boolean = false
): ExpirationAlert[] {
  const alerts: ExpirationAlert[] = [];

  for (const item of inventory) {
    const daysRemaining = calculateDaysRemaining(item.expirationDate, currentDate);
    const status = calculateExpirationStatus(item.expirationDate, currentDate);

    if (status === 'GOOD' && !includeGoodStatus) {
      continue;
    }

    // Calcular prioridad para orden de notificación (menor número = mayor urgencia en cola de notificaciones)
    let priority = 4;
    if (status === 'EXPIRED') priority = 1;
    else if (status === 'CRITICAL') priority = 2;
    else if (status === 'WARNING') priority = 3;

    alerts.push({
      foodItemId: item.id,
      foodItemName: item.name,
      expirationDate: typeof item.expirationDate === 'string' 
        ? item.expirationDate 
        : item.expirationDate.toISOString().split('T')[0],
      daysRemaining,
      status,
      message: generateAlertMessage(item.name, daysRemaining, status),
      priority
    });
  }

  // Ordenar alertas: primero prioridad más baja en número (1=EXPIRED, 2=CRITICAL), luego por días restantes en orden ascendente
  return alerts.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return a.daysRemaining - b.daysRemaining;
  });
}
