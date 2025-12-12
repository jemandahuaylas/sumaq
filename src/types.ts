export interface Student {
    id: string;
    nombres: string; // Puede incluir apellidos
    grado: string;
    nivel: string; // Inicial, Primaria, Secundaria
    puesto?: string;
    [key: string]: any; // Permitir otras columnas dinámicas del Excel
}

export interface Signer {
    id: string;
    cargo: string;
    nombre: string;
    firmaImage?: string; // Base64 o URL
}

export type DesignTheme = 'modern-slate' | 'classic-blue' | 'elegant-gold' | 'minimal-black' | string;

export interface DiplomaConfig {
    // Identidad
    institucionNombre: string;
    tituloDiploma: string; // "DIPLOMA", "RECONOCIMIENTO"
    nivel: string; // "Inicial", "Primaria", "Secundaria"

    // Logos
    logoColegio?: string; // Base64
    logoUgel?: string;   // Base64
    logoMinedu?: string; // Base64
    fondoMarcaAgua?: boolean;

    // Contenido
    plantillaTexto: string; // Texto con variables {{Nombres}}, etc.
    fechaLugar: string;

    // Firmas
    firmas: Signer[];

    // Diseño
    tema: DesignTheme;
    selectedDesign: string; // ID del diseño seleccionado (ej: "inicial-01")
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    mostrarMedalla: boolean; // Aunque dijiste "olvídala", dejaré el flag por si acaso en false
    orientacion: 'landscape' | 'portrait';
}


export interface AppState {
    students: Student[];
    config: DiplomaConfig;
    setStudents: (students: Student[]) => void;
    updateConfig: (partial: Partial<DiplomaConfig>) => void;
    addSigner: () => void;
    removeSigner: (id: string) => void;
    updateSigner: (id: string, partial: Partial<Signer>) => void;
}
