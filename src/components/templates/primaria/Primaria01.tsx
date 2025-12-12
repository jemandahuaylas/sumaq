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
        <div className="w-full h-full relative overflow-hidden text-slate-800" style={{ backgroundColor: config.backgroundColor || '#ffffff', color: config.textColor || '#1e293b' }}>
            {/* Medalla Honorífica */}
            {config.mostrarMedalla && (
                <div className="absolute top-28 right-8 z-30 drop-shadow-xl animate-in fade-in zoom-in duration-700">
                    <svg width="80" height="120" viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40 0L80 20V50C80 85 40 120 40 120C40 120 0 85 0 50V20L40 0Z" fill="#F59E0B" fillOpacity="0.9" />
                        <path d="M40 8L72 24V50C72 80 40 108 40 108C40 108 8 80 8 50V24L40 8Z" stroke="#B45309" strokeWidth="2" />
                        <path d="M40 25V85M15 55H65" stroke="#B45309" strokeWidth="2" strokeOpacity="0.3" />
                        <circle cx="40" cy="55" r="15" fill="#FEF3C7" stroke="#B45309" strokeWidth="2" />
                        <path d="M35 55L38 60L45 50" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            )}
            {/* Fondo Geométrico */}
            <svg className="absolute inset-0 w-full h-full opacity-10 z-0" xmlns="http://www.w3.org/2000/svg">
                <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke={primary} strokeWidth="1" /></pattern></defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Bandas Laterales */}
            <div className="absolute left-0 top-0 bottom-0 w-4 z-20" style={{ backgroundColor: primary }}></div>
            <div className="absolute right-0 top-0 bottom-0 w-4 z-20" style={{ backgroundColor: secondary }}></div>

            {/* Esquina Decorativa */}
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[120px] border-l-[120px] border-l-transparent z-10" style={{ borderTopColor: secondary, opacity: 0.2 }}></div>
            <div className="absolute bottom-0 left-0 w-0 h-0 border-b-[120px] border-r-[120px] border-r-transparent z-10" style={{ borderBottomColor: primary, opacity: 0.2 }}></div>

            <div className="relative z-10 flex flex-col justify-between h-full py-6 px-20">
                {/* Cabecera Moderna */}
                <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
                    <div className="flex gap-4">
                        {config.logoColegio && <img src={config.logoColegio} className="h-16" />}
                        {config.logoUgel && <img src={config.logoUgel} className="h-12 opacity-70 grayscale hover:grayscale-0 transition-all" />}
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{config.institucionNombre}</h2>
                        <span className="text-xs font-bold px-3 py-1 rounded uppercase tracking-widest" style={{ backgroundColor: `${primary}20`, color: primary }}>Excelencia Educativa</span>
                    </div>
                </div>

                {/* Contenido Central */}
                <div className="text-center py-4 flex-1 flex flex-col justify-center pb-2">
                    <h1 className="text-6xl font-sans font-black tracking-tighter text-slate-900 mb-2 uppercase" style={{ WebkitTextStroke: '1px black', color: 'transparent' }}>
                        {config.tituloDiploma}
                    </h1>
                    <div className="h-1 w-24 mx-auto mb-6" style={{ backgroundImage: `linear-gradient(to right, ${primary}, ${secondary})` }}></div>

                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Se confiere el presente a:</p>

                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 blur-xl opacity-30 transform -skew-x-12" style={{ backgroundColor: primary }}></div>
                        <h2 className="relative text-5xl font-black uppercase transform -skew-x-6 z-10" style={{ fontFamily: 'Impact, sans-serif', color: primary }}>
                            {student.nombres}
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto mb-3">
                        <p className="text-xl text-slate-600 font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: processDiplomaText(config.plantillaTexto, config, student) }} />
                    </div>
                </div>

                {/* Footer Estrucurado */}
                <div className="w-full mt-2">
                    {/* Fecha a la derecha */}
                    <div className="text-right text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider pr-4">
                        {config.fechaLugar}
                    </div>

                    <div className="grid grid-cols-2 gap-20 border-t-2 border-slate-100 pt-4">
                        {config.firmas.slice(0, 2).map((signer) => (
                            <div key={signer.id} className="text-center">
                                <div className="h-14 flex items-end justify-center mb-1">{signer.firmaImage && <img src={signer.firmaImage} className="max-h-full" />}</div>
                                <div className="h-px w-full bg-slate-300 mb-1"></div>
                                <p className="font-bold text-sm">{signer.nombre}</p>
                                <p className="text-[10px] font-bold uppercase" style={{ color: secondary }}>{signer.cargo}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ID Discreto */}
                <div className="absolute bottom-2 left-6 text-[9px] text-slate-300 font-mono">
                    ID: {student.id.split('-')[0]}
                </div>
            </div>
        </div>
    );
};
