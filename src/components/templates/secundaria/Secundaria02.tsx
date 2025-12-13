import React from 'react';
import type { DiplomaConfig, Student } from '../../../types';
import { processDiplomaText } from '../utils';

interface TemplateProps {
    config: DiplomaConfig;
    student: Student;
}

/**
 * Secundaria02 - "Horizonte Académico"
 * Diseño moderno y audaz con formas geométricas prominentes.
 */
export const Secundaria02: React.FC<TemplateProps> = ({ config, student }) => {
    const primary = config.primaryColor || '#1E3A5F';
    const secondary = config.secondaryColor || '#C9A227';
    const bgColor = config.backgroundColor || '#FEFEFE';
    const textColor = config.textColor || '#1E293B';

    return (
        <div
            className="w-full h-full relative overflow-hidden font-sans"
            style={{ backgroundColor: bgColor, color: textColor }}
        >
            {/* === FORMAS GEOMÉTRICAS AUDACES === */}

            {/* Círculo grande esquina superior derecha */}
            <div
                className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full"
                style={{
                    background: `linear-gradient(135deg, ${primary}15 0%, ${primary}05 100%)`,
                    border: `3px solid ${primary}20`
                }}
            />

            {/* Círculo mediano */}
            <div
                className="absolute top-20 right-20 w-[180px] h-[180px] rounded-full"
                style={{
                    border: `2px solid ${secondary}40`
                }}
            />

            {/* Triángulo grande esquina inferior izquierda */}
            <svg
                className="absolute -bottom-10 -left-10 w-[300px] h-[300px]"
                viewBox="0 0 100 100"
            >
                <polygon
                    points="0,100 100,100 0,0"
                    fill={`${primary}08`}
                    stroke={primary}
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                />
            </svg>

            {/* Hexágono decorativo */}
            <svg
                className="absolute top-1/2 -left-16 w-[200px] h-[200px] -translate-y-1/2"
                viewBox="0 0 100 100"
            >
                <polygon
                    points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                    fill="none"
                    stroke={secondary}
                    strokeWidth="1"
                    strokeOpacity="0.3"
                />
            </svg>

            {/* Rombo grande derecha */}
            <svg
                className="absolute bottom-20 -right-20 w-[250px] h-[250px]"
                viewBox="0 0 100 100"
            >
                <polygon
                    points="50,0 100,50 50,100 0,50"
                    fill={`${secondary}10`}
                    stroke={secondary}
                    strokeWidth="1"
                    strokeOpacity="0.4"
                />
            </svg>

            {/* Líneas diagonales decorativas */}
            <div
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{
                    background: `repeating-linear-gradient(
                        -45deg,
                        transparent,
                        transparent 80px,
                        ${primary}03 80px,
                        ${primary}03 81px
                    )`
                }}
            />

            {/* Barra lateral izquierda gruesa */}
            <div
                className="absolute left-0 top-[15%] bottom-[15%] w-3"
                style={{
                    background: `linear-gradient(180deg, ${secondary} 0%, ${primary} 50%, ${secondary} 100%)`
                }}
            />

            {/* Puntos decorativos esquina superior izquierda */}
            <div className="absolute top-8 left-12 flex gap-2">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{
                            backgroundColor: i % 2 === 0 ? secondary : primary,
                            opacity: 0.6 - (i * 0.1)
                        }}
                    />
                ))}
            </div>

            {/* Puntos decorativos esquina inferior derecha */}
            <div className="absolute bottom-8 right-12 flex gap-2">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{
                            backgroundColor: i % 2 === 0 ? primary : secondary,
                            opacity: 0.6 - (i * 0.1)
                        }}
                    />
                ))}
            </div>

            {/* === CONTENIDO PRINCIPAL === */}
            <div className="relative z-10 w-full h-full flex flex-col px-20 py-6 justify-between">

                {/* 1. LOGOS */}
                <div className="flex items-center justify-between">
                    {/* Logos a la izquierda */}
                    <div className="flex items-center gap-6">
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

                    {/* Logos a la derecha */}
                    <div className="flex items-center gap-6">
                        {(() => {
                            const logos = config.logos?.map(l => l.src) || [];
                            return logos.slice(2, 4).map((src, i) => (
                                <img key={i} src={src} className="h-14 object-contain" alt={`Logo ${i + 3}`} />
                            ));
                        })()}
                    </div>
                </div>

                {/* 2. INSTITUCIÓN EDUCATIVA */}
                <div className="text-center">
                    <p
                        className="font-semibold tracking-[0.15em] uppercase"
                        style={{
                            color: primary,
                            fontSize: `${config.institucionFontSize || 18}px`
                        }}
                    >
                        {config.institucionNombre}
                    </p>
                    {config.lemaInstitucion && (
                        <p
                            className="text-xs mt-1 tracking-[0.2em] italic"
                            style={{ color: secondary }}
                        >
                            "{config.lemaInstitucion}"
                        </p>
                    )}
                </div>

                {/* CUERPO PRINCIPAL */}
                <div className="flex flex-col items-center text-center">

                    {/* 3. TÍTULO DEL DIPLOMA */}
                    <div className="relative mb-3">
                        {/* Forma hexagonal detrás del título */}
                        <svg
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[100px]"
                            viewBox="0 0 500 100"
                            preserveAspectRatio="none"
                        >
                            <polygon
                                points="25,50 50,5 450,5 475,50 450,95 50,95"
                                fill="none"
                                stroke={secondary}
                                strokeWidth="2"
                                strokeOpacity="0.5"
                            />
                        </svg>

                        <h1
                            className="text-5xl font-black tracking-[0.25em] uppercase relative z-10 py-4"
                            style={{
                                color: primary,
                                fontFamily: '"Inter", "Outfit", sans-serif'
                            }}
                        >
                            {config.tituloDiploma}
                        </h1>
                    </div>

                    {/* 4. SUBTÍTULO / OTORGADO */}
                    <p
                        className="text-xs tracking-[0.5em] uppercase mb-4 font-semibold whitespace-nowrap"
                        style={{ color: secondary }}
                    >
                        {config.subtituloDiploma || 'OTORGADO A'}
                    </p>

                    {/* 5. NOMBRE DEL ESTUDIANTE */}
                    <div className="relative w-full max-w-4xl mb-5">
                        {/* Línea con triángulos */}
                        <div className="flex items-center justify-center gap-4 mb-3">
                            <svg width="40" height="20" viewBox="0 0 40 20">
                                <polygon points="40,10 20,0 20,20" fill={secondary} opacity="0.7" />
                            </svg>
                            <div className="w-32 h-[2px]" style={{ backgroundColor: secondary }} />
                            <div className="w-3 h-3 rotate-45" style={{ backgroundColor: primary }} />
                            <div className="w-32 h-[2px]" style={{ backgroundColor: secondary }} />
                            <svg width="40" height="20" viewBox="0 0 40 20">
                                <polygon points="0,10 20,0 20,20" fill={secondary} opacity="0.7" />
                            </svg>
                        </div>

                        <h2
                            className="text-5xl font-bold tracking-wide"
                            style={{
                                color: primary,
                                fontFamily: '"Playfair Display", "Georgia", serif'
                            }}
                        >
                            {student.nombres}
                        </h2>

                        {/* Línea inferior con círculos */}
                        <div className="flex items-center justify-center gap-3 mt-3">
                            <div className="w-24 h-[2px]" style={{ backgroundColor: primary, opacity: 0.4 }} />
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: secondary }} />
                            <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: primary }} />
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: secondary }} />
                            <div className="w-24 h-[2px]" style={{ backgroundColor: primary, opacity: 0.4 }} />
                        </div>
                    </div>

                    {/* 6. CUERPO / TEXTO DEL DIPLOMA */}
                    <div className="max-w-3xl mx-auto">
                        <p
                            className="text-base leading-relaxed"
                            style={{ color: textColor, opacity: 0.85 }}
                            dangerouslySetInnerHTML={{ __html: processDiplomaText(config.plantillaTexto, config, student) }}
                        />
                    </div>

                    {/* 7. FECHA - Integrada con el cuerpo */}
                    <div className="text-right w-full max-w-3xl mx-auto mt-4">
                        <span
                            className="text-sm tracking-wider italic"
                            style={{ color: textColor, opacity: 0.6 }}
                        >
                            {config.fechaLugar}
                        </span>
                    </div>
                </div>

                {/* FOOTER - Solo Firmas */}
                <div>

                    {/* Firmas */}
                    <div className="flex justify-center gap-20 items-end">
                        {config.firmas.map((signer) => (
                            <div key={signer.id} className="text-center min-w-[180px]">
                                <div className="h-14 flex items-end justify-center mb-2">
                                    {signer.firmaImage && (
                                        <img
                                            src={signer.firmaImage}
                                            className="max-h-full max-w-[160px] object-contain mix-blend-multiply"
                                            alt="Firma"
                                        />
                                    )}
                                </div>

                                {/* Línea de firma simple */}
                                <div className="w-full h-[2px]" style={{ backgroundColor: primary }} />

                                <p
                                    className="font-bold text-sm tracking-wider uppercase mt-2"
                                    style={{ color: primary }}
                                >
                                    {signer.nombre}
                                </p>
                                <p
                                    className="text-xs tracking-wider"
                                    style={{ color: secondary }}
                                >
                                    {signer.cargo}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Medalla con forma de escudo */}
            {config.mostrarMedalla && (
                <div className="absolute bottom-28 right-20 z-20">
                    <svg width="70" height="85" viewBox="0 0 70 85">
                        <path
                            d="M35,0 L70,15 L70,50 Q70,75 35,85 Q0,75 0,50 L0,15 Z"
                            fill={`url(#shieldGradient-${student.id})`}
                            stroke={primary}
                            strokeWidth="2"
                        />
                        <defs>
                            <linearGradient id={`shieldGradient-${student.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={secondary} />
                                <stop offset="50%" stopColor="#FFE066" />
                                <stop offset="100%" stopColor={secondary} />
                            </linearGradient>
                        </defs>
                        <text
                            x="35" y="50"
                            textAnchor="middle"
                            fontSize="28"
                            fill={primary}
                        >
                            🏆
                        </text>
                    </svg>
                </div>
            )}
        </div>
    );
};
