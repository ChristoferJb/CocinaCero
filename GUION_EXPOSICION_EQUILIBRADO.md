# GUION DE EXPOSICIÓN EQUILIBRADO: COCINACERO
*Presentación clara, fluida y profesional (Nivel técnico intermedio: ideal para docentes y jurados)*

---

## 🎯 RESUMEN DE LA ESTRATEGIA
* **Duración total**: 4 a 5 minutos.
* **Tono**: Explicación clara del problema y demostración visual en vivo, mencionando los componentes técnicos clave sin abrumar con código interminable.
* **Equilibrio técnico (50/50)**: Enfoque en *para qué sirve la app*, respaldada por *cómo la construimos por dentro*.

---

## ⏱️ PASO 1: LA INTRODUCCIÓN Y EL PROBLEMA (1 minuto)

### 🖥️ Qué mostrar en pantalla:
Abre la aplicación en el navegador o celular mostrando el **Dashboard Principal** (con las tarjetas de colores y las estadísticas).

### 🗣️ Lo que vas a decir:
> "Buenas tardes. Hoy les presentamos **CocinaCero**, una aplicación móvil diseñada para resolver un problema cotidiano que nos afecta a todos: el desperdicio de comida en el hogar.
> 
> Todos hemos pasado por lo mismo: compramos alimentos, se quedan olvidados en el fondo del refrigerador y cuando nos acordamos, ya están vencidos. Esto no solo es un desperdicio de dinero, sino también un problema ambiental.
> 
> CocinaCero nace para solucionar esto atacando dos frentes: **visibilidad clara de la despensa** mediante un semáforo de colores inteligente, y un **motor de recetas** que te dice qué cocinar según lo que tienes guardado, dándole prioridad a lo que se va a vencer primero."

---

## ⏱️ PASO 2: DEMOSTRACIÓN EN VIVO Y ESCANEO (1.5 minutos)

### 🖥️ Qué mostrar en pantalla:
1. Haz clic en la pestaña **Despensa**. Muestra cómo se ven los productos filtrados por los botones *Críticos*, *Por Vencer*, *Óptimos*.
2. Abre el modal de **Añadir Alimento** y presiona el botón de **Escanear Código**.

### 🗣️ Lo que vas a decir:
> "Como ven en la pantalla, la aplicación clasifica los productos automáticamente en un semáforo:
> * **Rojo o Naranja**: Alimentos críticos que vencen en 2 días o menos.
> * **Amarillo**: Alimentos en advertencia (3 a 5 días).
> * **Verde**: Alimentos en estado óptimo.
> 
> Registrar un producto es muy fácil. Al presionar el escáner, la app usa la cámara del celular. Si escaneamos un código de barras de supermercado, se conecta a una base de datos mundial (**Open Food Facts**) y nos autocompleta el nombre y la categoría. 
> 
> También creamos un **lector de códigos QR propios**. Si escanearmos un QR de mercado local, la app lee los datos al instante sin necesidad de estar conectados a internet."

---

## ⏱️ PASO 3: LA MAGIA TÉCNICA Y EL ALGORITMO ZERO-WASTE (1.5 minutos)

### 🖥️ Qué mostrar en pantalla:
Pásate a la pestaña **Recetas** y abre una receta para mostrar los ingredientes que coinciden y los que faltan.

### 🗣️ Lo que vas a decir:
> "Ahora, la parte más inteligente de la app es su **Motor de Recomendación de Recetas**. 
> 
> No es un simple buscador de texto. Por detrás, la aplicación utiliza **TypeScript** y un algoritmo propio llamado **Zero-Waste Score**:
> 1. **Normaliza las palabras**: Si en la despensa dice 'huevos' en plural y la receta pide 'huevo' en singular, el sistema entiende que es el mismo ingrediente.
> 2. **Convierte unidades automáticamente**: Si una receta pide 200 gramos de pollo y tú tienes 0.5 kilos registrados, la app calcula la equivalencia y confirma que sí te alcanza.
> 3. **Premia a las recetas salvadoras**: Si una receta utiliza un ingrediente que está a punto de vencer en tu refrigerador, la app le otorga puntos extra a esa receta y la **sube al primer lugar del menú**. Así, el usuario siempre ve primero los platos que evitan que la comida se eche a perder."

---

## ⏱️ PASO 4: ARQUITECTURA Y CALIDAD DE SOFTWARE (1 minuto)

### 🖥️ Qué mostrar en pantalla:
Abre brevemente la terminal y ejecuta las pruebas automáticas (`npm test`) para mostrar la pantalla verde de Vitest pasando los 16 tests.

### 🗣️ Lo que vas a decir:
> "A nivel de arquitectura y desarrollo:
> * Construimos la app utilizando **React 18** e **Ionic React** para que la interfaz se sienta rápida y moderna.
> * Usamos **Capacitor 6** para empaquetarla como una aplicación nativa instalable en Android (`CocinaCero.apk`).
> * Cuidamos mucho los detalles de calidad: corregimos un problema de decimales en las cantidades para que el usuario pueda sumar o restar kilos y gramos de forma exacta (por ejemplo $1.56\text{ kg}$), y aseguramos que la cámara pida permisos correctamente desde el inicio.
> 
> Como pueden ver en la consola, respaldamos la lógica con **16 pruebas unitarias automatizadas** que garantizan que los cálculos de vencimiento y recetas siempre funcionen sin errores."

---

## ⏱️ PASO 5: CIERRE Y PREGUNTAS (30 segundos)

### 🗣️ Lo que vas a decir:
> "En resumen, CocinaCero es una herramienta práctica, accesible y con base técnica sólida que ayuda a las familias a ahorrar dinero y cuidar el medio ambiente cocinando mejor.
> 
> Quedamos abiertos a sus preguntas o a probar cualquier función que deseen ver en detalle. ¡Muchas gracias!"

---

## 💡 GUÍA RÁPIDA DE RESPUESTAS A PREGUNTAS CLAVE

Si el docente te pregunta durante la demostración:

1. **¿Dónde se guardan los datos?**
   > *"En este prototipo funcional los datos se mantienen en la memoria reactiva del celular para pruebas rápidas. Para la versión final de producción está planificado conectar una base de datos local como SQLite y sincronizarla en la nube mediante Supabase."*

2. **¿Funciona sin internet?**
   > *"Sí. Toda la lógica de recetas, semáforo de fechas y escaneo de códigos QR locales funciona al 100% sin conexión. El único momento en que usa internet es cuando escaneas un código de barras comercial para consultar la API pública de alimentos."*

3. **¿Cómo hicieron para tener la APK de Android?**
   > *"Usamos Capacitor. Este marco toma todo nuestro código compilado en React y lo convierte en un proyecto nativo de Android dentro de Android Studio, generando el archivo ejecutable `.apk` instalable mediante un script de automatización."*
