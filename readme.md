ucl-finals-app/
├── public/                         # Archivos estáticos accesibles por el cliente
│   ├── index.html                  # Interfaz principal (UI, filtros, grid y modal)
│   ├── css/                        # Hojas de estilo del proyecto
│   │   ├── base.css                # Variables CSS, reset y estilos globales
│   │   ├── components.css          # Tarjetas, modales, buscadores y badges
│   │   └── layout.css              # Grid responsivo y contenedores
│   ├── js/                         # Archivos de lógica y scripts JavaScript
│   │   ├── app.js                  # Manejo de eventos, renderizado e interacción modal
│   │   ├── dataLoader.js           # Módulo encargado de hacer fetch a los JSON
│   │   └── filters.js              # Lógica de búsqueda y filtrado por era/equipo
│   └── data/                       # Archivos JSON con el registro histórico de finales
│       ├── finals-1950s-1970s.json  # Finales desde 1955-56 hasta 1979-80
│       ├── finals-1980s-1990s.json  # Finales desde 1980-81 hasta 1999-00
│       ├── finals-2000s-2010s.json  # Finales desde 2000-01 hasta 2019-20
│       └── finals-2020s-present.json # Finales desde 2020-21 en adelante
├── node_modules/                   # Dependencias instaladas por npm
├── index.js                        # Punto de entrada principal y servidor Express
├── package.json                    # Configuración del proyecto y lista de dependencias
└── package-lock.json               # Árbol de dependencias exacto e historial de versiones