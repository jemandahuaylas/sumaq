import React from 'react';
import type { DiplomaConfig, Student } from '../../../types';
import { processDiplomaText } from '../utils';

interface TemplateProps {
    config: DiplomaConfig;
    student: Student;
}

/**
 * Primaria02 - "Geometría del Éxito"
 * Diseño moderno con formas geométricas, colores vibrantes y composición dinámica.
 * Ideal para reconocimientos de primaria con un toque contemporáneo.
 */
export const Primaria02: React.FC<TemplateProps> = ({ config, student }) => {
    const primary = config.primaryColor || '#EC4899';
    const secondary = config.secondaryColor || '#8B5CF6';
    const bgColor = config.backgroundColor || '#FEFEFE';
    const textColor = config.textColor || '#1E293B';

    return (
        <div
            className="w-full h-full relative overflow-hidden font-sans"
            style={{ backgroundColor: bgColor, color: textColor }}
        >
            {/* Formas geométricas de fondo */}

            {/* Hexágono grande superior izquierda */}
            <svg className="absolute -top-20 -left-20 w-64 h-64 opacity-10" viewBox="0 0 100 100">
                <polygon
                    points="50,1 93.3,25 93.3,75 50,99 6.7,75 6.7,25"
                    fill={primary}
                />
            </svg>

            {/* Círculo acento superior derecha */}
            <div
                className="absolute -top-10 right-20 w-40 h-40 rounded-full opacity-20"
                style={{ background: `radial-gradient(circle, ${secondary}, transparent)` }}
            />

            {/* Triángulos decorativos */}
            <svg className="absolute top-32 right-12 w-20 h-20 opacity-15" viewBox="0 0 100 100">
                <polygon points="50,10 90,90 10,90" fill={secondary} />
            </svg>

            {/* Hexágono pequeño inferior derecha */}
            <svg className="absolute bottom-20 right-32 w-32 h-32 opacity-10" viewBox="0 0 100 100">
                <polygon
                    points="50,1 93.3,25 93.3,75 50,99 6.7,75 6.7,25"
                    fill={secondary}
                />
            </svg>

            {/* Círculo grande inferior izquierda */}
            <div
                className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-15"
                style={{ background: `radial-gradient(circle, ${primary}, transparent)` }}
            />

            {/* Rayas decorativas diagonales en esquina inferior derecha */}
            <svg className="absolute bottom-0 right-0 w-48 h-48 opacity-5" viewBox="0 0 100 100">
                <line x1="0" y1="100" x2="100" y2="0" stroke={primary} strokeWidth="4" />
                <line x1="10" y1="100" x2="100" y2="10" stroke={secondary} strokeWidth="4" />
                <line x1="20" y1="100" x2="100" y2="20" stroke={primary} strokeWidth="4" />
            </svg>

            {/* Marco principal con esquinas cortadas */}
            <div className="absolute inset-8">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon
                        points="5,0 95,0 100,5 100,95 95,100 5,100 0,95 0,5"
                        fill="none"
                        stroke={primary}
                        strokeWidth="0.4"
                        opacity="0.3"
                    />
                </svg>
            </div>

            {/* Contenido principal */}
            <div className="relative z-10 w-full h-full flex flex-col px-20 py-14 justify-between">

                {/* Header - Logos e Institución */}
                <div className="space-y-4">
                    {/* Logos */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            {(() => {
                                const logos = config.logos?.map(l => l.src) || [];
                                if (logos.length === 0 && config.logoColegio) {
                                    return <img src={config.logoColegio} className="h-16 object-contain" alt="Logo" />;
                                }
                                return logos.slice(0, 2).map((src, i) => (
                                    <img key={i} src={src} className="h-14 object-contain" alt={`Logo ${i + 1}`} />
                                ));
                            })()}
                        </div>
                        <div className="flex items-center gap-4">
                            {(() => {
                                const logos = config.logos?.map(l => l.src) || [];
                                return logos.slice(2, 4).map((src, i) => (
                                    <img key={i} src={src} className="h-14 object-contain" alt={`Logo ${i + 3}`} />
                                ));
                            })()}
                        </div>
                    </div>

                    {/* Nombre institución centrado */}
                    <div className="text-center">
                        <h2
                            className="font-black uppercase tracking-wider leading-tight"
                            style={{
                                color: primary,
                                fontSize: `${config.institucionFontSize || 24}px`,
                                fontFamily: '"Inter", "Roboto", sans-serif'
                            }}
                        >
                            {config.institucionNombre}
                        </h2>
                        {config.lemaInstitucion && (
                            <p
                                className="text-xs mt-1 tracking-[0.2em] uppercase font-semibold"
                                style={{ color: secondary }}
                            >
                                {config.lemaInstitucion}
                            </p>
                        )}
                    </div>
                </div>

                {/* Cuerpo central */}
                <div className="flex flex-col items-center text-center flex-1 justify-center -mt-4">

                    {/* Título del diploma */}
                    <div className="mb-4">
                        <h1
                            className="text-7xl font-black uppercase tracking-tight"
                            style={{
                                color: textColor,
                                fontFamily: '"Archivo Black", "Impact", sans-serif',
                                background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            {config.tituloDiploma}
                        </h1>

                        {/* Línea decorativa con puntos */}
                        <div className="flex items-center justify-center gap-2 mt-3">
                            <div className="w-3 h-3 rotate-45" style={{ backgroundColor: primary }} />
                            <div className="w-20 h-0.5" style={{ backgroundColor: secondary }} />
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }} />
                            <div className="w-20 h-0.5" style={{ backgroundColor: secondary }} />
                            <div className="w-3 h-3 rotate-45" style={{ backgroundColor: primary }} />
                        </div>
                    </div>

                    {/* Subtítulo */}
                    <p
                        className="text-sm tracking-[0.4em] uppercase font-bold mb-6 whitespace-nowrap"
                        style={{ color: secondary, opacity: 0.8 }}
                    >
                        {config.subtituloDiploma || 'SE OTORGA A'}
                    </p>

                    {/* Nombre del estudiante con fondo decorativo */}
                    <div className="relative mb-6 w-full max-w-3xl">
                        {/* Barra decorativa de fondo */}
                        <div
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-20 -skew-x-6 opacity-10 -z-10"
                            style={{ backgroundColor: primary }}
                        />

                        <h2
                            className="text-5xl font-bold capitalize py-3 relative z-10"
                            style={{
                                color: primary,
                                fontFamily: '"Poppins", "Montserrat", sans-serif'
                            }}
                        >
                            {student.nombres}
                        </h2>

                        {/* Elementos geométricos decorativos alrededor del nombre */}
                        <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-4 h-4 rotate-45" style={{ backgroundColor: secondary, opacity: 0.3 }} />
                        <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-4 h-4 rotate-45" style={{ backgroundColor: secondary, opacity: 0.3 }} />
                    </div>

                    {/* Texto del diploma con fondo sutil */}
                    <div className="max-w-3xl mx-auto bg-white/40 backdrop-blur-sm p-6 rounded-2xl border-2 border-white shadow-lg">
                        <p
                            className="text-lg leading-relaxed"
                            style={{ color: textColor }}
                            dangerouslySetInnerHTML={{ __html: processDiplomaText(config.plantillaTexto, config, student) }}
                        />
                    </div>

                    {/* Fecha con estilo moderno */}
                    <div className="mt-4 flex items-center gap-3">
                        <div className="w-8 h-0.5" style={{ backgroundColor: primary, opacity: 0.3 }} />
                        <p
                            className="text-sm font-semibold tracking-wider"
                            style={{ color: secondary }}
                        >
                            {config.fechaLugar}
                        </p>
                        <div className="w-8 h-0.5" style={{ backgroundColor: primary, opacity: 0.3 }} />
                    </div>
                </div>

                {/* Footer - Firmas */}
                <div className="flex justify-center gap-16 items-end">
                    {config.firmas.map((signer) => (
                        <div key={signer.id} className="text-center min-w-[180px] group">
                            <div className="h-16 flex items-end justify-center mb-2">
                                {signer.firmaImage && (
                                    <img
                                        src={signer.firmaImage}
                                        className="max-h-full max-w-[160px] object-contain mix-blend-multiply"
                                        alt="Firma"
                                    />
                                )}
                            </div>

                            {/* Línea de firma sólida */}
                            <div
                                className="h-1 w-full mb-2 rounded-full"
                                style={{ backgroundColor: primary }}
                            />

                            <p
                                className="font-bold text-sm uppercase tracking-wide"
                                style={{ color: primary }}
                            >
                                {signer.nombre}
                            </p>
                            <p
                                className="text-xs font-semibold uppercase tracking-wider"
                                style={{ color: secondary, opacity: 0.7 }}
                            >
                                {signer.cargo}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Medalla decorativa con diseño geométrico */}
            {config.mostrarMedalla && (
                <div className="absolute top-28 right-16 z-30">
                    <svg width="90" height="90" viewBox="0 0 100 100" className="filter drop-shadow-lg">
                        <defs>
                            <linearGradient id="medalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFD700" />
                                <stop offset="50%" stopColor="#FFA500" />
                                <stop offset="100%" stopColor="#FFD700" />
                            </linearGradient>
                        </defs>

                        {/* Hexágono dorado */}
                        <polygon
                            points="50,5 85,25 85,65 50,85 15,65 15,25"
                            fill="url(#medalGrad)"
                        />

                        {/* Hexágono interior */}
                        <polygon
                            points="50,15 75,28 75,62 50,75 25,62 25,28"
                            fill="#FFF"
                            opacity="0.3"
                        />

                        {/* Estrella central */}
                        <polygon
                            points="50,25 54,40 69,40 57,48 61,63 50,54 39,63 43,48 31,40 46,40"
                            fill="#D4AF37"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
};
