import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import type { DiplomaConfig, Student } from '../types';
import { Inicial01 } from './templates/inicial/Inicial01';
import { Primaria01 } from './templates/primaria/Primaria01';
import { Primaria02 } from './templates/primaria/Primaria02';
import { Secundaria01 } from './templates/secundaria/Secundaria01';
import { Secundaria02 } from './templates/secundaria/Secundaria02';
import { Secundaria03 } from './templates/secundaria/Secundaria03';

interface DiplomaPreviewProps {
    config: DiplomaConfig;
    student?: Student;
}

// Interfaz para el ref expuesto
export type DiplomaPreviewHandle = {
    getDiplomaElement: () => HTMLDivElement | null;
};

// Mapa de Diseños Disponibles (exportado para uso externo)
export const DIPLOMA_DESIGNS: Record<string, React.FC<any>> = {
    'inicial-01': Inicial01,
    'primaria-01': Primaria01,
    'primaria-02': Primaria02,
    'secundaria-01': Secundaria01,
    'secundaria-02': Secundaria02,
    'secundaria-03': Secundaria03,
};

export const DiplomaPreview = forwardRef<DiplomaPreviewHandle, DiplomaPreviewProps>(({ config, student }, ref) => {
    const data = student || {
        id: 'demo',
        nombres: 'Estudiante Ejemplo',
        grado: (config.nivel === 'Inicial') ? '5 Años' : '5° Grado',
        nivel: config.nivel || 'Nivel Educativo',
        puesto: '1er Puesto'
    } as Student;

    const containerRef = useRef<HTMLDivElement>(null);
    const diplomaRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.8);

    // Exponer el ref del diploma al componente padre
    useImperativeHandle(ref, () => ({
        getDiplomaElement: () => diplomaRef.current
    }));

    useEffect(() => {
        const updateScale = () => {
            if (!containerRef.current) return;
            const { clientWidth, clientHeight } = containerRef.current;

            // Dimensiones A4 en PIXELES (aprox 96 DPI)
            // Ancho: 297mm ≈ 1122.5px
            // Alto: 210mm ≈ 793.8px
            const DOC_WIDTH = 1123;
            const DOC_HEIGHT = 794;
            const PADDING = 80; // Espacio alrededor

            const scaleX = (clientWidth - PADDING) / DOC_WIDTH;
            const scaleY = (clientHeight - PADDING) / DOC_HEIGHT;

            // Elegir el menor para asegurar que quepa (contain)
            // Limitar a un máximo razonable (ej. 1.2) para que no sea gigante en pantallas 4k
            // Y un mínimo para móviles
            const newScale = Math.min(Math.min(scaleX, scaleY), 1.2);

            setScale(newScale > 0 ? newScale : 0.5);
        };

        const observer = new ResizeObserver(updateScale);
        if (containerRef.current) observer.observe(containerRef.current);

        // Ejecutar inicial
        updateScale();

        return () => observer.disconnect();
    }, []);

    // Selector de Diseño
    const getDesign = () => {
        const DesignComponent = DIPLOMA_DESIGNS[config.selectedDesign] || Secundaria01;
        return <DesignComponent config={config} student={data} />;
    };

    return (
        <div ref={containerRef} className="w-full h-full flex justify-center items-center bg-transparent overflow-hidden">
            {/* Contenedor A4 */}
            <div
                ref={diplomaRef}
                id="diploma-container"
                className="bg-white shadow-xl flex-shrink-0 transition-transform duration-200 ease-out will-change-transform "
                style={{
                    width: '297mm', // A4 Landscape
                    height: '210mm',
                    minWidth: '297mm',
                    minHeight: '210mm',
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center'
                }}
            >
                {getDesign()}
            </div>
        </div>
    );
});
