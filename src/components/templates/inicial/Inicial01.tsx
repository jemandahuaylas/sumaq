import React from 'react';
import type { DiplomaConfig, Student } from '../../../types';
import { processDiplomaText, getAdaptiveFontSize, getNoTruncateStyles, getAdaptiveMaxWidth } from '../utils';

interface TemplateProps {
    config: DiplomaConfig;
    student: Student;
}

export const Inicial01: React.FC<TemplateProps> = ({ config, student }) => {
    const primary = config.primaryColor || '#F97316'; // Default orange
    const secondary = config.secondaryColor || '#EC4899'; // Default pink

    return (
        <div className="w-full h-full relative overflow-hidden font-sans" style={{ backgroundColor: config.backgroundColor || '#FFF7ED', color: config.textColor || '#1e293b' }}>
            {/* Medalla Honorífica */}
            {config.mostrarMedalla && (
                <div className="absolute top-20 left-24 z-30 drop-shadow-xl animate-in zoom-in duration-700">
                    <svg width="90" height="90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Cintas */}
                        <path d="M30 70 L30 15 L70 15 L70 70 L50 60 L30 70 Z" fill="#EF4444" />
                        <path d="M40 70 L40 15 L60 15 L60 70 L50 62 L40 70 Z" fill="#DC2626" />
                        {/* Medalla Circular */}
                        <circle cx="50" cy="40" r="25" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
                        <circle cx="50" cy="40" r="20" fill="#F59E0B" stroke="#D97706" strokeWidth="1" strokeDasharray="2 2" />
                        {/* Estrella Central */}
                        <path d="M50 28 L54 36 L62 37 L56 42 L58 50 L50 46 L42 50 L44 42 L38 37 L46 36 L50 28 Z" fill="#FEF3C7" />
                    </svg>
                </div>
            )}

            {/* Elementos Decorativos de Fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-bl-full opacity-20 z-0" style={{ backgroundColor: secondary }}></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-tr-full opacity-20 z-0" style={{ backgroundColor: primary }}></div>
            <div className="absolute top-10 left-10 opacity-20" style={{ color: secondary }}><svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg></div>
            <div className="absolute bottom-20 right-20 opacity-20" style={{ color: primary }}><svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg></div>

            {/* Borde Lúdico */}
            <div className="absolute inset-6 border-4 border-dashed rounded-3xl pointer-events-none z-20" style={{ borderColor: primary, opacity: 0.5 }}></div>

            {/* --- ZONA 1: HEADER (Rígida) --- */}
            <div className="absolute top-0 left-0 w-full h-[25%] px-16 pt-12 z-30 flex items-start justify-center">
                <div className="w-full">
                    {(() => {
                        let logos = config.logos?.map(l => l.src) || [];
                        if (logos.length === 0) {
                            logos = [config.logoColegio, config.logoUgel, config.logoMinedu].filter(Boolean) as string[];
                        }

                        const InstitutionTitle = () => (
                            <div className="text-center mt-2">
                                <h2
                                    className="font-bold tracking-wider uppercase mb-1 leading-tight px-4"
                                    style={{
                                        color: primary,
                                        fontSize: `${config.institucionFontSize || 32}px` // Increased default
                                    }}
                                >
                                    {config.institucionNombre}
                                </h2>
                                <div className="h-1 w-24 mx-auto rounded-full" style={{ backgroundColor: secondary }}></div>
                                {config.lemaInstitucion && (
                                    <div className="mt-1.5 inline-block px-4 py-1 rounded-xl bg-white/60 border border-white/80 shadow-sm backdrop-blur-[2px]">
                                        <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: secondary }}>
                                            {config.lemaInstitucion}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );

                        if (logos.length === 0) return <InstitutionTitle />;

                        if (logos.length === 1) {
                            return (
                                <div className="flex flex-col items-center justify-center">
                                    <img src={logos[0]} className="h-24 object-contain drop-shadow-md hover:scale-105 transition-transform" alt="Logo" />
                                    <InstitutionTitle />
                                </div>
                            );
                        }

                        const mid = Math.ceil(logos.length / 2);
                        const leftLogos = logos.slice(0, mid);
                        const rightLogos = logos.slice(mid);

                        return (
                            <div className="w-full text-center relative">
                                <div className="absolute top-0 left-0 flex items-start gap-4 flex-wrap max-w-[40%]">
                                    {leftLogos.map((src, i) => (
                                        <img key={i} src={src} className="h-20 object-contain drop-shadow-md hover:scale-105 transition-transform" alt={`L${i}`} />
                                    ))}
                                </div>
                                <div className="absolute top-0 right-0 flex items-start gap-4 justify-end flex-wrap max-w-[40%]">
                                    {rightLogos.map((src, i) => (
                                        <img key={i} src={src} className="h-20 object-contain drop-shadow-md hover:scale-105 transition-transform" alt={`R${i}`} />
                                    ))}
                                </div>
                                <div className="pt-20"> {/* Push title down to clear logos roughly */}
                                    <InstitutionTitle />
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* --- ZONA 2: CUERPO (Rígida, Scroll si es necesario o truncamiento) --- */}
            <div className="absolute top-[25%] left-0 w-full bottom-[28%] px-16 z-20 flex flex-col items-center justify-center">
                {/* Título Principal */}
                <div className="text-center relative mb-4">
                    <h1 className="text-6xl font-black text-transparent bg-clip-text py-1"
                        style={{
                            fontFamily: '"Comic Neue", "Quicksand", sans-serif',
                            backgroundImage: `linear-gradient(to right, ${primary}, ${secondary})`
                        }}>
                        {config.tituloDiploma}
                    </h1>
                    <div className="text-sm font-semibold text-slate-500 tracking-wide uppercase bg-white/50 px-6 py-1.5 rounded-full inline-block mt-1 backdrop-blur-sm shadow-sm border border-white/60 whitespace-nowrap">
                        {config.subtituloDiploma || 'OTORGADO CON ALEGRÍA A:'}
                    </div>
                </div>

                {/* Nombre Estudiante */}
                <div className="text-center mb-6 relative py-2 w-full">
                    <span className="absolute top-0 left-[10%] text-3xl opacity-20 select-none pointer-events-none">✨</span>
                    <h2 className={`font-bold capitalize drop-shadow-sm leading-tight px-4 mx-auto ${getAdaptiveMaxWidth(student.nombres)}`}
                        style={{
                            fontFamily: '"Fredoka", sans-serif',
                            color: config.textColor || '#1e293b',
                            fontSize: getAdaptiveFontSize(student.nombres, 4),
                            ...getNoTruncateStyles()
                        }}>
                        {student.nombres}
                    </h2>
                    <span className="absolute bottom-0 right-[10%] text-3xl opacity-20 select-none pointer-events-none">🌟</span>
                </div>

                {/* Texto del Diploma */}
                <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
                    <div className="text-center bg-white/80 p-6 rounded-3xl backdrop-blur-md shadow-lg border border-white/50">
                        <p className="text-lg text-slate-700 leading-relaxed font-medium line-clamp-4" dangerouslySetInnerHTML={{ __html: processDiplomaText(config.plantillaTexto, config, student) }} />
                    </div>
                </div>
            </div>

            {/* --- ZONA 3: FOOTER (Rígida, Bottom Fixed) --- */}
            <div className="absolute bottom-0 left-0 w-full h-[28%] px-12 pb-16 z-30 flex flex-col justify-end">
                {/* Fecha */}
                <div className="w-full flex justify-end pr-8 mb-4">
                    <div className="text-right font-bold font-script text-lg flex items-center gap-2" style={{ color: secondary }}>
                        {config.fechaLugar}
                    </div>
                </div>

                {/* Firmas */}
                <div className="flex justify-center gap-x-16 items-end w-full px-4">
                    {config.firmas.map((signer) => (
                        <div key={signer.id} className="flex flex-col items-center min-w-[180px] relative group">
                            <div className="h-16 flex items-end justify-center mb-1 w-full relative">
                                {signer.firmaImage && <img src={signer.firmaImage} className="max-h-full max-w-[140px] object-contain drop-shadow-sm transition-transform hover:scale-110" />}
                            </div>
                            <div className="w-full h-1 rounded-full mb-1.5" style={{ backgroundColor: primary, opacity: 0.4 }}></div>
                            <p className="font-bold text-sm text-center leading-tight truncate w-full px-2" style={{ color: primary }}>{signer.nombre}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-center" style={{ color: secondary, opacity: 0.8 }}>{signer.cargo}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
