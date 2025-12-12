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
        <div className="w-full h-full relative bg-[#FDFBF7] overflow-hidden text-slate-900 font-serif">
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
                <div className="text-center mb-6">
                    <div className="flex justify-center gap-6 mb-4 items-center">
                        <img src={config.logoMinedu || ''} className="h-10 opacity-80" />
                        <div className="h-6 w-px bg-slate-400"></div>
                        <img src={config.logoColegio || ''} className="h-16" />
                    </div>
                    <h2 className="text-lg font-medium tracking-[0.2em] uppercase border-b border-slate-300 pb-1 inline-block" style={{ color: primary }}>
                        {config.institucionNombre}
                    </h2>
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
