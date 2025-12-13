import type { DiplomaConfig, Student } from '../../types';

export const processDiplomaText = (text: string, config: DiplomaConfig, data: Student): string => {
    let processed = text;

    // Reemplazar variables de configuración
    processed = processed.replace(/{{Institucion}}/gi, config.institucionNombre || 'Institución Educativa');

    // Procesar todas las variables dinámicas
    processed = processed.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
        const lowerKey = key.toLowerCase();

        // Grado - Negrita
        if (lowerKey === 'grado') {
            const value = data.grado || '';
            return `<strong style="font-weight: 700;">${value}</strong>`;
        }

        // Nivel - Negrita
        if (lowerKey === 'nivel') {
            const value = config.nivel || 'Nivel Educativo';
            return `<strong style="font-weight: 700;">${value}</strong>`;
        }

        // Puesto - Negrita
        if (lowerKey === 'puesto') {
            const value = data.puesto || '';
            return `<strong style="font-weight: 700;">${value}</strong>`;
        }

        // Nombres - Sin énfasis especial aquí (ya se muestra grande arriba)
        if (lowerKey === 'nombres') {
            return data.nombres || '';
        }

        // Otras variables dinámicas del estudiante
        const value = Object.entries(data).find(([k]) => k.toLowerCase() === lowerKey)?.[1];
        return (value as string) || match;
    });

    return processed;
};

/**
 * Calcula el tamaño de fuente óptimo para nombres de estudiantes
 * basándose en la longitud del texto para evitar truncado.
 * 
 * @param name - Nombre completo del estudiante
 * @param baseFontSize - Tamaño base en rem (por defecto 3rem = 48px)
 * @returns Tamaño de fuente en rem como string (ej: "2.5rem")
 */
export const getAdaptiveFontSize = (name: string, baseFontSize: number = 3): string => {
    const length = name.length;

    // Escala logarítmica para un ajuste más suave
    if (length > 60) return `${baseFontSize * 0.45}rem`; // 1.35rem para nombres muy largos
    if (length > 50) return `${baseFontSize * 0.5}rem`;  // 1.5rem
    if (length > 45) return `${baseFontSize * 0.55}rem`; // 1.65rem
    if (length > 40) return `${baseFontSize * 0.6}rem`;  // 1.8rem
    if (length > 35) return `${baseFontSize * 0.7}rem`;  // 2.1rem
    if (length > 30) return `${baseFontSize * 0.75}rem`; // 2.25rem
    if (length > 25) return `${baseFontSize * 0.85}rem`; // 2.55rem
    if (length > 20) return `${baseFontSize * 0.9}rem`;  // 2.7rem

    return `${baseFontSize}rem`; // Tamaño completo para nombres cortos
};

/**
 * Estilos CSS para prevenir truncado de texto en nombres largos.
 * Usar como spread en el objeto style de React.
 */
export const getNoTruncateStyles = () => ({
    wordBreak: 'break-word' as const,
    overflowWrap: 'break-word' as const,
    hyphens: 'auto' as const,
    whiteSpace: 'normal' as const,
});

/**
 * Determina el ancho máximo óptimo del contenedor basado en la longitud del nombre
 * para balancear el uso del espacio y la legibilidad.
 * 
 * @param name - Nombre completo del estudiante
 * @returns Clase Tailwind para max-width
 */
export const getAdaptiveMaxWidth = (name: string): string => {
    const length = name.length;

    if (length > 45) return 'max-w-5xl'; // Extra ancho para nombres muy largos
    if (length > 35) return 'max-w-4xl'; // Ancho para nombres largos
    if (length > 25) return 'max-w-3xl'; // Ancho estándar

    return 'max-w-2xl'; // Más compacto para nombres cortos
};
