import * as XLSX from 'xlsx';
import type { Student } from '../types';

export const importStudentsFromExcel = async (file: File): Promise<Student[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                // Convertir a JSON
                const jsonData = XLSX.utils.sheet_to_json(sheet);

                // Mapeo inteligente (intenta buscar columnas comunes si no coinciden exacto)
                const students: Student[] = jsonData.map((row: any, index) => ({
                    id: crypto.randomUUID(),
                    nombres: row['Nombres'] || row['Alumnos'] || row['Estudiante'] || 'Sin Nombre',
                    grado: row['Grado'] || '',
                    nivel: '', // Se llenará desde la configuración global
                    puesto: row['Puesto'] || '',
                    ...row // Guardar resto de columnas por si acaso
                }));

                resolve(students);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsBinaryString(file);
    });
};

export const downloadTemplate = () => {
    const headers = ['Nombres', 'Grado', 'Puesto'];
    const data = [
        { Nombres: 'Ejemplo Primaria', Grado: '5° Grado', Puesto: '1er Puesto' },
        { Nombres: 'Ejemplo Inicial', Grado: '5 Años', Puesto: 'Excelencia' },
        { Nombres: 'Ejemplo Secundaria', Grado: '5° Grado', Puesto: '2do Puesto' },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plantilla Estudiantes");
    XLSX.writeFile(workbook, "plantilla_estudiantes.xlsx");
};
