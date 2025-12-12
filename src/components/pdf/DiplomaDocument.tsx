import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import type { DiplomaConfig, Student } from '../../types';

// Registramos fuentes (esto se perfeccionará luego con las fuentes locales)
// Por ahora usamos las standard de PDF
Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica', // Fallback
    },
    border: {
        border: '2px solid #1e293b', // Slate-800
        height: '100%',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        height: 60,
    },
    logosLeft: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
    },
    logo: {
        width: 50,
        height: 50,
        objectFit: 'contain',
    },
    mineduLogo: {
        width: 120, // Más ancho el del minedu
        height: 40,
        objectFit: 'contain',
    },
    institutionTitle: {
        fontSize: 24,
        textAlign: 'center',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: '#0f172a', // Slate-900
        marginBottom: 10,
        marginTop: 10,
    },
    diplomaTitle: {
        fontSize: 48,
        textAlign: 'center',
        fontWeight: 'black',
        color: '#1e293b',
        letterSpacing: 4,
        marginBottom: 5,
        fontFamily: 'Oswald',
        textTransform: 'uppercase',
    },
    studentName: {
        fontSize: 36,
        textAlign: 'center',
        fontFamily: 'Times-Roman', // Simulando script/serif elegante
        fontStyle: 'italic',
        marginVertical: 15,
        color: '#334155',
    },
    bodyText: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 1.6,
        paddingHorizontal: 40,
        color: '#475569',
    },
    footerDate: {
        fontSize: 12,
        textAlign: 'right',
        marginTop: 20,
        marginRight: 20,
        color: '#64748b',
    },
    signaturesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 40,
        paddingHorizontal: 20,
    },
    signatureBox: {
        alignItems: 'center',
        width: 150,
    },
    signatureLine: {
        borderTopWidth: 1,
        borderTopColor: '#94a3b8',
        width: '100%',
        marginBottom: 5,
    },
    signerName: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    signerRole: {
        fontSize: 9,
        color: '#64748b',
    },
});

interface DiplomaDocumentProps {
    config: DiplomaConfig;
    students: Student[]; // Si está vacío, renderiza preview solo con datos dummy
}

export const DiplomaDocument: React.FC<DiplomaDocumentProps> = ({ config, students }) => {
    // Datos dummy para preview si no hay estudiantes
    const displayStudents = students.length > 0 ? students : [{
        id: 'demo',
        nombres: 'ESTUDIANTE EJEMPLO',
        grado: '5°',
        nivel: 'Secundaria',
        puesto: '1er Puesto'
    } as Student];

    const processTemplate = (text: string, student: Student) => {
        let processed = text;
        // Reemplazo simple de variables
        processed = processed.replace(/{{Nombres}}/gi, student.nombres);
        processed = processed.replace(/{{Grado}}/gi, student.grado || '');
        processed = processed.replace(/{{Nivel}}/gi, student.nivel || '');
        processed = processed.replace(/{{Puesto}}/gi, student.puesto || '');
        return processed;
    };

    return (
        <Document>
            {displayStudents.map((student) => (
                <Page key={student.id} size="A4" orientation={config.orientacion} style={styles.page}>
                    <View style={styles.border}>

                        {/* Cabecera */}
                        <View style={styles.header}>
                            <View style={styles.logosLeft}>
                                {config.logoColegio && <Image src={config.logoColegio} style={styles.logo} />}
                                {config.logoUgel && <Image src={config.logoUgel} style={styles.logo} />}
                            </View>
                            <View>
                                {config.logoMinedu && <Image src={config.logoMinedu} style={styles.mineduLogo} />}
                            </View>
                        </View>

                        {/* Cuerpo Central */}
                        <View>
                            <Text style={styles.institutionTitle}>{config.institucionNombre}</Text>
                            <Text style={styles.diplomaTitle}>{config.tituloDiploma}</Text>

                            <Text style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginBottom: 5 }}>
                                Otorgado a:
                            </Text>

                            <Text style={styles.studentName}>
                                {student.nombres}
                            </Text>

                            <Text style={styles.bodyText}>
                                {processTemplate(config.plantillaTexto, student)}
                            </Text>

                            <Text style={styles.footerDate}>
                                {config.fechaLugar}
                            </Text>
                        </View>

                        {/* Firmas */}
                        <View style={styles.signaturesContainer}>
                            {config.firmas.map((signer) => (
                                <View key={signer.id} style={styles.signatureBox}>
                                    {/* Espacio para imagen de firma si hubiera */}
                                    <View style={{ height: 40 }} />
                                    <View style={styles.signatureLine} />
                                    <Text style={styles.signerName}>{signer.nombre}</Text>
                                    <Text style={styles.signerRole}>{signer.cargo}</Text>
                                </View>
                            ))}
                        </View>

                    </View>
                </Page>
            ))}
        </Document>
    );
};
