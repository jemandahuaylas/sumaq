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
        <div className="w-full h-full relative overflow-hidden font-serif bg-white" style={{ backgroundColor: config.backgroundColor || '#FAFAF9', color: config.textColor || '#0F172A' }}>
            {/* --- FONDO & MARCOS --- */}

            {/* Marca de Agua Gigante */}
            {/* Marca de Agua Gigante */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none z-0">
                {(() => {
                    const firstLogo = (config.logos && config.logos.length > 0) ? config.logos[0].src : config.logoColegio;
                    return firstLogo ? (
                        <img src={firstLogo} className="w-[600px] h-[600px] object-contain grayscale" />
                    ) : (
                        <div className="w-[500px] h-[600px] border-[20px] border-black rounded-[50%]"></div>
                    );
                })()}
            </div>

            {/* Marco Exterior */}
            <div className="absolute inset-3 border-2 z-20" style={{ borderColor: primary }}></div>
            {/* Marco Interior */}
            <div className="absolute inset-5 border z-20" style={{ borderColor: secondary }}></div>

            {/* Esquinas Ornamentales */}
            {[
                'top-3 left-3 border-t-4 border-l-4',
                'top-3 right-3 border-t-4 border-r-4',
                'bottom-3 left-3 border-b-4 border-l-4',
                'bottom-3 right-3 border-b-4 border-r-4'
            ].map((cls, i) => (
                <div key={i} className={`absolute w-16 h-16 z-30 ${cls}`} style={{ borderColor: primary }}></div>
            ))}


            {/* --- ZONA 1: HEADER (Rígida - Top 25%) --- */}
            <div className="absolute top-0 left-0 w-full h-[25%] px-20 pt-12 z-30 flex items-start justify-center">
                {(() => {
                    let logos = config.logos?.map(l => l.src) || [];
                    if (logos.length === 0) {
                        logos = [config.logoColegio, config.logoUgel, config.logoMinedu].filter(Boolean) as string[];
                    }

                    const InstitutionTitle = () => (
                        <div className="text-center mt-2 border-b border-slate-300 pb-2 mx-auto max-w-3xl">
                            <h2
                                className="font-semibold tracking-[0.15em] uppercase leading-tight"
                                style={{
                                    color: primary,
                                    fontSize: `${config.institucionFontSize || 22}px` // Default smaller for classic look
                                }}
                            >
                                {config.institucionNombre}
                            </h2>
                            {config.lemaInstitucion && (
                                <p className="text-[10px] italic mt-1 font-medium tracking-widest uppercase" style={{ color: secondary }}>
                                    &ldquo;{config.lemaInstitucion}&rdquo;
                                </p>
                            )}
                        </div>
                    );

                    // Single Logo
                    if (logos.length <= 1) {
                        return (
                            <div className="flex flex-col items-center justify-center h-full -mt-2">
                                {logos[0] && <img src={logos[0]} className="h-20 object-contain drop-shadow-sm mb-2 opacity-90 hover:opacity-100 transition-opacity" alt="Logo" />}
                                <InstitutionTitle />
                            </div>
                        );
                    }

                    // Multiple Logos
                    const mid = Math.ceil(logos.length / 2);
                    const leftLogos = logos.slice(0, mid);
                    const rightLogos = logos.slice(mid);

                    return (
                        <div className="w-full text-center relative h-full">
                            <div className="absolute top-0 left-0 flex items-start gap-6 max-w-[25%]">
                                {leftLogos.map((src, i) => (
                                    <img key={i} src={src} className="h-16 object-contain grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100" />
                                ))}
                            </div>
                            <div className="absolute top-0 right-0 flex items-start gap-6 justify-end max-w-[25%]">
                                {rightLogos.map((src, i) => (
                                    <img key={i} src={src} className="h-16 object-contain grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100" />
                                ))}
                            </div>

                            <div className="flex items-end justify-center h-full pb-2">
                                <InstitutionTitle />
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* --- ZONA 2: CUERPO (Rígida - Middle 53%) --- */}
            <div className="absolute top-[25%] left-0 w-full bottom-[22%] px-24 z-20 flex flex-col items-center justify-center">

                {/* Título Diploma */}
                <div className="text-center mb-6 relative">
                    <h1 className="text-6xl tracking-[0.2em] font-medium text-slate-900 uppercase transform scale-y-90"
                        style={{ fontFamily: '"Cinzel", serif', color: primary }}>
                        {config.tituloDiploma}
                    </h1>
                    <div className="h-px w-32 mx-auto mt-3 bg-slate-300 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-400 to-transparent animate-shimmer"></div>
                    </div>
                </div>

                <p className="text-xs italic text-slate-500 font-serif mb-4 tracking-widest">
                    {config.subtituloDiploma || 'OTORGADO A:'}
                </p>

                {/* Nombre Estudiante */}
                <div className="w-full text-center relative mb-8">
                    {/* Decorative side lines */}
                    <div className="absolute top-1/2 left-0 w-[10%] h-px bg-gradient-to-r from-transparent to-slate-200"></div>
                    <div className="absolute top-1/2 right-0 w-[10%] h-px bg-gradient-to-l from-transparent to-slate-200"></div>

                    <h2 className="text-5xl font-serif italic text-slate-800 px-8 py-2 capitalize truncate leading-tight"
                        style={{ color: primary, textShadow: '0px 1px 1px rgba(0,0,0,0.05)' }}>
                        {student.nombres}
                    </h2>
                </div>

                {/* Texto */}
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-lg text-slate-600 font-serif leading-loose text-justify-center"
                        dangerouslySetInnerHTML={{ __html: processDiplomaText(config.plantillaTexto, config, student) }} />
                </div>
            </div>

            {/* --- ZONA 3: FOOTER (Rígida - Bottom 22%) --- */}
            <div className="absolute bottom-0 left-0 w-full h-[22%] px-16 pb-12 z-30 flex flex-col justify-end">
                {/* Fecha */}
                <div className="text-right text-xs italic text-slate-500 font-serif mb-6 pr-6">
                    {config.fechaLugar}
                </div>

                {/* Firmas */}
                <div className="flex justify-center gap-x-8 items-end w-full px-8">
                    {config.firmas.map((signer) => (
                        <div key={signer.id} className="text-center min-w-[160px] relative">
                            <div className="h-16 flex items-end justify-center mb-2">
                                {signer.firmaImage && <img src={signer.firmaImage} className="max-h-full max-w-[180px] object-contain mix-blend-multiply" />}
                            </div>
                            <div className="h-px w-full bg-slate-800 mb-2"></div>
                            <p className="font-bold text-xs tracking-wider uppercase text-slate-900">{signer.nombre}</p>
                            <p className="text-[10px] italic text-slate-500 mt-0.5" style={{ color: secondary }}>{signer.cargo}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
