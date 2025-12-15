import React from 'react';
import type { DiplomaConfig, Student } from '../../../types';
import { processDiplomaText, getAdaptiveFontSize, getNoTruncateStyles } from '../utils';

interface TemplateProps {
    config: DiplomaConfig;
    student: Student;
}

/**
 * Secundaria03 - "Mosaico Vibrante"
 * Diseño moderno con bloques de colores en los bordes y layout limpio central.
 * Inspirado en certificados contemporáneos de membresía y logros.
 */
export const Secundaria03: React.FC<TemplateProps> = ({ config, student }) => {
    const primary = config.primaryColor || '#0891B2'; // Teal/Cyan vibrante
    const secondary = config.secondaryColor || '#8B5CF6'; // Púrpura moderno
    const accent = '#06B6D4'; // Cyan brillante
    const bgColor = config.backgroundColor || '#FFFFFF';
    const textColor = config.textColor || '#0F172A';

    // Tamaño de bloques
    const blockSize = 60;

    return (
        <div
            className="w-full h-full relative overflow-hidden font-sans"
            style={{ backgroundColor: bgColor, color: textColor }}
        >
            {/* === BLOQUES DECORATIVOS SUPERIORES === */}
            <div className="absolute top-0 left-0 right-0 flex h-16">
                {/* Bloques superiores */}
                <div className="w-16 h-full" style={{ backgroundColor: secondary }} />
                <div className="w-48 h-full" style={{ backgroundColor: primary }} />
                <div className="flex-1 h-full" style={{ backgroundColor: secondary }} />
                <div className="w-24 h-full" style={{ backgroundColor: secondary, opacity: 0.8 }} />
                <div className="w-24 h-full" style={{ backgroundColor: secondary, opacity: 0.6 }} />
                <div className="w-24 h-full" style={{ backgroundColor: secondary, opacity: 0.4 }} />
                <div className="w-16 h-full" style={{ backgroundColor: accent }} />
            </div>

            {/* === BLOQUES DECORATIVOS INFERIORES === */}
            <div className="absolute bottom-0 left-0 right-0 flex h-16">
                {/* Bloques inferiores */}
                <div className="w-16 h-full" style={{ backgroundColor: accent }} />
                <div className="w-24 h-full" style={{ backgroundColor: primary }} />
                <div className="w-32 h-full" style={{ backgroundColor: secondary }} />
                <div className="flex-1 h-full" style={{ backgroundColor: secondary }} />
                <div className="w-24 h-full" style={{ backgroundColor: secondary, opacity: 0.8 }} />
                <div className="w-24 h-full" style={{ backgroundColor: primary, opacity: 0.7 }} />
                <div className="w-16 h-full" style={{ backgroundColor: accent }} />
            </div>

            {/* === BARRAS LATERALES === */}
            {/* Barra izquierda */}
            <div className="absolute left-0 top-16 bottom-16 w-8 flex flex-col">
                <div className="flex-1" style={{ backgroundColor: secondary }} />
                <div className="h-32" style={{ backgroundColor: primary }} />
                <div className="h-24" style={{ backgroundColor: accent }} />
                <div className="flex-1" style={{ backgroundColor: secondary }} />
            </div>

            {/* Barra derecha */}
            <div className="absolute right-0 top-16 bottom-16 w-8 flex flex-col">
                <div className="h-24" style={{ backgroundColor: secondary }} />
                <div className="h-32" style={{ backgroundColor: accent }} />
                <div className="flex-1" style={{ backgroundColor: primary }} />
                <div className="h-32" style={{ backgroundColor: secondary }} />
            </div>

            {/* === ELEMENTOS DECORATIVOS EN LAS ESQUINAS === */}
            {/* Triángulo superior izquierdo */}
            <svg className="absolute top-16 left-8 w-20 h-20" viewBox="0 0 100 100">
                <polygon points="0,0 100,0 0,100" fill={primary} opacity="0.3" />
            </svg>

            {/* Triángulo inferior derecho */}
            <svg className="absolute bottom-16 right-8 w-20 h-20" viewBox="0 0 100 100">
                <polygon points="100,100 0,100 100,0" fill={accent} opacity="0.3" />
            </svg>

            {/* === CONTENIDO CENTRAL === */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-24 py-24">

                {/* Logos superiores */}
                <div className="flex items-center justify-center gap-6 mb-8">
                    {(() => {
                        const logos = config.logos?.map(l => l.src) || [];
                        if (logos.length === 0 && config.logoColegio) {
                            return <img src={config.logoColegio} className="h-14 object-contain" alt="Logo" />;
                        }
                        return logos.slice(0, 2).map((src, i) => (
                            <img key={i} src={src} className="h-12 object-contain" alt={`Logo ${i + 1}`} />
                        ));
                    })()}
                </div>

                {/* Institución - PRIMERO, arriba */}
                <p
                    className="text-base uppercase font-bold tracking-wider mb-8"
                    style={{ color: textColor }}
                >
                    {config.institucionNombre}
                </p>

                {/* Título principal - DIPLOMA */}
                <h1
                    className="font-black uppercase text-center mb-3"
                    style={{
                        fontSize: '5rem',
                        color: textColor,
                        letterSpacing: '0.15em',
                        lineHeight: '1',
                        WebkitTextStroke: `2px ${textColor}`,
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    {config.tituloDiploma}
                </h1>

                {/* Subtítulo */}
                <p
                    className="text-xs uppercase tracking-[0.3em] mb-8"
                    style={{ color: textColor, opacity: 0.6 }}
                >
                    {config.subtituloDiploma || 'Otorgado con alegría a:'}
                </p>

                {/* Nombre del estudiante */}
                <div className="w-full max-w-2xl mb-8">
                    <h2
                        className="text-center font-bold italic"
                        style={{
                            color: primary,
                            fontSize: getAdaptiveFontSize(student.nombres, 3.5),
                            ...getNoTruncateStyles()
                        }}
                    >
                        {student.nombres}
                    </h2>
                </div>

                {/* Texto del diploma */}
                <div className="max-w-2xl mx-auto mb-8">
                    <p
                        className="text-sm leading-relaxed text-center"
                        style={{ color: textColor }}
                        dangerouslySetInnerHTML={{ __html: processDiplomaText(config.plantillaTexto, config, student) }}
                    />
                </div>

                {/* Fecha - alineada a la derecha */}
                <div className="w-full max-w-2xl mx-auto text-right mb-16">
                    <p className="text-xs uppercase tracking-wide" style={{ color: textColor, opacity: 0.7 }}>
                        {config.fechaLugar}
                    </p>
                </div>

                {/* Firmas */}
                <div className="flex justify-center items-end gap-16 w-full max-w-4xl">
                    {config.firmas.map((signer) => (
                        <div key={signer.id} className="text-center min-w-[160px]">
                            {/* Espacio para firma */}
                            <div className="h-12 flex items-end justify-center mb-2">
                                {signer.firmaImage && (
                                    <img
                                        src={signer.firmaImage}
                                        className="max-h-full max-w-[140px] object-contain mix-blend-multiply"
                                        alt="Firma"
                                    />
                                )}
                            </div>
                            {/* Línea */}
                            <div className="h-px w-full mb-2" style={{ backgroundColor: secondary }} />
                            {/* Cargo */}
                            <p className="text-[10px] uppercase tracking-wide font-bold" style={{ color: secondary }}>
                                {signer.cargo}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Medalla opcional en la esquina */}
            {config.mostrarMedalla && (
                <div className="absolute bottom-24 right-20">
                    <svg width="60" height="60" viewBox="0 0 60 60">
                        <circle cx="30" cy="30" r="28" fill="none" stroke={primary} strokeWidth="2" />
                        <circle cx="30" cy="30" r="20" fill={`${secondary}30`} />
                        <text
                            x="30"
                            y="36"
                            textAnchor="middle"
                            fontSize="20"
                            fill={textColor}
                        >
                            ★
                        </text>
                    </svg>
                </div>
            )}
        </div>
    );
};
