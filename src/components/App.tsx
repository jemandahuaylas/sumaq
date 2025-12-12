import React, { useState } from 'react';
import { ConfigPanel } from './ConfigPanel';
import { DiplomaPreview } from './DiplomaPreview';
import { DiplomaDocument } from './pdf/DiplomaDocument';
import { useDiplomaStore } from '../store/diplomaStore';
import { Download, ChevronLeft, ChevronRight, FileDown, Archive, FileText, ChevronDown } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export const App = () => {
    const { config, students } = useDiplomaStore();
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);

    // Navegación en Preview
    const nextStudent = () => {
        if (currentStudentIndex < students.length - 1) setCurrentStudentIndex(prev => prev + 1);
    };
    const prevStudent = () => {
        if (currentStudentIndex > 0) setCurrentStudentIndex(prev => prev - 1);
    };

    const handleDownloadMultipage = async () => {
        setIsGenerating(true);
        setShowDownloadMenu(false);
        try {
            const studentsToPrint = students.length > 0 ? students : [{
                id: 'demo', nombres: 'NOMBRE ESTUDIANTE', grado: 'GRADO', nivel: 'NIVEL', puesto: 'PUESTO'
            }];
            const blob = await pdf(<DiplomaDocument config={config} students={studentsToPrint} />).toBlob();
            saveAs(blob, `Diplomas-Completo-${config.institucionNombre || 'Institucion'}.pdf`);
        } catch (error) {
            console.error("Error generando PDF:", error);
            alert("Hubo un error generando el PDF.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadZip = async () => {
        if (students.length === 0) return handleDownloadMultipage();
        setIsGenerating(true);
        setShowDownloadMenu(false);
        try {
            const zip = new JSZip();
            const folder = zip.folder(`Diplomas-${config.institucionNombre || 'Export'}`);

            // Podríamos mostrar progreso aquí, pero por ahora solo el spinner global
            for (let i = 0; i < students.length; i++) {
                const s = students[i];
                const blob = await pdf(<DiplomaDocument config={config} students={[s]} />).toBlob();
                const cleanName = s.nombres.replace(/[^a-z0-9\s-]/gi, '').trim() || `Estudiante-${i + 1}`;
                folder?.file(`${cleanName}.pdf`, blob);
            }

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `Diplomas-${config.institucionNombre || 'Export'}.zip`);
        } catch (error) {
            console.error("Error generando ZIP:", error);
            alert("Hubo un error generando el ZIP.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadSingle = async () => {
        setIsGenerating(true);
        setShowDownloadMenu(false);
        try {
            const s = students.length > 0 ? students[currentStudentIndex] : {
                id: 'demo', nombres: 'NOMBRE ESTUDIANTE', grado: 'GRADO', nivel: 'NIVEL', puesto: 'PUESTO'
            };
            const blob = await pdf(<DiplomaDocument config={config} students={[s]} />).toBlob();
            saveAs(blob, `Diploma-${(s as any).nombres || 'Demo'}.pdf`);
        } catch (error) {
            console.error("Error generando PDF individual:", error);
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

                        <div className="relative">
                            <button
                                onClick={() => !isGenerating && setShowDownloadMenu(!showDownloadMenu)}
                                className={`flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95 ${isGenerating ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                {isGenerating ? (
                                    <>Generando...</>
                                ) : (
                                    <>
                                        <Download size={18} /> Descargar <ChevronDown size={14} className={`transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`} />
                                    </>
                                )}
                            </button>

                            {showDownloadMenu && !isGenerating && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowDownloadMenu(false)}></div>
                                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 origin-top-right">
                                        <div className="space-y-1">
                                            <button onClick={handleDownloadMultipage} className="w-full text-left px-3 py-3 hover:bg-slate-50 rounded-lg flex items-center gap-4 group transition-colors">
                                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <span className="block text-sm font-bold text-slate-700">PDF Multipágina</span>
                                                    <span className="text-[10px] text-slate-400 block leading-tight">Un solo archivo con todos los diplomas</span>
                                                </div>
                                            </button>

                                            <button onClick={handleDownloadZip} className="w-full text-left px-3 py-3 hover:bg-slate-50 rounded-lg flex items-center gap-4 group transition-colors">
                                                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-100 transition-colors">
                                                    <Archive size={20} />
                                                </div>
                                                <div>
                                                    <span className="block text-sm font-bold text-slate-700">Descargar ZIP</span>
                                                    <span className="text-[10px] text-slate-400 block leading-tight">Archivos PDF separados por estudiante</span>
                                                </div>
                                            </button>

                                            <div className="h-px bg-slate-100 my-1 mx-3"></div>

                                            <button onClick={handleDownloadSingle} className="w-full text-left px-3 py-3 hover:bg-slate-50 rounded-lg flex items-center gap-4 group transition-colors">
                                                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors">
                                                    <FileDown size={20} />
                                                </div>
                                                <div>
                                                    <span className="block text-sm font-bold text-slate-700">Diploma Actual</span>
                                                    <span className="text-[10px] text-slate-400 block leading-tight">Solo el estudiante visible ({students[currentStudentIndex]?.nombres.split(' ')[0] || 'Demo'})</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
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
