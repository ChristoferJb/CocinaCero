# ORGANIZACIÓN DE EXPOSICIÓN POR INTEGRANTE — COCINACERO
*Basado en la estructura de 10 diapositivas del proyecto presentadas al Ing. Gabriel Morejón López*

---

## 📊 REPARTICIÓN RÁPIDA DE ROLES

| Integrante | Diapositivas | Rol / Enfoque | Tiempo Est. |
| :--- | :--- | :--- | :--- |
| **1. Barzola Indarte Christofer Jesus** | Diapositivas 1, 2 y 3 | **Presentador Inicial**: Introducción, Contexto y Problemática. | 1.0 min |
| **2. Delgado Cornejo Blair Steven** | Diapositivas 4 y 5 | **Especialista de Funcionalidades**: Módulos del sistema y Escáner Multiprotocolo (QR/Barra). | 1.5 min |
| **3. Palma Navarrete Michael Agustin** | Diapositivas 6, 7 y 8 | **Arquitecto de Software**: Patrones de diseño, Arquitectura Híbrida y Tecnologías (React/Ionic/Capacitor). | 1.5 min |
| **4. Zambrano Chavez Leiber Valentin** | Diapositivas 9 y 10 (+ Demo) | **Especialista de Algoritmos & Cierre**: Motor de Recetas Zero-Waste, Demostración en vivo y Agradecimiento. | 1.5 min |

---

# 🎙️ GUION DETALLADO POR INTEGRANTE

---

### 👤 INTEGRANTE 1: BARZOLA INDARTE CHRISTOFER JESUS
**Diapositivas a exponer**: 1, 2 y 3

#### 📄 Diapositiva 1: Carátula / Presentación
* **Lo que dices**:
  > *"Buenas tardes Ing. Gabriel Morejón y compañeros. Nuestro grupo está conformado por Blair Delgado, Michael Palma, Leiber Zambrano y mi persona, Christofer Barzola. 
  > Les vamos a presentar nuestra aplicación móvil llamada **CocinaCero**, un inventario inteligente y motor de recetas dinámicas diseñado para combatir el desperdicio de alimentos desde el hogar."*

#### 📄 Diapositiva 2: Problemática (Pregunta Clave)
* **Lo que dices**:
  > *"Para iniciar, nos planteamos la siguiente problemática: **¿Cómo mitigar la pérdida de alimentos y dinero directamente desde la alacena de nuestros hogares?** 
  > En la actualidad, el desperdicio de comida no solo representa un impacto económico negativo para las familias, sino también un problema ambiental severo."*

#### 📄 Diapositiva 3: Problemática — Falta de Visibilidad y Creatividad
* **Lo que dices**:
  > *"Analizando a fondo este problema, descubrimos que la mayor parte de los alimentos se desechan de forma **involuntaria** por dos factores cotidianos:
  > 1. **Invisibilidad**: No sabemos con exactitud qué insumos tenemos guardados en el fondo del refrigerador ni cuáles están a punto de caducar.
  > 2. **Bloqueo creativo**: Aunque veamos que nos quedan algunos ingredientes aislados, no sabemos qué plato preparar con ellos y preferimos comprar comida nueva, dejando vencer lo anterior.
  > A continuación, mi compañero Blair les explicará las funcionalidades que implementamos para solucionar esto."*

---

### 👤 INTEGRANTE 2: DELGADO CORNEJO BLAIR STEVEN
**Diapositivas a exponer**: 4 y 5

#### 📄 Diapositiva 4: Funcionalidades Implementadas al Sistema
* **Lo que dices**:
  > *"Gracias Christofer. Para atacar estos dos factores, desarrollamos **CocinaCero** con tres pilares funcionales principales:
  > * **Centro de Mando Zero-Waste**: Un panel principal que muestra auditarías en tiempo real de la despensa y un **Indicador Dinámico** (un semáforo visual que clasifica los alimentos en 4 estados reactivos: Vencido en rojo, Crítico en naranja, Advertencia en amarillo y Óptimo en verde).
  > * **Recomendaciones de Recetas**: Un motor que sugiere platos cruzando el stock disponible y priorizando aquellos ingredientes más próximos a vencer.
  > * **Historial de Consumo**: Un módulo que registra el impacto en valor monetario rescatado y desperdicio estimado."*

#### 📄 Diapositiva 5: Implementaciones Adicionales (Lector Multiprotocolo)
* **Lo que dices**:
  > *"Un punto clave de nuestra app es la agilidad para registrar productos. Implementamos un **Lector Multiprotocolo** de cámara:
  > 1. **Códigos de Barra Comerciales**: Se conecta de forma asíncrona a la API mundial de **Open Food Facts** para autocompletar el nombre y categoría de productos de supermercado.
  > 2. **Códigos QR Dinámicos**: Diseñamos un parser que lee códigos QR locales en formato JSON o Query String, permitiendo registrar productos a granel en 0 milisegundos sin requerir internet.
  > Ahora le doy paso a mi compañero Michael para explicar la arquitectura técnica del proyecto."*

