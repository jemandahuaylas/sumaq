import type { DiplomaConfig, Student } from '../../types';

export const processDiplomaText = (text: string, config: DiplomaConfig, data: Student): string => {
    let processed = text;
    processed = processed.replace(/{{Institucion}}/gi, config.institucionNombre || 'Institución Educativa');
    processed = processed.replace(/{{Nivel}}/gi, config.nivel || 'Nivel Educativo');

    processed = processed.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey === 'nombres') return `<span class="font-bold relative inline-block">
            ${data.nombres}
            <span class="absolute -bottom-1 left-0 w-full h-0.5 bg-current opacity-30"></span>
        </span>`;
        if (lowerKey === 'grado') return data.grado || '';
        if (lowerKey === 'puesto') return data.puesto || '';
        const value = Object.entries(data).find(([k]) => k.toLowerCase() === lowerKey)?.[1];
        return (value as string) || match;
    });
    return processed;
};
