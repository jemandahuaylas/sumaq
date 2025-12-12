import React from 'react';
import type { DiplomaConfig, Student } from '../../../types';
import { processDiplomaText } from '../utils';

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

            <div className="relative z-10 flex flex-col items-center justify-between h-full pt-12 pb-8 px-16">
                {/* Cabecera */}
                {/* Cabecera */}
                {/* Cabecera */}
                <div className="w-full mb-8">
                    {(() => {
                        // Priority: New 'logos' array -> Legacy fields
                        let logos = config.logos?.map(l => l.src) || [];
                        if (logos.length === 0) {
                            logos = [config.logoColegio, config.logoUgel, config.logoMinedu].filter(Boolean) as string[];
                        }

                        if (logos.length === 0) return null;

                        if (logos.length === 1) {
                            return (
                                <div className="flex flex-col items-center justify-center">
                                    <img src={logos[0]} className="h-24 object-contain drop-shadow-md mb-2" alt="Logo" />
                                    <div className="text-center">
                                        <h2 className="text-xl font-bold tracking-wider uppercase mb-1" style={{ color: primary }}>{config.institucionNombre}</h2>
                                        <div className="h-1 w-24 mx-auto rounded-full" style={{ backgroundColor: secondary }}></div>
                                    </div>
                                </div>
                            );
                        }

                        // Default layout handles 0, 2, 3+
                        // 2 logos: Left/Right
                        // 3 logos: 2 Left / 1 Right (as requested)
                        // More than 3? Split evenly? Or user 2 left / rest right?
                        // "dos al lado izquierdo y el otro al lado derecho y asi" -> "and so on".
                        // Assuming alternating or filling lists.
                        // I will assign: Math.ceil(n/2) to Left, rest to Right?
                        // User said: "si hay tres, dos al lado izquierdo y el otro al lado derecho".
                        // This implies Left heavy?
                        // Let's split: Left gets first (N+1)/2 items. Right gets rest.
                        // 3 -> 2 Left, 1 Right.
                        // 4 -> 2 Left, 2 Right.
                        // 5 -> 3 Left, 2 Right.
                        const mid = Math.ceil(logos.length / 2);
                        // If 3: mid=2. Left=2, Right=1. Correct.
                        // If 2: mid=1. Left=1, Right=1. Correct.
                        const leftLogos = logos.slice(0, mid);
                        const rightLogos = logos.slice(mid);

                        return (
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-4 min-w-[100px] flex-wrap">
                                    {leftLogos.map((src, i) => (
                                        <img key={i} src={src} className="h-20 object-contain drop-shadow-md" alt={`L${i}`} />
                                    ))}
                                </div>

                                <div className="text-center px-4 flex-1">
                                    <h2 className="text-xl font-bold tracking-wider uppercase mb-1" style={{ color: primary }}>{config.institucionNombre}</h2>
                                    <div className="h-1 w-24 mx-auto rounded-full" style={{ backgroundColor: secondary }}></div>
                                </div>

                                <div className="flex items-center gap-4 min-w-[100px] justify-end flex-wrap">
                                    {rightLogos.map((src, i) => (
                                        <img key={i} src={src} className="h-20 object-contain drop-shadow-md" alt={`R${i}`} />
                                    ))}
                                </div>
                            </div>
                        );
                    })()}
                </div>

                {/* Título Principal */}
                {/* Título Principal */}
                <div className="text-center relative">
                    <h1 className="text-6xl font-black text-transparent bg-clip-text py-1"
                        style={{
                            fontFamily: '"Comic Neue", "Quicksand", sans-serif',
                            backgroundImage: `linear-gradient(to right, ${primary}, ${secondary})`
                        }}>
                        {config.tituloDiploma}
                    </h1>
                    <div className="text-sm font-semibold text-slate-500 tracking-widest uppercase bg-white/50 px-6 py-1.5 rounded-full inline-block mt-2 backdrop-blur-sm shadow-sm border border-white/60">
                        {config.subtituloDiploma || 'OTORGADO CON ALEGRÍA A:'}
                    </div>
                </div>

                {/* Nombre Estudiante */}
                <div className="text-center my-2 relative py-2">
                    <span className="absolute top-0 left-4 text-3xl opacity-20 select-none pointer-events-none">✨</span>
                    <h2 className="text-6xl font-bold capitalize drop-shadow-sm leading-tight px-12"
                        style={{ fontFamily: '"Fredoka", sans-serif', color: config.textColor || '#1e293b' }}>
                        {student.nombres}
                    </h2>
                    <span className="absolute bottom-0 right-4 text-3xl opacity-20 select-none pointer-events-none">🎈</span>
                </div>

                {/* Cuerpo del Texto y Fecha Agrupados */}
                <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
                    <div className="text-center bg-white/80 p-8 rounded-3xl backdrop-blur-md shadow-lg border border-white/50 transform hover:scale-[1.01] transition-transform">
                        <p className="text-xl text-slate-700 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: processDiplomaText(config.plantillaTexto, config, student) }} />
                    </div>

                    <div className="w-full flex justify-end pr-4">
                        <div className="text-right font-bold font-script text-lg flex items-center gap-2" style={{ color: secondary }}>
                            {config.fechaLugar} <span className="text-2xl">❤️</span>
                        </div>
                    </div>
                </div>

                {/* Footer Firmas */}
                <div className="w-full mt-auto pt-8">
                    <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 items-end w-full px-4 pb-12">
                        {config.firmas.map((signer) => (
                            <div key={signer.id} className="flex flex-col items-center min-w-[160px] z-20">
                                <div className="h-20 flex items-end justify-center mb-2 w-full relative">
                                    {signer.firmaImage && <img src={signer.firmaImage} className="max-h-full max-w-[140px] object-contain drop-shadow-sm transition-transform hover:scale-110" />}
                                </div>
                                <div className="w-full h-1 rounded-full mb-1.5" style={{ backgroundColor: primary, opacity: 0.4 }}></div>
                                <p className="font-bold text-sm text-center leading-tight truncate w-full" style={{ color: primary }}>{signer.nombre}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-center" style={{ color: secondary, opacity: 0.8 }}>{signer.cargo}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
