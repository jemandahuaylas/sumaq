import React, { useState, useRef } from 'react';
import { ConfigPanel } from './ConfigPanel';
import { DiplomaPreview, DIPLOMA_DESIGNS } from './DiplomaPreview';
import type { DiplomaPreviewHandle } from './DiplomaPreview';
import { useDiplomaStore } from '../store/diplomaStore';
import { NotificationProvider, useNotification } from './NotificationProvider';
import { Download, ChevronLeft, ChevronRight, FileDown, Archive, FileText, ChevronDown, Loader2 } from 'lucide-react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { domToJpeg } from 'modern-screenshot';
import { jsPDF } from 'jspdf';
import type { Student } from '../types';

// Configuración de exportación
const EXPORT_CONFIG = {
    scale: 2,
    quality: 0.9,
    pixelWidth: 1123,
    pixelHeight: 794,
    pageWidth: 297,
    pageHeight: 210,
};

// Componente interno que usa el contexto de notificaciones
const AppContent = () => {
    const { config, students } = useDiplomaStore();
    const { showToast } = useNotification();
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatingProgress, setGeneratingProgress] = useState<string>('');
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const diplomaPreviewRef = useRef<DiplomaPreviewHandle>(null);

    // Navegación en Preview
    const nextStudent = () => {
        if (currentStudentIndex < students.length - 1) setCurrentStudentIndex(prev => prev + 1);
    };
    const prevStudent = () => {
        if (currentStudentIndex > 0) setCurrentStudentIndex(prev => prev - 1);
    };

    /**
     * Captura el elemento actual del diploma y lo convierte a JPEG
     */
    const captureDiplomaAsJpeg = async (element: HTMLElement): Promise<string> => {
        // Guardar estilos originales
        const originalTransform = element.style.transform;
        const originalTransformOrigin = element.style.transformOrigin;

        try {
            // Remover transform para captura limpia
            element.style.transform = 'none';
            element.style.transformOrigin = 'top left';

            // Esperar a que se apliquen los estilos
            await new Promise(r => requestAnimationFrame(r));
            await new Promise(r => setTimeout(r, 50));

            const dataUrl = await domToJpeg(element, {
                scale: EXPORT_CONFIG.scale,
                quality: EXPORT_CONFIG.quality,
                backgroundColor: '#ffffff',
                width: EXPORT_CONFIG.pixelWidth,
                height: EXPORT_CONFIG.pixelHeight,
                style: {
                    transform: 'none',
                    transformOrigin: 'top left',
                },
            });

            return dataUrl;
        } finally {
            // Restaurar estilos originales
            element.style.transform = originalTransform;
            element.style.transformOrigin = originalTransformOrigin;
        }
    };

    /**
     * Renderiza un diploma para un estudiante específico y lo captura
     * Crea un contenedor temporal fuera de pantalla
     */
    const renderAndCaptureDiploma = async (student: Student): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            // Crear contenedor fuera de pantalla
            const container = document.createElement('div');
            container.style.cssText = `
                position: fixed;
                left: -10000px;
                top: 0;
                width: ${EXPORT_CONFIG.pixelWidth}px;
                height: ${EXPORT_CONFIG.pixelHeight}px;
                overflow: hidden;
                background: white;
                z-index: -9999;
            `;
            document.body.appendChild(container);

            // Crear elemento con el mismo estilo que el diploma principal
            const diplomaWrapper = document.createElement('div');
            diplomaWrapper.style.cssText = `
                width: ${EXPORT_CONFIG.pixelWidth}px;
                height: ${EXPORT_CONFIG.pixelHeight}px;
                background: white;
                position: relative;
                overflow: hidden;
            `;
            container.appendChild(diplomaWrapper);

            try {
                // Importar React para renderizar
                const { createRoot } = await import('react-dom/client');
                const root = createRoot(diplomaWrapper);

                // Obtener el componente de diseño correspondiente
                const DesignComponent = DIPLOMA_DESIGNS[config.selectedDesign] || DIPLOMA_DESIGNS['secundaria-01'];

                // Renderizar el diploma
                root.render(<DesignComponent config={config} student={student} />);

                // Esperar a que se renderice y las imágenes carguen
                await new Promise(r => setTimeout(r, 300));

                // Capturar
                const dataUrl = await domToJpeg(diplomaWrapper, {
                    scale: EXPORT_CONFIG.scale,
                    quality: EXPORT_CONFIG.quality,
                    backgroundColor: '#ffffff',
                    width: EXPORT_CONFIG.pixelWidth,
                    height: EXPORT_CONFIG.pixelHeight,
                });

                root.unmount();
                document.body.removeChild(container);
                resolve(dataUrl);
            } catch (error) {
                document.body.removeChild(container);
                reject(error);
            }
        });
    };

    // Descargar el diploma actualmente visible
    const handleDownloadSingle = async () => {
        setIsGenerating(true);
        setShowDownloadMenu(false);
        setGeneratingProgress('Capturando diploma...');

        try {
            // Obtener el elemento del diploma
            let diplomaElement = diplomaPreviewRef.current?.getDiplomaElement();
            if (!diplomaElement) {
                diplomaElement = document.getElementById('diploma-container') as HTMLDivElement;
            }

            if (!diplomaElement) {
                throw new Error('No se encontró el elemento del diploma.');
            }

            // Capturar como JPEG
            const imgData = await captureDiplomaAsJpeg(diplomaElement);

            // Crear PDF
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
                compress: true,
            });

            pdf.addImage(imgData, 'JPEG', 0, 0, EXPORT_CONFIG.pageWidth, EXPORT_CONFIG.pageHeight, undefined, 'FAST');

            // Descargar
            const blob = pdf.output('blob');
            const studentName = students[currentStudentIndex]?.nombres || 'Demo';
            const cleanName = studentName.replace(/[^a-z0-9\s-]/gi, '').trim() || 'Diploma';
            saveAs(blob, `Diploma-${cleanName}.pdf`);
        } catch (error) {
            console.error('Error generando PDF individual:', error);
            showToast('error', 'Error al generar PDF', error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setIsGenerating(false);
            setGeneratingProgress('');
        }
    };

    // Descargar PDF multipágina con todos los estudiantes
    const handleDownloadMultipage = async () => {
        setIsGenerating(true);
        setShowDownloadMenu(false);

        try {
            const studentsToPrint = students.length > 0 ? students : [{
                id: 'demo',
                nombres: 'ESTUDIANTE EJEMPLO',
                grado: '5°',
                nivel: config.nivel || 'Secundaria',
                puesto: '1er Puesto'
            } as Student];

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
                compress: true,
            });

            for (let i = 0; i < studentsToPrint.length; i++) {
                setGeneratingProgress(`Procesando ${i + 1} de ${studentsToPrint.length}...`);

                const imgData = await renderAndCaptureDiploma(studentsToPrint[i]);

                if (i > 0) {
                    pdf.addPage('a4', 'landscape');
                }

                pdf.addImage(imgData, 'JPEG', 0, 0, EXPORT_CONFIG.pageWidth, EXPORT_CONFIG.pageHeight, undefined, 'FAST');
            }

            setGeneratingProgress('Guardando archivo...');
            const blob = pdf.output('blob');
            const institutionName = config.institucionNombre?.replace(/[^a-z0-9\s-]/gi, '').trim() || 'Institucion';
            saveAs(blob, `Diplomas-${institutionName}.pdf`);
        } catch (error) {
            console.error('Error generando PDF multipágina:', error);
            showToast('error', 'Error al generar PDF', 'Hubo un problema generando el documento multipágina.');
        } finally {
            setIsGenerating(false);
            setGeneratingProgress('');
        }
    };

    // Descargar ZIP con PDFs individuales
    const handleDownloadZip = async () => {
        if (students.length === 0) {
            return handleDownloadMultipage();
        }

        setIsGenerating(true);
        setShowDownloadMenu(false);

        try {
            const zip = new JSZip();
            const institutionName = config.institucionNombre?.replace(/[^a-z0-9\s-]/gi, '').trim() || 'Export';
            const folder = zip.folder(`Diplomas-${institutionName}`);

            for (let i = 0; i < students.length; i++) {
                setGeneratingProgress(`Generando ${i + 1} de ${students.length}...`);

                const imgData = await renderAndCaptureDiploma(students[i]);

                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'mm',
                    format: 'a4',
                    compress: true,
                });

                pdf.addImage(imgData, 'JPEG', 0, 0, EXPORT_CONFIG.pageWidth, EXPORT_CONFIG.pageHeight, undefined, 'FAST');

                const blob = pdf.output('blob');
                const cleanName = students[i].nombres.replace(/[^a-z0-9\s-]/gi, '').trim() || `Estudiante-${i + 1}`;
                folder?.file(`${cleanName}.pdf`, blob);
            }

            setGeneratingProgress('Comprimiendo ZIP...');
            const content = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 }
            });

            saveAs(content, `Diplomas-${institutionName}.zip`);
        } catch (error) {
            console.error('Error generando ZIP:', error);
            showToast('error', 'Error al generar ZIP', 'Hubo un problema comprimiendo los archivos.');
        } finally {
            setIsGenerating(false);
            setGeneratingProgress('');
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

                        {/* Navegación de Estudiantes */}
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
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span className="text-sm">{generatingProgress || 'Generando...'}</span>
                                    </>
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
                                                    <span className="text-[10px] text-slate-400 block leading-tight">Solo el estudiante visible ({students[currentStudentIndex]?.nombres?.split(' ')[0] || 'Demo'})</span>
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
                        ref={diplomaPreviewRef}
                        config={config}
                        student={students.length > 0 ? students[currentStudentIndex] : undefined}
                    />
                </main>

            </div>
        </div>
    );
};

// Exportar App con el Provider de notificaciones
export const App = () => (
    <NotificationProvider>
        <AppContent />
    </NotificationProvider>
);
