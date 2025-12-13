import React, { useState, useEffect } from 'react';
import type { Student } from '../types';
import { X, Save, Trash2, Plus, AlertCircle } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (students: Student[]) => void;
    initialStudents: Student[];
    title?: string;
}

const StudentRow = React.memo(({ student, index, onUpdate, onDelete }: {
    student: Student,
    index: number,
    onUpdate: (index: number, field: keyof Student, value: string) => void,
    onDelete: (index: number) => void
}) => (
    <tr className="hover:bg-blue-50/50 transition-colors group">
        <td className="px-6 py-3 font-mono text-slate-400 text-xs">{index + 1}</td>
        <td className="px-6 py-2">
            <input
                value={student.nombres}
                onChange={(e) => onUpdate(index, 'nombres', e.target.value)}
                className="w-full bg-transparent focus:bg-white border border-transparent focus:border-blue-300 rounded px-2 py-1 outline-none font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="Ingresa el nombre..."
            />
        </td>
        <td className="px-6 py-2">
            <input
                value={student.grado}
                onChange={(e) => onUpdate(index, 'grado', e.target.value)}
                className="w-full bg-transparent focus:bg-white border border-transparent focus:border-blue-300 rounded px-2 py-1 outline-none text-slate-500 focus:text-slate-700"
                placeholder="Grado..."
            />
        </td>
        <td className="px-6 py-2">
            <input
                value={student.puesto || ''}
                onChange={(e) => onUpdate(index, 'puesto', e.target.value)}
                className="w-full bg-transparent focus:bg-white border border-transparent focus:border-blue-300 rounded px-2 py-1 outline-none text-slate-500 focus:text-slate-700"
                placeholder="-"
            />
        </td>
        <td className="px-6 py-2 text-center">
            <button
                onClick={() => onDelete(index)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                title="Eliminar"
            >
                <Trash2 size={16} />
            </button>
        </td>
    </tr>
));

export const StudentVerificationModal: React.FC<Props> = ({ isOpen, onClose, onConfirm, initialStudents, title = "Verificar Datos" }) => {
    const [localStudents, setLocalStudents] = useState<Student[]>([]);

    useEffect(() => {
        if (isOpen) {
            const students = JSON.parse(JSON.stringify(initialStudents));
            // Si no hay estudiantes (ingreso manual), agregar una fila vacía automáticamente
            if (students.length === 0) {
                students.push({
                    id: Date.now().toString(),
                    nombres: '',
                    grado: '',
                    nivel: ''
                });
            }
            setLocalStudents(students);
        }
    }, [isOpen, initialStudents]);

    const handleUpdate = React.useCallback((index: number, field: keyof Student, value: string) => {
        setLocalStudents(prev => {
            const newStudents = [...prev];
            newStudents[index] = { ...newStudents[index], [field]: value };
            return newStudents;
        });
    }, []);

    const handleDelete = React.useCallback((index: number) => {
        setLocalStudents(prev => prev.filter((_, i) => i !== index));
    }, []);

    const handleAdd = () => {
        const newStudent: Student = {
            id: Date.now().toString(),
            nombres: '',
            grado: '',
            nivel: ''
        };
        setLocalStudents(prev => [...prev, newStudent]);
    };

    // Determinar título dinámicamente
    const modalTitle = initialStudents.length === 0 ? "Ingreso Manual de Estudiantes" : title;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                            {modalTitle}
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">{localStudents.length}</span>
                        </h2>
                        <p className="text-xs text-slate-500">
                            {initialStudents.length === 0
                                ? 'Agrega estudiantes uno por uno usando el botón "Agregar Fila".'
                                : 'Revisa la información antes de procesar los diplomas.'
                            }
                        </p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-0">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-6 py-3 font-bold w-12">#</th>
                                <th className="px-6 py-3 font-bold">Apellidos y Nombres</th>
                                <th className="px-6 py-3 font-bold w-48">Grado/Sección</th>
                                <th className="px-6 py-3 font-bold w-32">Puesto</th>
                                <th className="px-6 py-3 font-bold w-16 text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {localStudents.map((student, index) => (
                                <StudentRow
                                    key={student.id || index}
                                    student={student}
                                    index={index}
                                    onUpdate={handleUpdate}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </tbody>
                    </table>

                    {localStudents.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <AlertCircle size={48} className="mb-2 opacity-20" />
                            <p>No hay estudiantes en la lista</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-between items-center z-20">
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors text-sm"
                    >
                        <Plus size={16} /> Agregar Fila
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-slate-500 font-bold hover:text-slate-700 transition-colors text-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => {
                                // Filtrar estudiantes con nombres válidos
                                const validStudents = localStudents.filter(s => s.nombres.trim() !== '');
                                onConfirm(validStudents);
                            }}
                            disabled={localStudents.filter(s => s.nombres.trim() !== '').length === 0}
                            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all transform hover:scale-105 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                        >
                            <Save size={18} /> Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
