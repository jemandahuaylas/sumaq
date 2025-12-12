import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, DiplomaConfig, Student, Signer } from '../types';

const INITIAL_CONFIG: DiplomaConfig = {
    institucionNombre: 'INSTITUCIÓN EDUCATIVA',
    tituloDiploma: 'DIPLOMA',
    nivel: 'Primaria',
    plantillaTexto: 'Estudiante del {{Grado}} del nivel {{Nivel}}, por haber ocupado el {{Puesto}} en mérito al logro de los aprendizajes durante el año escolar 2025.',
    fechaLugar: 'Ciudad, 30 de Diciembre de 2025',
    tema: 'modern-slate',
    selectedDesign: 'secundaria-01',
    primaryColor: '#2563EB', // Blue-600
    secondaryColor: '#10B981', // Emerald-500
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    mostrarMedalla: false,
    orientacion: 'landscape',
    fondoMarcaAgua: true,
    firmas: [
        { id: '1', cargo: 'DIRECTOR', nombre: '' },
        { id: '2', cargo: 'SUB DIRECTOR', nombre: '' },
        { id: '3', cargo: 'TUTOR', nombre: '' },
    ],
};

export const useDiplomaStore = create<AppState>()(
    persist(
        (set) => ({
            students: [],
            config: INITIAL_CONFIG,

            setStudents: (students) => set({ students }),

            updateConfig: (partial) => set((state) => ({
                config: { ...state.config, ...partial }
            })),

            addSigner: () => set((state) => ({
                config: {
                    ...state.config,
                    firmas: [...state.config.firmas, { id: crypto.randomUUID(), cargo: 'NUEVO CARGO', nombre: '' }]
                }
            })),

            removeSigner: (id) => set((state) => ({
                config: {
                    ...state.config,
                    firmas: state.config.firmas.filter(s => s.id !== id)
                }
            })),

            updateSigner: (id, partial) => set((state) => ({
                config: {
                    ...state.config,
                    firmas: state.config.firmas.map(s =>
                        s.id === id ? { ...s, ...partial } : s
                    )
                }
            })),
        }),
        {
            name: 'diploma-storage',
        }
    )
);
