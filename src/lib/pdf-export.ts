/**
 * PDF Export Utility - HTML → Image → PDF
 * 
 * Usa modern-screenshot (más moderno y con mejor soporte de CSS que html2canvas)
 * para capturar el diploma y luego lo convierte a PDF con jsPDF.
 */

import { domToJpeg, domToPng } from 'modern-screenshot';
import { jsPDF } from 'jspdf';

// Configuración
const DEFAULT_CONFIG = {
    scale: 2, // 2x = 192 DPI, bueno para impresión
    jpegQuality: 0.9,
    pageWidth: 297, // mm
    pageHeight: 210, // mm
    // Dimensiones A4 landscape en píxeles (96 DPI base)
    pixelWidth: 1123, // 297mm
    pixelHeight: 794, // 210mm
};

interface ExportOptions {
    scale?: number;
    jpegQuality?: number;
    filename?: string;
}

/**
 * Captura un elemento HTML como imagen JPEG usando modern-screenshot
 */
export const captureElementAsJpeg = async (
    element: HTMLElement,
    options: { scale?: number; quality?: number } = {}
): Promise<string> => {
    const scale = options.scale || DEFAULT_CONFIG.scale;
    const quality = options.quality || DEFAULT_CONFIG.jpegQuality;

    // Guardar estilos originales
    const originalTransform = element.style.transform;
    const originalTransformOrigin = element.style.transformOrigin;

    try {
        // Remover transform para captura limpia
        element.style.transform = 'none';
        element.style.transformOrigin = 'top left';

        // Esperar un frame para que se apliquen los estilos
        await new Promise(r => requestAnimationFrame(r));

        const dataUrl = await domToJpeg(element, {
            scale,
            quality,
            backgroundColor: '#ffffff',
            width: DEFAULT_CONFIG.pixelWidth,
            height: DEFAULT_CONFIG.pixelHeight,
            style: {
                transform: 'none',
                transformOrigin: 'top left',
            },
            // Incluir fuentes web embedidas
            features: {
                fixSvgXmlDecode: true,
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
 * Captura un elemento HTML como imagen PNG (mayor calidad, mayor tamaño)
 */
export const captureElementAsPng = async (
    element: HTMLElement,
    options: { scale?: number } = {}
): Promise<string> => {
    const scale = options.scale || DEFAULT_CONFIG.scale;

    // Guardar estilos originales
    const originalTransform = element.style.transform;
    const originalTransformOrigin = element.style.transformOrigin;

    try {
        element.style.transform = 'none';
        element.style.transformOrigin = 'top left';

        await new Promise(r => requestAnimationFrame(r));

        const dataUrl = await domToPng(element, {
            scale,
            backgroundColor: '#ffffff',
            width: DEFAULT_CONFIG.pixelWidth,
            height: DEFAULT_CONFIG.pixelHeight,
            style: {
                transform: 'none',
                transformOrigin: 'top left',
            },
            features: {
                fixSvgXmlDecode: true,
            },
        });

        return dataUrl;
    } finally {
        element.style.transform = originalTransform;
        element.style.transformOrigin = originalTransformOrigin;
    }
};

/**
 * Exporta un único diploma a PDF
 */
export const exportSingleDiplomaToPDF = async (
    element: HTMLElement,
    options: ExportOptions = {}
): Promise<Blob> => {
    const scale = options.scale || DEFAULT_CONFIG.scale;
    const jpegQuality = options.jpegQuality || DEFAULT_CONFIG.jpegQuality;

    // Capturar como JPEG
    const imgData = await captureElementAsJpeg(element, { scale, quality: jpegQuality });

    // Crear PDF
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
    });

    pdf.addImage(
        imgData,
        'JPEG',
        0,
        0,
        DEFAULT_CONFIG.pageWidth,
        DEFAULT_CONFIG.pageHeight,
        undefined,
        'FAST'
    );

    return pdf.output('blob');
};

/**
 * Exporta múltiples diplomas a un PDF multipágina
 */
export const exportMultipleDiplomasToPDF = async (
    elements: HTMLElement[],
    options: ExportOptions = {},
    onProgress?: (current: number, total: number) => void
): Promise<Blob> => {
    const scale = options.scale || DEFAULT_CONFIG.scale;
    const jpegQuality = options.jpegQuality || DEFAULT_CONFIG.jpegQuality;

    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
    });

    for (let i = 0; i < elements.length; i++) {
        onProgress?.(i + 1, elements.length);

        const imgData = await captureElementAsJpeg(elements[i], { scale, quality: jpegQuality });

        if (i > 0) {
            pdf.addPage('a4', 'landscape');
        }

        pdf.addImage(
            imgData,
            'JPEG',
            0,
            0,
            DEFAULT_CONFIG.pageWidth,
            DEFAULT_CONFIG.pageHeight,
            undefined,
            'FAST'
        );
    }

    return pdf.output('blob');
};

/**
 * Descarga un Blob como archivo
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Funciones legacy para compatibilidad (ya no se usan pero se mantienen para no romper imports)
export const captureElementAsCanvas = async (element: HTMLElement, options: { scale?: number } = {}) => {
    throw new Error('captureElementAsCanvas is deprecated. Use captureElementAsJpeg instead.');
};

export const canvasToJpegDataUrl = (canvas: HTMLCanvasElement, quality?: number): string => {
    return canvas.toDataURL('image/jpeg', quality || DEFAULT_CONFIG.jpegQuality);
};

/**
 * Estima el tamaño aproximado del PDF en KB
 */
export const estimatePdfSize = (
    numberOfPages: number,
    scale: number = DEFAULT_CONFIG.scale,
    jpegQuality: number = DEFAULT_CONFIG.jpegQuality
): number => {
    const baseKbPerPage = 200;
    const scaleMultiplier = (scale / 2) ** 2;
    const qualityMultiplier = jpegQuality / 0.85;
    return Math.round(numberOfPages * baseKbPerPage * scaleMultiplier * qualityMultiplier);
};