---

### 👤 INTEGRANTE 3: PALMA NAVARRETE MICHAEL AGUSTIN
**Diapositivas a exponer**: 6, 7 y 8

#### 📄 Diapositiva 6 y 7: Arquitectura Híbrida y Modularización
* **Lo que dices**:
  > *"Gracias Blair. Entrando a la parte técnica, la aplicación fue construida bajo una **Arquitectura Híbrida Móvil**.
  > La web se ejecuta dentro de un contenedor nativo optimizado mediante un puente de comunicación (*Capacitor Bridge*). Esto nos permite mantener un código único multiplataforma para Android e iOS, acelerando el desarrollo.
  > Además, aplicamos una **Modularización estricta**: la lógica de negocio y los algoritmos están totalmente aislados de la interfaz visual en archivos independientes de TypeScript para facilitar la mantenibilidad."*

#### 📄 Diapositiva 8: Tecnologías Usadas
* **Lo que dices**:
  > *"En el Stack Tecnológico utilizamos:
  > * **React 18 & TypeScript**: Nos brinda una interfaz ágil y un tipado estricto de dominio (`types.ts`) para prevenir inconsistencias de datos en tiempo de compilación.
  > * **Ionic React & Capacitor 6**: Proporciona el layout móvil adaptativo y el acceso directo al hardware nativo de la cámara.
  > * **Manejo de Estado y Persistencia**: Manejamos el estado reactivo con `useState` e indexamos el inventario en un `Map` de JavaScript para búsquedas ultra rápidas en tiempo constante $O(1)$. La arquitectura está preparada para escalar hacia persistencia local persistente con Capacitor SQLite."*

---

### 👤 INTEGRANTE 4: ZAMBRANO CHAVEZ LEIBER VALENTIN
**Diapositivas a exponer**: 9 y 10 (+ Demostración en vivo)

#### 📄 Diapositiva 9: Programa (Sugerencias Inteligentes y Despensa en Acción)
* **Lo que dices**:
  > *"Gracias Michael. En esta pantalla podemos observar el programa en funcionamiento. 
  > El corazón de CocinaCero es su algoritmo **Zero-Waste Score**:
  > * Normaliza los nombres de los insumos (remueve tildes y plurales).
  > * Convierte unidades físicas (por ejemplo de kilogramos a gramos).
  > * Y otorga un **puntaje de premio** a las recetas que rescatan alimentos que vencen en las próximas 48 horas, colocándolas en el **primer lugar del menú** para motivar al usuario a cocinarlas hoy mismo."*

#### 📱 Demostración Rápida en Vivo / Navegación (30 segundos):
* **Lo que haces**: Muestras la app ejecutándose o las capturas de la despensa navegando entre las pestañas.
* **Lo que dices**:
  > *"Como pueden ver en el programa, el usuario puede filtrar su despensa por estado, modificar cantidades con controles finos de decimales (como 0.1 kg), o presionar 'Consumido' para registrar el ahorro financiero en el historial."*

#### 📄 Diapositiva 10: Gracias y Cierre
* **Lo que dices**:
  > *"En conclusión, CocinaCero es una solución móvil completa, funcional y técnicamente sólida que aborda una problemática real. 
  > Muchas gracias Ing. Gabriel Morejón. Quedamos a su disposición para cualquier pregunta o demostración que desee realizar."*

---

### 💡 TIPS PARA EL GRUPO ANTE LAS PREGUNTAS DEL DOCENTE (ING. MOREJÓN):
* **Si pregunta a Michael (Arquitectura)**: *"¿Por qué no usaron base de datos SQL desde el inicio?"* $\rightarrow$ *"Para esta fase de prototipado rápido optimizamos la velocidad de respuesta usando estructuras Hash en memoria (`Map`), lo que permite búsquedas $O(1)$. Sin embargo, la capa de datos está desacoplada para integrar `@capacitor-community/sqlite` sin alterar la interfaz."*
* **Si pregunta a Blair (Escáner)**: *"¿Qué pasa si no hay internet?"* $\rightarrow$ *"El escáner QR local funciona 100% offline porque decodifica el texto dentro del celular. Solo se usa internet al consultar códigos comerciales en Open Food Facts."*
* **Si pregunta a Leiber (Algoritmo)**: *"¿Cómo sabe la app qué receta va primero?"* $\rightarrow$ *"Por la fórmula de Zero-Waste Score: si una receta usa un alimento en estado Crítico que vence en 2 días, recibe +50 puntos de bonificación, superando a recetas cuyos ingredientes estén en buen estado."*
