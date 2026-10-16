# ⚡ Spark — Norsk App

Una plataforma Full-Stack de aprendizaje de noruego (Bokmål) diseñada con metodologías de repetición espaciada, gamificación avanzada y diseño escandinavo.

🔗 **Enlace del proyecto en vivo:** https://frontend-noruego.vercel.app/

👤 **Usuario de prueba para evaluadores:**
- **Email:** tribunal@neoland.com
- **Contraseña:** 123456
  
## 🚀 Características Principales

* **🧠 Repetición Espaciada (Spaced Repetition):** Algoritmo inteligente que prioriza las palabras que más te cuestan y exige 25 aciertos con alta precisión para considerar una palabra "Dominada".
* **🎙️ Audio Nativo (TTS):** Integración de síntesis de voz noruega (`nb-NO`) nativa y fallback a la API de Google Translate para garantizar una pronunciación perfecta en cualquier dispositivo.
* **🎮 5 Modos de Entrenamiento:**
  * ✍️ Escritura (Dictado directo).
  * 🎯 Tipo Test (4 opciones dinámicas).
  * 🎧 Oído Noruego (Escucha activa sin texto).
  * ⏱️ Sprint Contrarreloj (Reflejos de fluidez en 60 segundos).
  * 🃏 Flashcards (Autoevaluación clásica).
* **🏆 Gamificación Realista (Estándar MCER):** Sistema de 7 rangos (A1 a C2), control de rachas diarias y 12 trofeos a largo plazo (hasta 5.000 palabras y 365 días de constancia).
* **🎨 Vestidor RPG (Avatares SVG):** Componente de mascota renderizado en vectores puros por capas. El usuario desbloquea razas, colores, ropa y accesorios según sus puntos de experiencia (XP).
* **📱 Progressive Web App (PWA):** Instalable en dispositivos móviles para una experiencia nativa.

## 🛠️ Stack Tecnológico

* **Frontend:** React (Vite), Tailwind CSS v4, React Router DOM.
* **Backend:** Node.js, Express, JSON Web Tokens (JWT) para autenticación.
* **Base de Datos:** MongoDB Atlas + Mongoose.
* **Despliegue:** Vercel (Frontend) y Render (Backend API).

## 📦 Instalación Local

1. Clona este repositorio.
2. Instala las dependencias con `npm install`.
3. Crea un archivo `.env` en la raíz con la variable `VITE_API_URL` apuntando a tu backend.
4. Inicia el servidor de desarrollo con `npm run dev`.
