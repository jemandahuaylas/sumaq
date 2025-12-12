import React from 'react';
import type { DiplomaConfig, Student } from '../../../types';
import { processDiplomaText } from '../utils';

interface TemplateProps {
    config: DiplomaConfig;
    student: Student;
}

export const Primaria01: React.FC<TemplateProps> = ({ config, student }) => {
    const primary = config.primaryColor || '#2563EB'; // Default blue
    const secondary = config.secondaryColor || '#14B8A6'; // Default teal

    return (
        <div className="w-full h-full relative overflow-hidden text-slate-800 font-sans" style={{ backgroundColor: config.backgroundColor || '#ffffff', color: config.textColor || '#1e293b' }}>
            {/* --- FONDO GEOMÉTRICO (Absolute) --- */}
            {/* Grid Pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.03] z-0" xmlns="http://www.w3.org/2000/svg">
                <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke={primary} strokeWidth="1" /></pattern></defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Bandas Laterales */}
            <div className="absolute left-0 top-0 bottom-0 w-3 z-20" style={{ backgroundColor: primary }}></div>
            <div className="absolute right-0 top-0 bottom-0 w-3 z-20" style={{ backgroundColor: secondary }}></div>

            {/* Esquinas Geométricas */}
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[150px] border-l-[150px] border-l-transparent z-10 opacity-10" style={{ borderTopColor: secondary }}></div>
            <div className="absolute bottom-0 left-0 w-0 h-0 border-b-[150px] border-r-[150px] border-r-transparent z-10 opacity-10" style={{ borderBottomColor: primary }}></div>


            {/* --- ZONA 1: HEADER (Rígida - Top 25%) --- */}
            <div className="absolute top-0 left-0 w-full h-[25%] px-16 pt-10 z-30">
                {(() => {
                    let logos = config.logos?.map(l => l.src) || [];
                    if (logos.length === 0) {
                        logos = [config.logoColegio, config.logoUgel, config.logoMinedu].filter(Boolean) as string[];
                    }

                    const InstitutionTitle = () => (
                        <div className="text-center mt-2 border-b-2 border-slate-100 pb-4 mx-auto max-w-4xl">
                            <h2
                                className="font-bold text-slate-900 uppercase tracking-tight leading-none"
                                style={{ fontSize: `${config.institucionFontSize || 28}px` }} // Default slightly smaller for Primary elegance
                            >
                                {config.institucionNombre}
                            </h2>
                            {config.lemaInstitucion && (
                                <span className="text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest inline-block mt-2"
                                    style={{ backgroundColor: `${primary}10`, color: primary }}>
                                    {config.lemaInstitucion}
                                </span>
                            )}
                        </div>
                    );

                    // Single Logo
                    if (logos.length <= 1) {
                        return (
                            <div className="flex flex-col items-center justify-center h-full -mt-4">
                                {logos[0] && <img src={logos[0]} className="h-24 object-contain drop-shadow-sm mb-1 hover:scale-105 transition-transform" alt="Logo" />}
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
                            {/* Logo Row - Absolute Top */}
                            <div className="absolute top-0 left-0 flex items-start gap-4 flex-wrap max-w-[25%]">
                                {leftLogos.map((src, i) => (
                                    <img key={i} src={src} className="h-20 object-contain drop-shadow-sm hover:scale-105 transition-transform" />
                                ))}
                            </div>
                            <div className="absolute top-0 right-0 flex items-start gap-4 justify-end flex-wrap max-w-[25%]">
                                {rightLogos.map((src, i) => (
                                    <img key={i} src={src} className="h-20 object-contain drop-shadow-sm hover:scale-105 transition-transform" />
                                ))}
                            </div>

                            {/* Title - Centered & Pushed Down */}
                            <div className="flex items-end justify-center h-full pb-2">
                                <InstitutionTitle />
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* --- ZONA 2: CUERPO (Rígida - Middle 53%) --- */}
            <div className="absolute top-[25%] left-0 w-full bottom-[22%] px-20 z-20 flex flex-col items-center justify-center">

                {/* Título Diploma */}
                <div className="mb-4 text-center">
                    <h1 className="text-7xl font-sans font-black tracking-tight uppercase"
                        style={{
                            WebkitTextStroke: '2px #334155',
                            color: 'transparent',
                            letterSpacing: '0.05em'
                        }}>
                        {config.tituloDiploma}
                    </h1>
                    <div className="h-1.5 w-32 mx-auto mt-2 rounded-full" style={{ backgroundImage: `linear-gradient(to right, ${primary}, ${secondary})` }}></div>
                </div>

                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-2 bg-slate-50 px-4 py-1 rounded border border-slate-100">
                    Se confiere el presente a:
                </p>

                {/* Nombre Estudiante */}
                <div className="relative inline-block mb-8 w-full text-center">
                    <div className="absolute inset-0 blur-2xl opacity-20 transform scale-x-110" style={{ backgroundColor: primary }}></div>
                    <h2 className="relative text-6xl font-black uppercase italic transform -skew-x-6 z-10 truncate px-4 leading-tight mb-2"
                        style={{ fontFamily: 'Impact, sans-serif', color: primary, textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                        {student.nombres}
                    </h2>
                </div>

                {/* Texto */}
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-xl text-slate-600 font-light leading-relaxed line-clamp-3" dangerouslySetInnerHTML={{ __html: processDiplomaText(config.plantillaTexto, config, student) }} />
                </div>
            </div>

            {/* --- ZONA 3: FOOTER (Rígida - Bottom 22%) --- */}
            <div className="absolute bottom-0 left-0 w-full h-[22%] px-16 pb-12 z-30 flex flex-col justify-end">
                {/* Fecha */}
                <div className="text-right text-xs font-bold text-slate-400 mb-6 uppercase tracking-wider pr-4">
                    {config.fechaLugar}
                </div>

                {/* Firmas */}
                <div className="flex justify-center gap-x-20 items-end w-full px-4 border-t border-slate-100 pt-6">
                    {config.firmas.map((signer) => (
                        <div key={signer.id} className="text-center min-w-[200px] group relative">
                            <div className="h-16 flex items-end justify-center mb-2 relative">
                                {signer.firmaImage && <img src={signer.firmaImage} className="max-h-full max-w-[180px] object-contain drop-shadow-sm transition-transform group-hover:scale-105" />}
                            </div>
                            <div className="h-0.5 w-full bg-slate-300 mb-2 group-hover:bg-slate-400 transition-colors"></div>
                            <p className="font-bold text-sm text-slate-800 tracking-tight">{signer.nombre}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: secondary }}>{signer.cargo}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ID Discreto */}
            <div className="absolute bottom-2 left-6 text-[9px] text-slate-200 font-mono z-10">
                ID: {student.id.split('-')[0]}
            </div>
        </div>
    );
};
