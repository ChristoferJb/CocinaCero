# Reflexión Crítica sobre el Uso de Inteligencia Artificial
*Análisis del proceso de desarrollo, decisiones de arquitectura, intervención humana y limitaciones del prototipo*

Este documento describe la colaboración entre el grupo de desarrollo humano y la Inteligencia Artificial para construir la aplicación **CocinaCero**, detallando los errores corregidos y las decisiones tomadas.

---

## 1. Qué hizo la Inteligencia Artificial (Aportes de la IA)
La Inteligencia Artificial se utilizó para acelerar las fases iniciales del desarrollo de software:
* **Generación de la Estructura Base**: Creó el esqueleto inicial del proyecto React 18, configurando los componentes funcionales, las pestañas de Ionic y la declaración de tipos de TypeScript.
* **Lógica del Algoritmo del Recipe Matcher**: Esbozó la primera versión del algoritmo que busca y compara ingredientes entre la despensa y las recetas precargadas.
* **Integración del Lector de Cámara**: Proporcionó las plantillas de inicialización y detención de la biblioteca `html5-qrcode` para integrarla dentro de los modales reactivos de la aplicación.

---

## 2. Intervención Humana (Correcciones y Ajustes del Grupo)
El grupo de desarrollo humano no se limitó a copiar y pegar el código generado. Llevamos a cabo un riguroso control de calidad y refactorizamos código crítico para corregir tres fallos graves de lógica y experiencia de usuario que la IA introdujo:

### A. Corrección del Bug de Cantidades Exponenciales e Imprecisión Flotante
* **Fallo de la IA**: El código generado aumentaba la cantidad sumando o restando el $25\%$ del valor actual (`item.quantity * 0.25`). Esto provocaba un crecimiento exponencial descontrolado e imprecisiones de punto flotante de JavaScript (como mostrar `1.20000000000002 kg` en la pantalla).
* **Corrección del Grupo**: Refactorizamos el método de control en [InventoryView.tsx](file:///c:/Users/chris/Documents/PYTHON/Proyecto-Cocina/src/components/InventoryView.tsx) implementando incrementos fijos e inteligentes según la unidad de medida (100g para gramos, 0.1kg para kilogramos, y 1 para unidades). Además, aplicamos un redondeo forzado (`Math.round(val * 100) / 100`) para sanitizar los decimales en pantalla.

### B. Corrección del Ciclo de Vida y Permisos de Cámara en Android
* **Fallo de la IA**: El lector de códigos abría la cámara trasera directamente al pulsar el botón del escáner. En celulares reales Android, esto hacía que la WebView se quedara en negro o se colgara porque la aplicación intentaba acceder al sensor físico antes de solicitar y tener concedidos los permisos de hardware.
* **Corrección del Grupo**: Creamos un efecto preventivo (`useEffect` en `App.tsx`) que solicita de forma silenciosa el permiso de cámara del celular 1 segundo después de arrancar la aplicación y detiene el hardware inmediatamente tras obtener respuesta. Esto garantiza una apertura instantánea del escáner en Android sin retrasos ni cuelgues.

### C. Corrección del Solapamiento Visual en la Barra de Búsqueda
* **Fallo de la IA**: El icono de la lupa (`Search` de Lucide) estaba posicionado de forma fija dentro del buscador, provocando que los caracteres escritos se sobrepusieran visualmente al icono por un conflicto de padding en CSS.
* **Corrección del Grupo**: Modificamos el componente para ocultar de manera reactiva la lupa cuando hay texto escrito (`{!searchTerm && <Search />}`) y creamos la clase `.search-input` en `index.css` para alinear perfectamente el texto inicial.

---

## 3. Decisiones Técnicas y su Justificación
* **React 18 + TypeScript**: Elegido para asegurar un flujo de datos unidireccional y predecible. El tipado estricto previno que enviáramos valores vacíos o nulos a las funciones de cálculo de fechas de expiración.
* **Capacitor 6**: Seleccionado en lugar de React Native porque permite empaquetar código web nativo puro dentro de una WebView integrada de alto rendimiento. Esto nos permitió reutilizar código web y ejecutar librerías de navegador como `html5-qrcode` de forma nativa sin crear puentes nativos pesados en Java o Swift.
* **Modularización de Capas**: Aislamos los servicios matemáticos de la interfaz para poder testear la lógica de vencimiento de forma automatizada mediante **Vitest** en la consola, reduciendo los tiempos de debugging.

---

## 4. Limitaciones del Prototipo Actual
Aunque el prototipo es funcional, presenta las siguientes limitaciones de alcance que se planean resolver en futuras iteraciones:
1. **Volatilidad del Almacenamiento**: Los datos se almacenan en el estado temporal de React. Al cerrar por completo la aplicación, los productos agregados se borran. Se necesita integrar SQLite local o Supabase en la nube para la persistencia de datos.
2. **Dependencia de Red para Códigos de Barra**: La API de Open Food Facts para buscar códigos de barras de supermercado requiere una conexión activa a internet. Si el usuario está offline en un supermercado subterráneo, solo podrá ingresar productos usando el código QR local u offline o el formulario manual.
