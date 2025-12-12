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
        <div className="w-full h-full relative bg-amber-50 overflow-hidden font-sans text-slate-800">
            {/* Elementos Decorativos de Fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-bl-full opacity-20 z-0" style={{ backgroundColor: secondary }}></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-tr-full opacity-20 z-0" style={{ backgroundColor: primary }}></div>
            <div className="absolute top-10 left-10 opacity-20" style={{ color: secondary }}><svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg></div>
            <div className="absolute bottom-20 right-20 opacity-20" style={{ color: primary }}><svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg></div>

            {/* Borde Lúdico */}
            <div className="absolute inset-6 border-4 border-dashed rounded-3xl pointer-events-none z-20" style={{ borderColor: primary, opacity: 0.5 }}></div>

            <div className="relative z-10 flex flex-col items-center justify-between h-full py-6 px-16">
                {/* Cabecera */}
                <div className="w-full flex justify-between items-center mb-4">
                    <img src={config.logoColegio || ''} className="h-20 object-contain drop-shadow-md" alt="LC" />
                    <div className="text-center">
                        <h2 className="text-xl font-bold tracking-wider uppercase mb-1" style={{ color: primary }}>{config.institucionNombre}</h2>
                        <div className="h-1 w-24 mx-auto rounded-full" style={{ backgroundColor: secondary }}></div>
                    </div>
                    <img src={config.logoUgel || ''} className="h-16 object-contain drop-shadow-md opacity-80" alt="LU" />
                </div>

                {/* Título Principal */}
                <div className="text-center relative">
                    <h1 className="text-6xl font-black text-transparent bg-clip-text py-1"
                        style={{
                            fontFamily: '"Comic Neue", "Quicksand", sans-serif',
                            backgroundImage: `linear-gradient(to right, ${primary}, ${secondary})`
                        }}>
                        {config.tituloDiploma}
                    </h1>
                    <div className="text-sm font-semibold text-slate-500 tracking-widest uppercase bg-white/50 px-4 py-1 rounded-full inline-block mt-1 backdrop-blur-sm shadow-sm">
                        Otorgado con alegría a:
                    </div>
                </div>

                {/* Nombre Estudiante */}
                <div className="text-center my-4 relative">
                    <span className="absolute -top-4 -left-6 text-4xl opacity-20">✨</span>
                    <h2 className="text-5xl font-bold capitalize drop-shadow-sm leading-tight"
                        style={{ fontFamily: '"Fredoka", sans-serif', color: secondary }}>
                        {student.nombres}
                    </h2>
                    <span className="absolute -bottom-4 -right-6 text-4xl opacity-20">🎈</span>
                </div>

                {/* Cuerpo del Texto */}
                <div className="text-center max-w-3xl mx-auto bg-white/60 p-4 rounded-2xl backdrop-blur-sm shadow-sm border border-white/50 mb-2">
                    <p className="text-lg text-slate-700 leading-snug font-medium" dangerouslySetInnerHTML={{ __html: processDiplomaText(config.plantillaTexto, config, student) }} />
                </div>

                {/* Footer Firmas y Fecha */}
                <div className="w-full flex flex-col items-end pt-2 relative">
                    {/* Fecha alineada a la derecha */}
                    <div className="text-sm font-bold mb-2 pr-12 font-script" style={{ color: secondary }}>
                        {config.fechaLugar}
                    </div>

                    <div className="w-full flex justify-around items-end">
                        {config.firmas.map((signer) => (
                            <div key={signer.id} className="flex flex-col items-center">
                                <div className="h-16 flex items-end mb-1">{signer.firmaImage && <img src={signer.firmaImage} className="max-h-full" />}</div>
                                <div className="w-40 h-1 rounded-full mb-1" style={{ backgroundColor: primary, opacity: 0.3 }}></div>
                                <p className="font-bold text-sm" style={{ color: primary }}>{signer.nombre}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: secondary, opacity: 0.8 }}>{signer.cargo}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
