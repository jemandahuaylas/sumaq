import React, { useState } from 'react';
import { ConfigPanel } from './ConfigPanel';
import { DiplomaPreview } from './DiplomaPreview';
import { DiplomaDocument } from './pdf/DiplomaDocument';
import { useDiplomaStore } from '../store/diplomaStore';
import { Download, ChevronLeft, ChevronRight, FileDown } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

export const App = () => {
    const { config, students } = useDiplomaStore();
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);

    // Navegación en Preview
    const nextStudent = () => {
        if (currentStudentIndex < students.length - 1) setCurrentStudentIndex(prev => prev + 1);
    };
    const prevStudent = () => {
        if (currentStudentIndex > 0) setCurrentStudentIndex(prev => prev - 1);
    };

    const handleDownloadPDF = async () => {
        setIsGenerating(true);
        try {
            // Generar documento con TODOS los estudiantes
            // Si no hay estudiantes, usar un dummy para demo
            const studentsToPrint = students.length > 0 ? students : [{
                id: 'demo', nombres: 'NOMBRE ESTUDIANTE', grado: 'GRADO', nivel: 'NIVEL', puesto: 'PUESTO'
            }];

            const blob = await pdf(
                <DiplomaDocument config={config} students={studentsToPrint} />
            ).toBlob();

            saveAs(blob, `Diplomas-${config.institucionNombre}.pdf`);
        } catch (error) {
            console.error("Error generando PDF:", error);
            alert("Hubo un error generando el PDF. Revisa la consola.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">

            {/* Sidebar de Configuración */}
            <ConfigPanel />

            {/* Área Principal */}
            <div className="flex-1 flex flex-col relative h-full min-w-0 overflow-hidden">

                {/* Barra Superior de Herramientas */}
                <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <h1 className="font-bold text-lg text-slate-800 tracking-tight">Generador de Diplomas</h1>
                        <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full">{students.length} estudiantes</span>
                    </div>

                    <div className="flex items-center gap-4">

                        {/* Navegación de Estudiantes (Solo visible si hay más de 1) */}
                        {students.length > 0 && (
                            <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
                                <button onClick={prevStudent} disabled={currentStudentIndex === 0} className="p-1.5 hover:bg-white rounded-md disabled:opacity-30 transition-all"><ChevronLeft size={16} /></button>
                                <span className="text-xs font-mono w-16 text-center text-slate-600">
                                    {currentStudentIndex + 1} / {students.length}
                                </span>
                                <button onClick={nextStudent} disabled={currentStudentIndex === students.length - 1} className="p-1.5 hover:bg-white rounded-md disabled:opacity-30 transition-all"><ChevronRight size={16} /></button>
                            </div>
                        )}

                        <button
                            onClick={handleDownloadPDF}
                            disabled={isGenerating}
                            className={`flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95 ${isGenerating ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {isGenerating ? (
                                <>Generando...</>
                            ) : (
                                <>
                                    <FileDown size={18} /> Descargar PDF
                                </>
                            )}
                        </button>
                    </div>
                </header>

                {/* Área de Visualización */}
                <main className="flex-1 overflow-auto bg-slate-100/50 p-8 flex items-center justify-center">
                    <DiplomaPreview
                        config={config}
                        student={students.length > 0 ? students[currentStudentIndex] : undefined}
                    />
                </main>

            </div>
        </div>
    );
};
