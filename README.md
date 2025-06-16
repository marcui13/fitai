# FitAI - Tu Asistente Personal de Entrenamiento 🤖💪

FitAI es una aplicación web moderna que utiliza inteligencia artificial para generar planes de entrenamiento personalizados basados en tus objetivos, nivel de condición física y disponibilidad.

## Características Principales 🌟

- **Planes de Entrenamiento Personalizados**: Genera rutinas de ejercicio adaptadas a tus necesidades específicas
- **Interfaz Intuitiva**: Diseño moderno y fácil de usar con menú lateral
- **Perfil de Usuario**: Personaliza tu experiencia con tus datos físicos y objetivos
- **Historial de Entrenamientos**: Guarda y revisa tus planes de entrenamiento anteriores
- **Consejos Motivacionales**: Recibe frases motivadoras y tips diarios para mantener tu entusiasmo
- **Diseño Responsivo**: Funciona perfectamente en dispositivos móviles y de escritorio

## Tecnologías Utilizadas 🛠️

- Angular 17
- Ionic Framework
- TypeScript
- OpenAI API
- SCSS para estilos
- Reactive Forms para validación

## Requisitos Previos 📋

- Node.js (versión 18 o superior)
- npm (incluido con Node.js)
- Angular CLI (`npm install -g @angular/cli`)
- Una cuenta de OpenAI con API key

## Instalación 🚀

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/fitai.git
cd fitai
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
   - Crea un archivo `.env` en la raíz del proyecto
   - Agrega tu API key de OpenAI:
   ```
   OPENAI_API_KEY=tu-api-key-aquí
   ```

4. Inicia el servidor de desarrollo:
```bash
ng serve
```

5. Abre tu navegador en `http://localhost:4200`

## Uso 💡

1. **Crear un Nuevo Plan de Entrenamiento**:
   - Haz clic en "New Workout" en el menú lateral
   - Completa el formulario con tus datos personales y objetivos
   - Recibe un plan de entrenamiento personalizado

2. **Ver Historial**:
   - Accede a "Workout History" desde el menú
   - Revisa tus planes de entrenamiento anteriores

3. **Personalizar Configuración**:
   - Usa el menú de configuración para ajustar tus preferencias
   - Actualiza tu perfil según sea necesario

## Estructura del Proyecto 📁

```
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   └── services/
│   ├── features/
│   │   ├── workout-form/
│   │   ├── workout-result/
│   │   └── workout-history/
│   └── shared/
├── assets/
└── theme/
```

## Contribuir 🤝

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia 📄

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## Contacto 📧

Tu Nombre - [@tutwitter](https://twitter.com/tutwitter)

Link del Proyecto: [https://github.com/tu-usuario/fitai](https://github.com/tu-usuario/fitai)

