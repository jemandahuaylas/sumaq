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
