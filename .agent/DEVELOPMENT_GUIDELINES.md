# Guías de Desarrollo - Sistema de Diplomas

## 📋 Principios de Diseño

### 1. DRY (Don't Repeat Yourself) - No Te Repitas
**❌ Problema encontrado:**
Cada template tenía su propia lógica para manejar nombres largos, duplicando código y haciendo difícil el mantenimiento.

**✅ Solución:**
- Crear funciones utilitarias centralizadas en `src/components/templates/utils.ts`
- Reutilizar estas funciones en todos los templates
- Si necesitas resolver un problema en múltiples lugares, créalo una vez y reutilízalo

**Regla:** Si copias y pegas código más de una vez, créalo como función reutilizable.

---

### 2. Soluciones Estructurales vs Parches
**❌ Antipatrón:**
```tsx
// ❌ MAL: Solución ad-hoc en cada template
<h2 className="text-5xl truncate">
  {student.nombres}
</h2>
```

**✅ Patrón Correcto:**
```tsx
// ✅ BIEN: Solución estructural reutilizable
<h2 
  style={{ 
    fontSize: getAdaptiveFontSize(student.nombres),
    ...getNoTruncateStyles() 
  }}
>
  {student.nombres}
</h2>
```

**Regla:** Ante un problema sistémico, implementa una solución estructural que beneficie a todo el sistema.

---

## 🎨 Diseño de Templates de Diplomas

### 3. Manejo de Texto Dinámico
Los nombres de estudiantes pueden variar significativamente en longitud.

**Funciones Obligatorias a Usar:**
```typescript
import { 
  getAdaptiveFontSize,      // Ajusta tamaño según longitud
  getNoTruncateStyles,       // Previene truncado
  getAdaptiveMaxWidth        // Ajusta ancho del contenedor
} from '../utils';
```

**Template Estándar:**
```tsx
<div className={`${getAdaptiveMaxWidth(student.nombres)}`}>
  <h2 
    style={{
      fontSize: getAdaptiveFontSize(student.nombres, baseFontSize),
      ...getNoTruncateStyles()
    }}
  >
    {student.nombres}
  </h2>
</div>
```

**Regla:** NUNCA uses `truncate` en nombres de estudiantes. Siempre usa las funciones adaptativas.

---

### 4. Tamaños de Fuente Base por Nivel Educativo

Usa estos tamaños base recomendados:

```typescript
// Inicial (más grande, más amigable)
getAdaptiveFontSize(student.nombres, 4)    // Base: 64px

// Primaria (grande pero professional)
getAdaptiveFontSize(student.nombres, 3.5)  // Base: 56px

// Secundaria (elegante y formal)
getAdaptiveFontSize(student.nombres, 3)    // Base: 48px
```

**Regla:** Mantén consistencia visual según el nivel educativo.

---

### 5. Arquitectura de Nuevos Templates

**Estructura Obligatoria:**
```tsx
import React from 'react';
import type { DiplomaConfig, Student } from '../../../types';
import { 
  processDiplomaText, 
  getAdaptiveFontSize, 
  getNoTruncateStyles, 
  getAdaptiveMaxWidth 
} from '../utils';

interface TemplateProps {
  config: DiplomaConfig;
  student: Student;
}

export const NuevoTemplate: React.FC<TemplateProps> = ({ config, student }) => {
  const primary = config.primaryColor || '#DEFAULT';
  const secondary = config.secondaryColor || '#DEFAULT';
  const bgColor = config.backgroundColor || '#ffffff';
  const textColor = config.textColor || '#1e293b';

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Contenido aquí */}
    </div>
  );
};
```

---

### 6. Checklist al Crear un Nuevo Diseño

**Antes de considerar completo un template:**

- [ ] ✅ Usa `getAdaptiveFontSize()` para el nombre del estudiante
- [ ] ✅ Aplica `getNoTruncateStyles()` al elemento del nombre
- [ ] ✅ Usa `getAdaptiveMaxWidth()` en el contenedor del nombre
- [ ] ✅ Prueba con nombres cortos (< 20 caracteres)
- [ ] ✅ Prueba con nombres largos (> 40 caracteres)
- [ ] ✅ Prueba con nombres muy largos (> 60 caracteres)
- [ ] ✅ Registra el template en `DiplomaPreview.tsx`
- [ ] ✅ Agrega el diseño a `ConfigPanel.tsx` con su paleta por defecto
- [ ] ✅ Ajusta placeholders si es necesario

---

## 🔧 Utilidades Disponibles

### `processDiplomaText(text, config, student)`
Procesa el texto del diploma reemplazando variables y aplicando énfasis.

**Variables soportadas:**
- `{{Nombres}}` - Nombre del estudiante
- `{{Grado}}` - Grado del estudiante (con negrita)
- `{{Nivel}}` - Nivel educativo (con negrita)
- `{{Puesto}}` - Puesto/ranking (con negrita)
- `{{Institucion}}` - Nombre de la institución

### `getAdaptiveFontSize(name, baseFontSize)`
Calcula tamaño de fuente óptimo.

**Parámetros:**
- `name`: Nombre completo del estudiante
- `baseFontSize`: Tamaño base en rem (por defecto 3)

**Retorna:** String con el tamaño en rem (ej: "2.5rem")

