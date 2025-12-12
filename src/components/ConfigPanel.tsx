import React, { useState } from 'react';
import { useDiplomaStore } from '../store/diplomaStore';
import { importStudentsFromExcel } from '../lib/excel-utils';
import { Upload, X, Plus, Users, School, FileText, PenTool, LayoutTemplate, Palette, Grid, Sliders, Pencil, RotateCcw } from 'lucide-react';
import { StudentVerificationModal } from './StudentVerificationModal';
import type { Student } from '../types';

type TabId = 'estudiantes' | 'institucion' | 'disenos' | 'estilo' | 'contenido' | 'firmas';

export const ConfigPanel: React.FC = () => {
    const { config, students, setStudents, updateConfig, updateSigner, removeSigner, addSigner } = useDiplomaStore();
    const [activeTab, setActiveTab] = useState<TabId>('estudiantes');
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [pendingStudents, setPendingStudents] = useState<Student[]>([]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            try {
                const imported = await importStudentsFromExcel(e.target.files[0]);
                setPendingStudents(imported);
                setShowVerificationModal(true);
            } catch (error) {
                console.error("Error al importar:", error);
                alert("Error al leer el archivo Excel. Asegúrate de usar la plantilla correcta.");
            }
            // Reset input value to allow re-uploading the same file
            e.target.value = '';
        }
    };

    const handleConfirmImport = (verifiedStudents: Student[]) => {
        setStudents(verifiedStudents);
        setShowVerificationModal(false);
        setPendingStudents([]);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, key: 'logoColegio' | 'logoUgel' | 'logoMinedu') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateConfig({ [key]: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFirmaImageUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateSigner(id, { firmaImage: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const tabs = [
        { id: 'estudiantes', icon: Users, label: 'Estudiantes', color: 'bg-blue-600', text: 'text-blue-600' },
        { id: 'institucion', icon: School, label: 'Institución', color: 'bg-emerald-600', text: 'text-emerald-600' },
        { id: 'disenos', icon: Grid, label: 'Diseños', color: 'bg-amber-500', text: 'text-amber-600' },
        { id: 'estilo', icon: Palette, label: 'Estilo', color: 'bg-pink-500', text: 'text-pink-600' },
        { id: 'contenido', icon: FileText, label: 'Contenido', color: 'bg-violet-600', text: 'text-violet-600' },
        { id: 'firmas', icon: PenTool, label: 'Firmas', color: 'bg-rose-600', text: 'text-rose-600' },
    ];

    const [activeCategory, setActiveCategory] = useState('Todos');

    const AVAILABLE_DESIGNS = [
        {
            id: 'inicial-01',
            name: 'Alegría Infantil',
            category: 'Infantil',
            previewColor: 'bg-orange-100',
            available: true,
            defaultPalette: { primary: '#FB923C', secondary: '#F472B6', background: '#FFF7ED', text: '#1e293b' }
        },
        {
            id: 'primaria-01',
            name: 'Mérito Académico',
            category: 'Primaria',
            previewColor: 'bg-blue-100',
            available: true,
            defaultPalette: { primary: '#2563EB', secondary: '#FBBF24', background: '#ffffff', text: '#1e293b' }
        },
        {
            id: 'secundaria-01',
            name: 'Solemne Clásico',
            category: 'Secundaria',
            previewColor: 'bg-slate-100',
            available: true,
            defaultPalette: { primary: '#0F172A', secondary: '#D97706', background: '#FAFAF9', text: '#1e293b' }
        },
        // Placeholders para demostración de arquitectura escalable (30+ diseños)
        ...Array.from({ length: 10 }).map((_, i) => ({
            id: `infantil-${i + 2}`, name: `Infantil Creativo ${i + 1}`, category: 'Infantil', previewColor: 'bg-pink-50', available: false
        })),
        ...Array.from({ length: 8 }).map((_, i) => ({
            id: `primaria-${i + 2}`, name: `Excelencia Primaria ${i + 1}`, category: 'Primaria', previewColor: 'bg-sky-50', available: false
        })),
        ...Array.from({ length: 8 }).map((_, i) => ({
            id: `secundaria-${i + 2}`, name: `Honor Secundaria ${i + 1}`, category: 'Secundaria', previewColor: 'bg-gray-50', available: false
        })),
        ...Array.from({ length: 3 }).map((_, i) => ({
            id: `arte-${i + 1}`, name: `Bellas Artes ${i + 1}`, category: 'Arte', previewColor: 'bg-purple-50', available: false
        })),
        ...Array.from({ length: 3 }).map((_, i) => ({
            id: `deporte-${i + 1}`, name: `Mérito Deportivo ${i + 1}`, category: 'Deporte', previewColor: 'bg-green-50', available: false
        })),
    ];

    const categories = ['Todos', 'Infantil', 'Primaria', 'Secundaria', 'Arte', 'Deporte'];
    const filteredDesigns = activeCategory === 'Todos'
        ? AVAILABLE_DESIGNS
        : AVAILABLE_DESIGNS.filter(d => d.category === activeCategory);

    return (
        <div className="w-[450px] flex-shrink-0 bg-white border-r border-gray-200 h-screen flex shadow-2xl z-20 overflow-hidden font-sans">
            {/* Sidebar Navigation */}
            <div className="w-20 bg-slate-900 flex flex-col items-center py-8 gap-6 z-10 shadow-lg">
                <div className="mb-2">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <LayoutTemplate className="text-white" size={24} />
                    </div>
                </div>

                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabId)}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative group ${isActive ? 'bg-white shadow-lg scale-110' : 'hover:bg-white/10'}`}
                            title={tab.label}
                        >
                            <Icon size={24} className={`transition-colors duration-300 ${isActive ? tab.text : 'text-slate-400 group-hover:text-white'}`} />
                            {isActive && (
                                <div className={`absolute -right-1 top-2 bottom-2 w-1 rounded-l-full ${tab.color}`}></div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between shadow-sm flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h2>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Configuración</p>
                    </div>
                </div>

                {/* Content Scrollable */}
                <div className="flex-1 overflow-y-auto p-8">

                    {activeTab === 'estudiantes' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="text-blue-600" size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">Lista de Estudiantes</h3>
                                <p className="text-sm text-slate-500 mb-6 px-4">Importa tu archivo Excel para generar diplomas automáticamente.</p>

                                {students.length === 0 ? (
                                    <div className="space-y-4">
                                        <label className="cursor-pointer block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all transform hover:scale-[1.02]">
                                            <div className="flex items-center justify-center gap-2">
                                                <Upload size={18} /> Subir Excel
                                            </div>
                                            <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
                                        </label>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                import('../lib/excel-utils').then(mod => mod.downloadTemplate());
                                            }}
                                            className="text-xs font-medium text-slate-400 hover:text-blue-600 underline decoration-dashed"
                                        >
                                            Descargar plantilla de ejemplo
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="text-left bg-slate-50 p-3 rounded-xl border border-slate-100 max-h-40 overflow-y-auto">
                                            {students.map((s, i) => (
                                                <div key={s.id} className="text-xs py-1.5 border-b border-slate-100 last:border-0 flex gap-2">
                                                    <span className="font-mono text-slate-300 w-4">{i + 1}.</span>
                                                    <span className="text-slate-700 font-medium truncate">{s.nombres}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => {
                                                    setPendingStudents(students);
                                                    setShowVerificationModal(true);
                                                }}
                                                className="w-full py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                                            >
                                                <Pencil size={14} /> Editar Lista
                                            </button>
                                            <div className="flex gap-2">
                                                <label className="cursor-pointer flex-1 py-2 bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 rounded-lg text-xs font-bold text-center transition-colors">
                                                    Cambiar
                                                    <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
                                                </label>
                                                <button
                                                    onClick={() => setStudents([])}
                                                    className="flex-1 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                                                >
                                                    Limpiar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'institucion' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Nombre Institución</label>
                                    <input
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                        value={config.institucionNombre}
                                        onChange={(e) => updateConfig({ institucionNombre: e.target.value })}
                                        placeholder="Ej. IE 30059..."
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Nivel Educativo</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Inicial', 'Primaria', 'Secundaria', 'Superior'].map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => updateConfig({ nivel: level })}
                                                className={`py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all ${config.nivel === level
                                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                                                    : 'border-transparent bg-white text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-200">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Logotipos</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { key: 'logoColegio', label: 'Colegio' },
                                            { key: 'logoUgel', label: 'UGEL' },
                                            { key: 'logoMinedu', label: 'MINEDU' }
                                        ].map((logo) => (
                                            <div key={logo.key} className={`${logo.key === 'logoMinedu' ? 'col-span-2' : ''}`}>
                                                <label className="block w-full cursor-pointer group">
                                                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-4 text-center transition-all group-hover:border-emerald-400 group-hover:bg-emerald-50">
                                                        <div className="text-xs font-bold text-slate-500 group-hover:text-emerald-600 mb-1">{logo.label}</div>
                                                        <span className="text-[10px] text-slate-400">Click para subir</span>
                                                    </div>
                                                    <input type="file" className="hidden" onChange={(e) => handleLogoUpload(e, logo.key as any)} />
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'disenos' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Category Filter */}
                            <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeCategory === cat
                                            ? 'bg-slate-800 text-white shadow-md'
                                            : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {filteredDesigns.map((design) => (
                                    <button
                                        key={design.id}
                                        onClick={() => {
                                            if (design.available) {
                                                const updates: any = { selectedDesign: design.id };
                                                // @ts-ignore
                                                if (design.defaultPalette) {
                                                    // @ts-ignore
                                                    const p = design.defaultPalette;
                                                    updates.primaryColor = p.primary;
                                                    updates.secondaryColor = p.secondary;
                                                    updates.backgroundColor = p.background;
                                                    updates.textColor = p.text;
                                                }
                                                updateConfig(updates);
                                            }
                                        }}
                                        disabled={!design.available}
                                        className={`relative p-4 rounded-xl border-2 text-left transition-all group overflow-hidden ${config.selectedDesign === design.id
                                            ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200 ring-offset-2'
                                            : design.available
                                                ? 'border-slate-200 bg-white hover:border-amber-300 hover:bg-slate-50'
                                                : 'border-slate-100 bg-slate-50 opacity-70 cursor-not-allowed'
                                            }`}
                                    >
                                        <div className={`h-24 rounded-lg mb-3 ${design.previewColor} w-full flex items-center justify-center text-4xl shadow-inner ${!design.available ? 'grayscale opacity-50' : ''}`}>
                                            {design.category === 'Infantil' ? '🎨' :
                                                design.category === 'Primaria' ? '✏️' :
                                                    design.category === 'Secundaria' ? '🎓' :
                                                        design.category === 'Deporte' ? '⚽' : '🎭'
                                            }
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-sm truncate ${config.selectedDesign === design.id ? 'text-amber-800' : 'text-slate-700'}`}>
                                                {design.name}
                                            </h4>
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                {design.category}
                                            </span>
                                        </div>

                                        {config.selectedDesign === design.id && (
                                            <div className="absolute top-3 right-3 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                        )}

                                        {!design.available && (
                                            <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/20 backdrop-blur-[1px]">
                                                <span className="bg-slate-800/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider transform -rotate-3 border border-slate-600">
                                                    En Construcción
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                        </div>
                    )}

                    {activeTab === 'estilo' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Paleta de Colores</h3>
                                    <button
                                        onClick={() => {
                                            const currentDesign = AVAILABLE_DESIGNS.find(d => d.id === config.selectedDesign);
                                            // @ts-ignore
                                            if (currentDesign?.defaultPalette) {
                                                // @ts-ignore
                                                const p = currentDesign.defaultPalette;
                                                updateConfig({
                                                    primaryColor: p.primary,
                                                    secondaryColor: p.secondary,
                                                    backgroundColor: p.background,
                                                    textColor: p.text
                                                });
                                            }
                                        }}
                                        className="text-xs flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors"
                                        title="Reestablecer colores originales del diseño"
                                    >
                                        <RotateCcw size={12} /> Reestablecer
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Principal', key: 'primaryColor', default: '#2563EB' },
                                        { label: 'Secundario', key: 'secondaryColor', default: '#10B981' },
                                        { label: 'Fondo', key: 'backgroundColor', default: '#ffffff' },
                                        { label: 'Texto', key: 'textColor', default: '#1e293b' },
                                    ].map((color) => (
                                        <div key={color.key} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-2">{color.label}</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={(config as any)[color.key] || color.default}
                                                    onChange={(e) => updateConfig({ [color.key]: e.target.value })}
                                                    className="w-10 h-10 rounded-lg border-2 border-white shadow-sm cursor-pointer p-0 overflow-hidden"
                                                />
                                                <span className="text-xs font-mono text-slate-600 uppercase">{(config as any)[color.key] || color.default}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Elementos</h3>
                                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">Medalla Honorífica</h4>
                                        <p className="text-xs text-slate-400">Mostrar medalla en el diseño</p>
                                    </div>
                                    <button
                                        onClick={() => updateConfig({ mostrarMedalla: !config.mostrarMedalla })}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${config.mostrarMedalla ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${config.mostrarMedalla ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'contenido' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Título del Diploma</label>
                                <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-violet-500 outline-none shadow-sm"
                                    value={config.tituloDiploma}
                                    onChange={(e) => updateConfig({ tituloDiploma: e.target.value })}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Plantilla de Texto</label>
                                </div>
                                <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                                    {[
                                        { label: '🏆 Mérito', text: "Estudiante del {{Grado}} del nivel {{Nivel}}, por haber ocupado el {{Puesto}} en mérito al logro de los aprendizajes durante el presente año escolar en la {{Institucion}}." },
                                        { label: '🎓 Culminación', text: "Por haber culminado satisfactoriamente sus estudios del nivel {{Nivel}} en la {{Institucion}}, demostrando perseverancia y responsabilidad." },
                                        { label: '⭐ Conducta', text: "En reconocimiento a su excelente conducta, valores y alto sentido de responsabilidad demostrado durante el año escolar en el {{Grado}}." }
                                    ].map((t, i) => (
                                        <button key={i} onClick={() => updateConfig({ plantillaTexto: t.text })} className="flex-shrink-0 px-3 py-1.5 bg-violet-50 text-violet-700 text-[10px] font-bold rounded-lg hover:bg-violet-100 border border-violet-100">
                                            {t.label}
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm min-h-[140px] leading-relaxed focus:ring-2 focus:ring-violet-500 outline-none resize-none shadow-sm text-slate-600"
                                    value={config.plantillaTexto}
                                    onChange={(e) => updateConfig({ plantillaTexto: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Lugar y Fecha</label>
                                <input
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700"
                                    value={config.fechaLugar}
                                    onChange={(e) => updateConfig({ fechaLugar: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'firmas' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-slate-700">Autoridades ({config.firmas.length})</h3>
                                <button onClick={addSigner} className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-rose-700 transition-colors">
                                    <Plus size={14} /> Agregar
                                </button>
                            </div>

                            <div className="space-y-4">
                                {config.firmas.map((signer) => (
                                    <div key={signer.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group hover:border-rose-200 transition-colors">
                                        <button
                                            onClick={() => removeSigner(signer.id)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-white text-slate-400 border border-slate-200 rounded-full flex items-center justify-center hover:text-red-500 hover:border-red-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                                        >
                                            <X size={12} />
                                        </button>

                                        <div className="grid grid-cols-1 gap-3 mb-3">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Cargo</label>
                                                <input
                                                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-700 focus:bg-white focus:border-rose-300 outline-none"
                                                    value={signer.cargo}
                                                    onChange={(e) => updateSigner(signer.id, { cargo: e.target.value })}
                                                    placeholder="Ej. DIRECTOR"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Nombre</label>
                                                <input
                                                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-700 focus:bg-white focus:border-rose-300 outline-none"
                                                    value={signer.nombre}
                                                    onChange={(e) => updateSigner(signer.id, { nombre: e.target.value })}
                                                    placeholder="Nombre completo"
                                                />
                                            </div>
                                        </div>

                                        <label className="block w-full cursor-pointer">
                                            <div className="w-full py-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-center hover:bg-rose-50 hover:border-rose-300 transition-colors">
                                                <span className="text-[10px] font-bold text-slate-500 flex items-center justify-center gap-1">
                                                    {signer.firmaImage ? 'Cambiar Firma Digital' : 'Subir Firma Digital'}
                                                </span>
                                            </div>
                                            <input type="file" className="hidden" onChange={(e) => handleFirmaImageUpload(e, signer.id)} />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            <StudentVerificationModal
                isOpen={showVerificationModal}
                onClose={() => setShowVerificationModal(false)}
                onConfirm={handleConfirmImport}
                initialStudents={pendingStudents}
            />
        </div>
    );
};
