import React from 'react';
import type { DiplomaConfig, Student } from '../../../types';
import { processDiplomaText } from '../utils';

interface TemplateProps {
    config: DiplomaConfig;
    student: Student;
}

export const Secundaria01: React.FC<TemplateProps> = ({ config, student }) => {
    const primary = config.primaryColor || '#0F172A'; // Default slate-900
    const secondary = config.secondaryColor || '#CA8A04'; // Default yellow-600

    return (
        <div className="w-full h-full relative overflow-hidden font-serif" style={{ backgroundColor: config.backgroundColor || '#FAFAF9', color: config.textColor || '#0F172A' }}>
            {/* Medalla Honorífica Solemne */}
            {config.mostrarMedalla && (
                <div className="absolute top-10 right-10 z-30 opacity-90 mix-blend-multiply">
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="45" stroke={secondary} strokeWidth="2" strokeDasharray="4 2" />
                        <circle cx="50" cy="50" r="40" stroke={primary} strokeWidth="1" />
                        <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" fill={secondary} fillOpacity="0.2" />
                        <circle cx="50" cy="50" r="25" fill={primary} fillOpacity="0.1" />
                        <text x="50" y="53" textAnchor="middle" fontSize="10" fill={primary} fontFamily="serif" fontWeight="bold">HONOR</text>
                    </svg>
                </div>
            )}
            {/* Marco Doble Elegante */}
            <div className="absolute inset-4 border z-20" style={{ borderColor: primary }}></div>
            <div className="absolute inset-6 border z-20" style={{ borderColor: secondary }}></div>

            {/* Marca de Agua Central */}
            {config.logoColegio && (
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <img src={config.logoColegio} className="w-[500px] h-[500px] grayscale brightness-50" />
                </div>
            )}

            {/* Adornos Esquinas */}
            <div className="absolute top-4 left-4 w-20 h-20 border-t-4 border-l-4 z-30" style={{ borderColor: primary }}></div>
            <div className="absolute bottom-4 right-4 w-20 h-20 border-b-4 border-r-4 z-30" style={{ borderColor: primary }}></div>

            <div className="relative z-10 flex flex-col items-center justify-between h-full py-8 px-24">

                {/* Encabezado Clásico */}
                {/* Encabezado Clásico Dinámico */}
                <div className="w-full mb-6">
                    {(() => {
                        let logos = config.logos?.map(l => l.src) || [];
                        if (logos.length === 0) {
                            logos = [config.logoColegio, config.logoUgel, config.logoMinedu].filter(Boolean) as string[];
                        }

                        // Scenario 1: Single Logo -> Center Stack (Classic)
                        if (logos.length <= 1) {
                            return (
                                <div className="text-center">
                                    <div className="flex justify-center gap-6 mb-4 items-center h-20">
                                        {logos[0] && <img src={logos[0]} className="h-20 object-contain drop-shadow-sm" />}
                                    </div>
                                    <h2 className="text-lg font-medium tracking-[0.2em] uppercase border-b border-slate-300 pb-1 inline-block" style={{ color: primary }}>
                                        {config.institucionNombre}
                                    </h2>
                                </div>
                            );
                        }

                        // Scenario 2 & 3: Distributed Header Bar
                        const mid = Math.ceil(logos.length / 2);
                        const leftLogos = logos.slice(0, mid);
                        const rightLogos = logos.slice(mid);

                        return (
                            <div className="w-full flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4 min-w-[100px] flex-wrap">
                                    {leftLogos.map((src, i) => (
                                        <img key={i} src={src} className="h-16 object-contain grayscale hover:grayscale-0 transition-all opacity-90" />
                                    ))}
                                </div>

                                <div className="text-center px-4 flex-1">
                                    <h2 className="text-lg font-medium tracking-[0.2em] uppercase border-b border-slate-300 pb-1 inline-block" style={{ color: primary }}>
                                        {config.institucionNombre}
                                    </h2>
                                </div>

                                <div className="flex items-center gap-4 justify-end min-w-[100px] flex-wrap">
                                    {rightLogos.map((src, i) => (
                                        <img key={i} src={src} className="h-16 object-contain grayscale hover:grayscale-0 transition-all opacity-90" />
                                    ))}
                                </div>
                            </div>
                        );
                    })()}
                </div>

                {/* Título en Oro y Negro */}
                <div className="text-center mb-6">
                    <h1 className="text-5xl font-serif tracking-widest mb-1 font-medium" style={{ color: primary }}>
                        {config.tituloDiploma}
                    </h1>
                    <div className="h-1 w-20 mx-auto" style={{ backgroundImage: `linear-gradient(to right, transparent, ${secondary}, transparent)` }}></div>
                </div>

                {/* Contenido Principal */}
                <div className="text-center w-full flex-1 flex flex-col justify-center pb-2">
                    <p className="text-xs italic text-slate-500 font-serif mb-4">Otorgado a:</p>

                    <div className="text-4xl font-serif mb-6 py-2 border-y border-slate-100 italic capitalize" style={{ color: primary }}>
                        {student.nombres}
                    </div>

                    <div className="max-w-2xl mx-auto mb-3">
                        <p className="text-base leading-relaxed text-slate-700 font-serif text-justify-center"
                            dangerouslySetInnerHTML={{ __html: processDiplomaText(config.plantillaTexto, config, student) }}
                        />
                    </div>
                </div>

                {/* Footer Solemne */}
                <div className="w-full flex flex-col items-end mt-2 px-8 relative">
                    {/* Fecha Inamovible a la derecha, sobre firmas */}
                    <div className="text-xs italic text-slate-500 font-serif mb-3 pr-4">
                        {config.fechaLugar}
                    </div>

                    <div className="w-full flex justify-center gap-12">
                        {config.firmas.map((signer) => (
                            <div key={signer.id} className="text-center w-40">
                                <div className="h-14 flex items-end justify-center mb-1">{signer.firmaImage && <img src={signer.firmaImage} className="max-h-full" />}</div>
                                <div className="h-px w-full mb-1" style={{ backgroundColor: primary }}></div>
                                <p className="font-serif font-bold text-xs tracking-wide" style={{ color: primary }}>{signer.nombre}</p>
                                <p className="text-[9px] text-slate-500 uppercase tracking-widest">{signer.cargo}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
