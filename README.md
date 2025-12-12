# Sumaq - Editor de Diplomas 🎓

Editor de diplomas moderno para instituciones educativas peruanas. Genera diplomas hermosos con datos importados desde Excel.

![Sumaq Logo](public/favicon.svg)

## ✨ Características

- 📊 **Importar estudiantes desde Excel** - Arrastra tu lista de estudiantes
- 🎨 **Múltiples diseños** - Plantillas para Inicial, Primaria y Secundaria
- 🖼️ **Logos personalizables** - Arrastra y reordena logos institucionales
- ✍️ **Firmas digitales** - Añade firmas con imagen o texto
- 📄 **Exportar a PDF** - Individual, multipágina o ZIP
- 📱 **Diseño responsive** - Funciona en móviles y desktop
- 💾 **Guarda tu progreso** - Los datos persisten en el navegador

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/jemandahuaylas/sumaq.git
cd sumaq

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

## 📦 Build para producción

```bash
pnpm build
```

Los archivos estáticos se generarán en la carpeta `dist/`.

## 🌐 Deploy

Este proyecto está optimizado para Vercel:

1. Conecta tu repositorio de GitHub a Vercel
2. Vercel detectará automáticamente que es un proyecto Astro
3. El build se ejecutará con `pnpm build`
4. ¡Listo!

## 🛠️ Tecnologías

- [Astro](https://astro.build/) - Framework web
- [React](https://react.dev/) - UI Components
- [Tailwind CSS 4](https://tailwindcss.com/) - Estilos
- [Zustand](https://zustand.docs.pmnd.rs/) - Estado global
- [jsPDF](https://github.com/parallax/jsPDF) - Generación de PDF
- [modern-screenshot](https://github.com/nichenqin/modern-screenshot) - Captura de elementos
- [XLSX](https://sheetjs.com/) - Procesamiento de Excel

## 📝 Uso

1. **Importar estudiantes**: Ve al tab "Estudiantes" y sube tu archivo Excel
2. **Configurar institución**: Añade el nombre, logos y lema
3. **Elegir diseño**: Selecciona una plantilla que se ajuste a tu nivel educativo
4. **Personalizar**: Ajusta colores, texto y firmas
5. **Exportar**: Descarga los diplomas en PDF

## 🇵🇪 Sobre el nombre

**Sumaq** significa "hermoso" en Quechua, reflejando nuestro compromiso de crear diplomas dignos para los logros de los estudiantes peruanos.

## 📄 Licencia

MIT © 2024
