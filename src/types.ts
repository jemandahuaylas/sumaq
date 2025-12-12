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

export interface DiplomaLogo {
    id: string;
    src: string;
}

export type DesignTheme = 'modern-slate' | 'classic-blue' | 'elegant-gold' | 'minimal-black' | string;

export interface DiplomaConfig {
    // Identidad
    institucionNombre: string;
    institucionFontSize?: number; // Size in px
    lemaInstitucion?: string; // Slogan o Lema, ej: "Excelencia Educativa"
    tituloDiploma: string; // "DIPLOMA", "RECONOCIMIENTO"
    subtituloDiploma?: string; // "OTORGADO CON ALEGRÍA A:"
    nivel: string; // "Inicial", "Primaria", "Secundaria"

    // Logos
    logos: DiplomaLogo[]; // New flexible system
    // Legacy support (deprecated)
    logoColegio?: string;
    logoUgel?: string;
    logoMinedu?: string;
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
