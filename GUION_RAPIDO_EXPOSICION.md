# GUION RÁPIDO Y DIRECTO DE EXPOSICIÓN — COCINACERO
*Versión ultra-optimizada para hablar rápido, directo y con alto impacto técnico frente al docente Ing. Gabriel Morejón*

---

### ⏱️ TIEMPO TOTAL: 3 A 4 MINUTOS (45-60 SEGUNDOS POR INTEGRANTE)

---

### 👤 1. BARZOLA INDARTE CHRISTOFER JESUS (Diapositivas 1, 2 y 3)
**Tema**: Qué se hizo y qué problema resuelve.

> *"Buenas tardes Ing. Gabriel Morejón y compañeros. Nuestro equipo presenta **CocinaCero**, una aplicación móvil desarrollada para combatir el desperdicio de alimentos en los hogares.
> 
> **¿Qué hicimos?** Creamos un sistema que combina un inventario con **semáforo de vencimiento** y un **motor de recetas dinámicas**.
> 
> **¿Qué problema resolvemos?** La gente desperdicia comida por dos razones cotidianas: 
> 1. **Invisibilidad**: No saben qué insumos tienen ni cuándo vencen.
> 2. **Bloqueo creativo**: No saben qué cocinar con lo que les queda guardado. 
> 
> CocinaCero organiza la despensa y te dice qué cocinar hoy usando **primero** lo que está más cerca de vencer. Le doy paso a mi compañero Blair para explicar las funciones."*

---

### 👤 2. DELGADO CORNEJO BLAIR STEVEN (Diapositivas 4 y 5)
**Tema**: Qué funciones tiene la aplicación.

> *"Gracias Christofer. **¿Qué funciones implementamos en la app?**
> 
> 1. **Semáforo Dinámico**: Clasifica automáticamente los alimentos en 4 colores: *Vencido* (rojo), *Crítico* (0-2 días en naranja), *Advertencia* (3-5 días en amarillo) y *Óptimo* (verde).
> 2. **Lector Multiprotocolo de Cámara**:
>    * **Para productos de supermercado**: Escanea el código de barras y consulta la API de **Open Food Facts** para autocompletar nombre y categoría.
>    * **Para productos locales**: Escanea **códigos QR propios** (en JSON o Query String) que registran el producto en 0 milisegundos sin internet.
> 3. **Historial de Consumo**: Mide en dólares el dinero rescatado e insumos salvados. 
> 
> Ahora mi compañero Michael explicará la arquitectura y tecnologías."*

---

### 👤 3. PALMA NAVARRETE MICHAEL AGUSTIN (Diapositivas 6, 7 y 8)
**Tema**: Qué tecnologías usaron y POR QUÉ.

> *"Gracias Blair. **¿Qué tecnologías usamos y por qué?**
> 
> 1. **React 18 & TypeScript**: ¿Por qué? Porque React nos da una interfaz web reactiva y TypeScript aporta tipado estricto (`types.ts`), evitando errores de datos antes de compilar.
> 2. **Ionic React & Capacitor 6**: ¿Por qué? Ionic nos da componentes móviles nativos. Capacitor envuelve la web en una WebView nativa de Android (`CocinaCero.apk`), permitiéndonos usar librerías de cámara web sin escribir código Java pesado.
> 3. **Estructuras en Memoria**: Indexamos la despensa usando `Map` de JavaScript para lograr búsquedas ultra rápidas en tiempo $O(1)$, preparados para escalar a Capacitor SQLite.
> 
> Le doy paso a Leiber para explicar el algoritmo y la demostración."*

---

### 👤 4. ZAMBRANO CHAVEZ LEIBER VALENTIN (Diapositivas 9 y 10 + Demo)
**Tema**: Cómo funciona el algoritmo de recetas y Cierre.

> *"Gracias Michael. **¿Cómo funciona el cerebro del programa?**
> 
> El motor funciona con un algoritmo propio llamado **Zero-Waste Score**:
> 1. **Normaliza texto**: Entiende que 'huevos' y 'huevo' son lo mismo.
> 2. **Convierte unidades**: Si la receta pide 200g de pollo y tienes 0.5kg, calcula la equivalencia automática.
> 3. **Premia alimentos críticos**: Si una receta usa un ingrediente que vence en menos de 48 horas, le otorga +50 puntos de premio a esa receta y la **sube al primer lugar del menú**.
> 
> *(Mostrando la app en vivo o capturas)* Como ven, el usuario ve primero qué cocinar para no botar comida. Respaldamos todo con **16 pruebas unitarias en Vitest**.
> 
> Muchas gracias Ing. Morejón, quedamos listos para sus preguntas."*