**Escala implementada:**
- > 60 caracteres: `baseFontSize * 0.45`
- > 50 caracteres: `baseFontSize * 0.5`
- > 45 caracteres: `baseFontSize * 0.55`
- > 40 caracteres: `baseFontSize * 0.6`
- > 35 caracteres: `baseFontSize * 0.7`
- > 30 caracteres: `baseFontSize * 0.75`
- > 25 caracteres: `baseFontSize * 0.85`
- > 20 caracteres: `baseFontSize * 0.9`
- ≤ 20 caracteres: `baseFontSize`

### `getNoTruncateStyles()`
Retorna objeto con estilos CSS para prevenir truncado.

**Estilos aplicados:**
```typescript
{
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  hyphens: 'auto',
  whiteSpace: 'normal'
}
```

### `getAdaptiveMaxWidth(name)`
Determina clase Tailwind para ancho máximo óptimo.

**Retorna:**
- > 45 caracteres: `'max-w-5xl'`
- > 35 caracteres: `'max-w-4xl'`
- > 25 caracteres: `'max-w-3xl'`
- ≤ 25 caracteres: `'max-w-2xl'`

---

## 🚫 Errores Comunes a Evitar

### 1. Usar `truncate` en Tailwind
```tsx
❌ <h2 className="text-5xl truncate">{student.nombres}</h2>
✅ <h2 style={{ fontSize: getAdaptiveFontSize(student.nombres) }}>{student.nombres}</h2>
```

### 2. Tamaños de Fuente Fijos
```tsx
❌ <h2 className="text-6xl">{student.nombres}</h2>
✅ <h2 style={{ fontSize: getAdaptiveFontSize(student.nombres, 4) }}>{student.nombres}</h2>
```

### 3. Olvidar el Contenedor Adaptativo
```tsx
❌ <div className="max-w-3xl">{/* nombre */}</div>
✅ <div className={getAdaptiveMaxWidth(student.nombres)}>{/* nombre */}</div>
```

### 4. No Aplicar Estilos Anti-Truncado
```tsx
❌ <h2 style={{ fontSize: '3rem' }}>{student.nombres}</h2>
✅ <h2 style={{ fontSize: '3rem', ...getNoTruncateStyles() }}>{student.nombres}</h2>
```

### 5. Duplicar Lógica Entre Templates
```tsx
❌ // Lógica repetida en cada archivo
const fontSize = name.length > 40 ? '2rem' : '3rem';

✅ // Usar función centralizada
const fontSize = getAdaptiveFontSize(name);
```

---

## 📝 Proceso de Desarrollo

### Al Agregar un Nuevo Template:

1. **Crear el archivo** en la carpeta correspondiente del nivel educativo
2. **Importar todas las utilidades** necesarias desde `utils.ts`
3. **Implementar el diseño** usando las funciones adaptativas
4. **Probar con datos reales** de diferentes longitudes
5. **Registrar el template** en `DiplomaPreview.tsx`
6. **Agregar a configuración** en `ConfigPanel.tsx`
7. **Actualizar placeholders** si es necesario
8. **Commit con mensaje descriptivo**

### Nombres de Commits Sugeridos:
- `feat: nuevo diseño [Nombre] para [Nivel]`
- `fix: ajuste de nombres largos en [Template]`
- `refactor: centralizar lógica de [funcionalidad]`
- `docs: actualizar guías de desarrollo`

---

## 🎯 Casos de Prueba Mínimos

Antes de considerar un template completo, prueba con:

**Nombres Cortos (< 20 chars):**
- Juan Pérez
- Ana López
- Carlos Ramos

**Nombres Medianos (20-40 chars):**
- María Fernanda García López
- José Antonio Ramírez Castro

**Nombres Largos (40-60 chars):**
- Ana María Fernández de la Torre González
- Carlos Alberto Rodríguez Martínez López

**Nombres Muy Largos (> 60 chars):**
- ALLCCA BARAZORDA, FELIPE ANGEL DE LA SANTÍSIMA TRINIDAD
- María del Carmen Fernández González de los Santos y Ramírez

---

## 💡 Mejores Prácticas

1. **Siempre usa TypeScript** para aprovechar el tipado
2. **Documenta funciones complejas** con JSDoc
3. **Mantén funciones pequeñas** (máximo 50 líneas)
4. **Un archivo, una responsabilidad**
5. **Preferir composición sobre herencia**
6. **Testear con datos reales de la base de datos**
7. **No hardcodear valores** que deberían ser configurables
8. **Usar constantes** para valores mágicos
9. **Comentar el "por qué"**, no el "qué"
10. **Mantener consistencia** en nombres y estructura

---

## 🔄 Mantenimiento

### Al Actualizar Funciones en `utils.ts`:

1. Verifica el impacto en **todos** los templates
2. Prueba cada template después del cambio
3. Documenta el cambio en este archivo
4. Actualiza versión si es breaking change

### Al Hacer Refactoring:

1. Un archivo a la vez
2. Commit frecuente con cambios pequeños
3. Mantener funcionalidad existente
4. Agregar tests si es posible

---

## 📚 Recursos Adicionales

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Best Practices](https://react.dev/learn)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Última actualización:** 2025-12-12
**Autor:** Sistema de Diplomas Sumaq
**Versión:** 1.0
