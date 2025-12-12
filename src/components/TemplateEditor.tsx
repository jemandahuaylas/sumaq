import React, { useRef, useState } from 'react';
import { Plus, Pencil, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface TemplateEditorProps {
    value: string;
    onChange: (value: string) => void;
}

// Campos disponibles con sus etiquetas amigables
const AVAILABLE_FIELDS = [
    { key: 'Nombres', label: '👤 Nombre', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { key: 'Grado', label: '📚 Grado', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { key: 'Nivel', label: '🎓 Nivel', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { key: 'Puesto', label: '🏆 Puesto', color: 'bg-rose-100 text-rose-700 border-rose-200' },
    { key: 'Institucion', label: '🏫 Institución', color: 'bg-violet-100 text-violet-700 border-violet-200' },
];

// Plantillas predefinidas con descripciones
const PREDEFINED_TEMPLATES = [
    {
        id: 'merito',
        icon: '🏆',
        label: 'Mérito Académico',
        description: 'Para estudiantes con logros de aprendizaje',
        text: 'Estudiante del {{Grado}} del nivel {{Nivel}}, por haber ocupado el {{Puesto}} en mérito al logro de los aprendizajes durante el presente año escolar en la {{Institucion}}.'
    },
    {
        id: 'culminacion',
        icon: '🎓',
        label: 'Culminación de Estudios',
        description: 'Para graduación y término de nivel',
        text: 'Por haber culminado satisfactoriamente sus estudios del nivel {{Nivel}} en la {{Institucion}}, demostrando perseverancia y responsabilidad.'
    },
    {
        id: 'conducta',
        icon: '⭐',
        label: 'Buena Conducta',
        description: 'Para reconocer valores y actitud',
        text: 'En reconocimiento a su excelente conducta, valores y alto sentido de responsabilidad demostrado durante el año escolar en el {{Grado}}.'
    },
];

/**
 * Renderiza el texto con tokens visuales (pills) en lugar de {{variables}}
 */
const renderTextWithTokens = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    const regex = /\{\{(\w+)\}\}/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
        }

        const fieldKey = match[1];
        const field = AVAILABLE_FIELDS.find(f => f.key.toLowerCase() === fieldKey.toLowerCase());

        parts.push(
            <span
                key={`token-${match.index}`}
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold mx-0.5 border ${field?.color || 'bg-gray-100 text-gray-700 border-gray-200'}`}
            >
                {field?.label || fieldKey}
            </span>
        );

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
    }

    return parts;
};

export const TemplateEditor: React.FC<TemplateEditorProps> = ({ value, onChange }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    // Detectar qué plantilla está activa
    const detectActiveTemplate = () => {
        const template = PREDEFINED_TEMPLATES.find(t => t.text === value);
        return template?.id || null;
    };

    // Insertar campo
    const insertField = (fieldKey: string) => {
        const fieldTemplate = `{{${fieldKey}}}`;
        onChange(value + ' ' + fieldTemplate);
        setSelectedTemplate(null); // Ya no es una plantilla predefinida
    };

    // Seleccionar plantilla
    const selectTemplate = (template: typeof PREDEFINED_TEMPLATES[0]) => {
        onChange(template.text);
        setSelectedTemplate(template.id);
        setIsEditing(false);
    };

    const activeTemplateId = detectActiveTemplate();

    return (
        <div className="space-y-4">
            {/* Header prominente */}
            <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-violet-500" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                    Plantilla de Texto
                </h3>
            </div>

            {/* Plantillas predefinidas - más prominentes */}
            <div className="space-y-2">
                <p className="text-xs text-slate-500">
                    Elige una plantilla prediseñada o personalízala:
                </p>

                <div className="space-y-2">
                    {PREDEFINED_TEMPLATES.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => selectTemplate(template)}
                            className={`w-full text-left p-3 rounded-xl border-2 transition-all group ${activeTemplateId === template.id
                                    ? 'border-violet-500 bg-violet-50 shadow-md'
                                    : 'border-slate-200 bg-white hover:border-violet-300 hover:bg-slate-50'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{template.icon}</span>
                                    <div>
                                        <span className={`text-sm font-bold ${activeTemplateId === template.id ? 'text-violet-700' : 'text-slate-700'}`}>
                                            {template.label}
                                        </span>
                                        <p className="text-[10px] text-slate-400 leading-tight">
                                            {template.description}
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${activeTemplateId === template.id
                                        ? 'bg-violet-500 text-white'
                                        : 'bg-slate-100 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-600'
                                    }`}>
                                    {activeTemplateId === template.id ? '✓ Activa' : 'Usar'}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Vista previa del texto actual */}
            <div className="relative">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Vista Previa del Texto
                    </span>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-[10px] font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1"
                    >
                        <Pencil size={10} />
                        {isEditing ? 'Ver Preview' : 'Editar Texto'}
                    </button>
                </div>

                {!isEditing ? (
                    <div
                        onClick={() => setIsEditing(true)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm min-h-[100px] leading-7 cursor-pointer shadow-sm text-slate-600 hover:border-violet-300 transition-colors"
                    >
                        {value ? renderTextWithTokens(value) : (
                            <span className="text-slate-400 italic">Sin texto...</span>
                        )}
                    </div>
                ) : (
                    <textarea
                        ref={textareaRef}
                        className="w-full px-4 py-3 bg-white border-2 border-violet-400 rounded-xl text-sm min-h-[100px] leading-relaxed focus:ring-2 focus:ring-violet-200 outline-none resize-none shadow-sm text-slate-700"
                        value={value}
                        onChange={(e) => {
                            onChange(e.target.value);
                            setSelectedTemplate(null);
                        }}
                        autoFocus
                        placeholder="Escribe el texto del diploma..."
                    />
                )}
            </div>

            {/* Campos disponibles - colapsable */}
            <div className="border border-slate-100 rounded-xl overflow-hidden">
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                        <Plus size={12} />
                        Insertar Campos Personalizados
                    </span>
                    {showAdvanced ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                </button>

                {showAdvanced && (
                    <div className="p-3 bg-white border-t border-slate-100">
                        <p className="text-[9px] text-slate-400 mb-2">
                            Haz clic en un campo para añadirlo al texto:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_FIELDS.map((field) => (
                                <button
                                    key={field.key}
                                    onClick={() => insertField(field.key)}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all hover:scale-105 hover:shadow-sm ${field.color}`}
                                >
                                    {field.label}
                                    <Plus size={10} className="opacity-50" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
