import React from 'react';
import type { DiplomaConfig, Student } from '../../../types';
import { processDiplomaText, getAdaptiveFontSize, getNoTruncateStyles, getAdaptiveMaxWidth } from '../utils';

interface TemplateProps {
    config: DiplomaConfig;
    student: Student;
}

/**
 * Secundaria01 - "Onda Esmeralda"
 * Diseño fluido con ondas orgánicas, gradientes suaves y estética moderna.
 * Completamente diferente al estilo geométrico de Secundaria02.
 */
export const Secundaria01: React.FC<TemplateProps> = ({ config, student }) => {
    const primary = config.primaryColor || '#047857'; // Verde esmeralda
    const secondary = config.secondaryColor || '#0D9488'; // Teal
    const bgColor = config.backgroundColor || '#FFFFFF'; // Fondo blanco
    const textColor = config.textColor || '#1E293B'; // Texto oscuro para contraste

    return (
        <div
            className="w-full h-full relative overflow-hidden"
            style={{ backgroundColor: bgColor, color: textColor }}
        >
            {/* === FONDO CON ONDAS ORGÁNICAS === */}

            {/* Onda superior grande */}
            <svg
                className="absolute top-0 left-0 w-full h-[200px]"
                viewBox="0 0 1200 200"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={primary} stopOpacity="0.15" />
                        <stop offset="50%" stopColor={secondary} stopOpacity="0.1" />
                        <stop offset="100%" stopColor={primary} stopOpacity="0.15" />
                    </linearGradient>
                </defs>
                <path
                    d="M0,0 L1200,0 L1200,120 Q1000,180 800,140 Q600,100 400,140 Q200,180 0,120 Z"
                    fill="url(#waveGrad1)"
                />
                <path
                    d="M0,0 L1200,0 L1200,80 Q1050,140 850,100 Q650,60 450,100 Q250,140 0,80 Z"
                    fill={primary}
                    opacity="0.08"
                />
            </svg>

            {/* Onda inferior */}
            <svg
                className="absolute bottom-0 left-0 w-full h-[180px]"
                viewBox="0 0 1200 180"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={secondary} stopOpacity="0.12" />
                        <stop offset="50%" stopColor={primary} stopOpacity="0.08" />
                        <stop offset="100%" stopColor={secondary} stopOpacity="0.12" />
                    </linearGradient>
                </defs>
                <path
                    d="M0,180 L1200,180 L1200,60 Q1000,0 800,40 Q600,80 400,40 Q200,0 0,60 Z"
                    fill="url(#waveGrad2)"
                />
            </svg>

            {/* Círculos decorativos flotantes */}
            <div
                className="absolute top-16 right-16 w-32 h-32 rounded-full opacity-10"
                style={{
                    background: `radial-gradient(circle, ${primary} 0%, transparent 70%)`
                }}
            />
            <div
                className="absolute bottom-32 left-12 w-24 h-24 rounded-full opacity-10"
                style={{
                    background: `radial-gradient(circle, ${secondary} 0%, transparent 70%)`
                }}
            />
            <div
                className="absolute top-1/3 right-8 w-16 h-16 rounded-full opacity-15"
                style={{
                    border: `2px solid ${primary}`
                }}
            />

            {/* Patrón de puntos sutiles */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                    backgroundImage: `radial-gradient(${primary} 1.5px, transparent 1.5px)`,
                    backgroundSize: '30px 30px'
                }}
            />

            {/* Línea curva decorativa lateral */}
            <svg
                className="absolute left-0 top-1/4 h-1/2 w-12"
                viewBox="0 0 50 200"
                preserveAspectRatio="none"
            >
                <path
                    d="M0,0 Q50,50 25,100 Q0,150 50,200"
                    fill="none"
                    stroke={primary}
                    strokeWidth="3"
                    opacity="0.3"
                />
            </svg>

            {/* Marca de agua del logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                {(() => {
                    const firstLogo = (config.logos && config.logos.length > 0) ? config.logos[0].src : config.logoColegio;
                    return firstLogo ? (
                        <img src={firstLogo} className="w-[280px] h-[280px] object-contain opacity-[0.05] grayscale" alt="" />
                    ) : null;
                })()}
            </div>

            {/* === CONTENIDO PRINCIPAL === */}
            <div className="relative z-10 w-full h-full flex flex-col px-16 py-10 justify-between">

                {/* HEADER */}
                <div>
                    {/* Logos */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
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
                        <div className="flex items-center gap-4">
                            {(() => {
                                const logos = config.logos?.map(l => l.src) || [];
                                return logos.slice(2, 4).map((src, i) => (
                                    <img key={i} src={src} className="h-12 object-contain" alt={`Logo ${i + 3}`} />
                                ));
                            })()}
                        </div>
                    </div>

                    {/* Institución con línea ondulada */}
                    <div className="text-center mt-2">
                        <h2
                            className="font-semibold tracking-[0.12em] uppercase"
                            style={{
                                color: primary,
                                fontSize: `${config.institucionFontSize || 20}px`
                            }}
                        >
                            {config.institucionNombre}
                        </h2>
                        {/* Línea ondulada decorativa */}
                        <svg className="w-40 h-3 mx-auto mt-1" viewBox="0 0 160 12">
                            <path
                                d="M0,6 Q20,0 40,6 Q60,12 80,6 Q100,0 120,6 Q140,12 160,6"
                                fill="none"
                                stroke={secondary}
                                strokeWidth="2"
                            />
                        </svg>
                        {config.lemaInstitucion && (
                            <p className="text-xs mt-2 tracking-[0.2em] italic" style={{ color: secondary }}>
                                "{config.lemaInstitucion}"
                            </p>
                        )}
                    </div>
                </div>

                {/* CUERPO PRINCIPAL */}
                <div className="flex flex-col items-center text-center">

                    {/* Título del Diploma con fondo curvo */}
                    <div className="relative mb-4">
                        {/* Fondo con bordes redondeados */}
                        <div
                            className="absolute inset-0 -inset-x-12 -inset-y-2 rounded-full opacity-10"
                            style={{ backgroundColor: primary }}
                        />

                        <h1
                            className="text-5xl font-bold tracking-[0.15em] uppercase relative z-10 px-8"
                            style={{
                                color: primary,
                                fontFamily: '"Poppins", "Montserrat", sans-serif'
                            }}
                        >
                            {config.tituloDiploma}
                        </h1>
                    </div>

                    {/* Separador con hojas/curvas */}
                    <div className="flex items-center gap-4 mb-3">
                        <svg width="40" height="20" viewBox="0 0 40 20">
                            <path d="M40,10 Q30,0 20,10 Q10,20 0,10" fill="none" stroke={secondary} strokeWidth="2" />
                        </svg>
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: primary }}
                        />
                        <svg width="40" height="20" viewBox="0 0 40 20">
                            <path d="M0,10 Q10,0 20,10 Q30,20 40,10" fill="none" stroke={secondary} strokeWidth="2" />
                        </svg>
                    </div>

                    {/* Subtítulo */}
                    <p
                        className="text-xs tracking-[0.3em] uppercase mb-3 font-medium whitespace-nowrap"
                        style={{ color: secondary }}
                    >
                        {config.subtituloDiploma || 'OTORGADO A'}
                    </p>

                    {/* Nombre del Estudiante */}
                    <div className={`relative mb-4 mx-auto ${getAdaptiveMaxWidth(student.nombres)}`}>
                        <h2
                            className="font-bold italic py-2"
                            style={{
                                color: primary,
                                fontFamily: '"Playfair Display", "Georgia", serif',
                                fontSize: getAdaptiveFontSize(student.nombres, 3.5),
                                ...getNoTruncateStyles()
                            }}
                        >
                            {student.nombres}
                        </h2>

                        {/* Línea con círculos */}
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: secondary, opacity: 0.5 }} />
                            <div className="w-24 h-[2px] rounded-full" style={{ backgroundColor: primary }} />
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: secondary }} />
                            <div className="w-24 h-[2px] rounded-full" style={{ backgroundColor: primary }} />
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: secondary, opacity: 0.5 }} />
                        </div>
                    </div>

                    {/* Texto del diploma */}
                    <div className="max-w-3xl mx-auto">
                        <p
                            className="text-base leading-relaxed"
                            style={{ color: textColor, opacity: 0.85 }}
                            dangerouslySetInnerHTML={{ __html: processDiplomaText(config.plantillaTexto, config, student) }}
                        />
                    </div>

                    {/* Fecha integrada */}
                    <div className="text-right w-full max-w-3xl mt-4">
                        <span
                            className="text-sm tracking-wider italic"
                            style={{ color: textColor, opacity: 0.6 }}
                        >
                            {config.fechaLugar}
                        </span>
                    </div>
                </div>

                {/* FOOTER - Firmas */}
                <div className="flex justify-center gap-16 items-end">
                    {config.firmas.map((signer) => (
                        <div key={signer.id} className="text-center min-w-[160px]">
                            <div className="h-12 flex items-end justify-center mb-1">
                                {signer.firmaImage && (
                                    <img
                                        src={signer.firmaImage}
                                        className="max-h-full max-w-[150px] object-contain mix-blend-multiply"
                                        alt="Firma"
                                    />
                                )}
                            </div>

                            {/* Línea de firma simple */}
                            <div
                                className="h-[2px] w-full rounded-full"
                                style={{ backgroundColor: primary }}
                            />

                            <p
                                className="font-bold text-xs tracking-wider uppercase mt-2"
                                style={{ color: primary }}
                            >
                                {signer.nombre}
                            </p>
                            <p
                                className="text-[10px] tracking-wider mt-0.5"
                                style={{ color: secondary }}
                            >
                                {signer.cargo}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Medalla con diseño circular */}
            {config.mostrarMedalla && (
                <div className="absolute bottom-28 right-12 z-20">
                    <svg width="60" height="60" viewBox="0 0 60 60">
                        <defs>
                            <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={primary} />
                                <stop offset="100%" stopColor={secondary} />
                            </linearGradient>
                        </defs>
                        <circle cx="30" cy="30" r="28" fill="url(#circleGrad)" />
                        <circle cx="30" cy="30" r="22" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />
                        <circle cx="30" cy="30" r="16" fill="none" stroke="white" strokeWidth="1" opacity="0.3" />
                        <text x="30" y="36" textAnchor="middle" fontSize="18" fill="white">★</text>
                    </svg>
                </div>
            )}
        </div>
    );
};
