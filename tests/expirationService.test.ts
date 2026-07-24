import { describe, it, expect } from 'vitest';
import { 
  calculateDaysRemaining, 
  calculateExpirationStatus, 
  getExpirationAlerts, 
  normalizeToMidnightUTC 
} from '../src/services/expirationService';
import { FoodItem } from '../src/models/types';

describe('ExpirationService - Pruebas Unitarias para Lógica de Alertas de Vencimiento', () => {
  // Definimos una fecha base fija (ej. 13 de julio de 2026) para que los tests sean deterministas
  const MOCK_CURRENT_DATE = '2026-07-13';

  describe('calculateDaysRemaining (Cálculo de diferencia en días)', () => {
    it('debe retornar número negativo (< 0) cuando la fecha ya pasó (vencido)', () => {
      const expiration = '2026-07-10'; // 3 días atrás
      const days = calculateDaysRemaining(expiration, MOCK_CURRENT_DATE);
      expect(days).toBe(-3);
    });

    it('debe retornar exactamente 0 cuando el alimento vence hoy', () => {
      const expiration = '2026-07-13';
      const days = calculateDaysRemaining(expiration, MOCK_CURRENT_DATE);
      expect(days).toBe(0);
    });

    it('debe retornar 1 o 2 cuando el alimento vence mañana o pasado mañana', () => {
      expect(calculateDaysRemaining('2026-07-14', MOCK_CURRENT_DATE)).toBe(1);
      expect(calculateDaysRemaining('2026-07-15', MOCK_CURRENT_DATE)).toBe(2);
    });

    it('debe retornar número positivo mayor a 5 cuando el alimento está en buen estado a largo plazo', () => {
      const expiration = '2026-07-25'; // 12 días en el futuro
      const days = calculateDaysRemaining(expiration, MOCK_CURRENT_DATE);
      expect(days).toBe(12);
    });
  });

  describe('calculateExpirationStatus (Identificación del Estado según el Reto Técnico)', () => {
    it('debe clasificar como EXPIRED cuando los días son menores a 0', () => {
      expect(calculateExpirationStatus('2026-07-01', MOCK_CURRENT_DATE)).toBe('EXPIRED');
      expect(calculateExpirationStatus('2026-07-12', MOCK_CURRENT_DATE)).toBe('EXPIRED');
    });

    it('debe clasificar como CRITICAL cuando los días están entre 0 y 2 inclusive (¡Atención inmediata!)', () => {
      expect(calculateExpirationStatus('2026-07-13', MOCK_CURRENT_DATE)).toBe('CRITICAL'); // 0 días
      expect(calculateExpirationStatus('2026-07-14', MOCK_CURRENT_DATE)).toBe('CRITICAL'); // 1 día
      expect(calculateExpirationStatus('2026-07-15', MOCK_CURRENT_DATE)).toBe('CRITICAL'); // 2 días
    });

    it('debe clasificar como WARNING cuando los días están entre 3 y 5 inclusive (Por vencer pronto)', () => {
      expect(calculateExpirationStatus('2026-07-16', MOCK_CURRENT_DATE)).toBe('WARNING'); // 3 días
      expect(calculateExpirationStatus('2026-07-17', MOCK_CURRENT_DATE)).toBe('WARNING'); // 4 días
      expect(calculateExpirationStatus('2026-07-18', MOCK_CURRENT_DATE)).toBe('WARNING'); // 5 días
    });

    it('debe clasificar como GOOD cuando la fecha supera los 5 días de margen', () => {
      expect(calculateExpirationStatus('2026-07-19', MOCK_CURRENT_DATE)).toBe('GOOD'); // 6 días
      expect(calculateExpirationStatus('2026-08-01', MOCK_CURRENT_DATE)).toBe('GOOD'); // 19 días
    });
  });

  describe('getExpirationAlerts (Generación y Ordenamiento del Feed de Alertas)', () => {
    const sampleInventory: FoodItem[] = [
      {
        id: '1',
        name: 'Arroz Blanco',
        normalizedName: 'arroz',
        quantity: 1,
        unit: 'kg',
        expirationDate: '2026-10-01', // Buen estado (GOOD)
        category: 'despensa',
        createdAt: '2026-07-01'
      },
      {
        id: '2',
        name: 'Pollo Fresco',
        normalizedName: 'pollo',
        quantity: 500,
        unit: 'g',
        expirationDate: '2026-07-14', // Vence mañana (CRITICAL - prioridad 2)
        category: 'carnes_pescados',
        createdAt: '2026-07-10'
      },
      {
        id: '3',
        name: 'Leche Abierta',
        normalizedName: 'leche',
        quantity: 250,
        unit: 'ml',
        expirationDate: '2026-07-11', // Venció hace 2 días (EXPIRED - prioridad 1)
        category: 'lacteos',
        createdAt: '2026-07-05'
      },
      {
        id: '4',
        name: 'Yogurt Griego',
        normalizedName: 'yogurt',
        quantity: 4,
        unit: 'unidad',
        expirationDate: '2026-07-17', // Vence en 4 días (WARNING - prioridad 3)
        category: 'lacteos',
        createdAt: '2026-07-05'
      }
    ];

    it('debe filtrar los productos en buen estado por defecto para reducir ruido visual', () => {
      const alerts = getExpirationAlerts(sampleInventory, MOCK_CURRENT_DATE, false);
      
      const goodItems = alerts.filter(a => a.status === 'GOOD');
      expect(goodItems.length).toBe(0);
      expect(alerts.length).toBe(3); // Pollo, Leche y Yogurt
    });

    it('debe ordenar las alertas por máxima urgencia (EXPIRED primero, luego CRITICAL, luego WARNING)', () => {
      const alerts = getExpirationAlerts(sampleInventory, MOCK_CURRENT_DATE, false);
      
      expect(alerts[0].foodItemName).toBe('Leche Abierta'); // EXPIRED (Prioridad 1)
      expect(alerts[0].status).toBe('EXPIRED');
      
      expect(alerts[1].foodItemName).toBe('Pollo Fresco'); // CRITICAL (Prioridad 2)
      expect(alerts[1].status).toBe('CRITICAL');
      
      expect(alerts[2].foodItemName).toBe('Yogurt Griego'); // WARNING (Prioridad 3)
      expect(alerts[2].status).toBe('WARNING');
    });

    it('debe generar mensajes humanizados acordes al estado de vencimiento', () => {
      const alerts = getExpirationAlerts(sampleInventory, MOCK_CURRENT_DATE, false);
      
      const expiredAlert = alerts.find(a => a.status === 'EXPIRED');
      expect(expiredAlert?.message).toContain('venció hace 2 días');

      const criticalAlert = alerts.find(a => a.status === 'CRITICAL');
      expect(criticalAlert?.message).toContain('vence MAÑANA');

      const warningAlert = alerts.find(a => a.status === 'WARNING');
      expect(warningAlert?.message).toContain('vencerá en 4 días');
    });
  });
});
