// Script para generar iconos PNG desde SVG
// Crear iconos temporales que apunten al SVG hasta que se generen los PNG reales

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const publicDir = path.join(__dirname, '../public');
const svgPath = path.join(publicDir, 'icon.svg');

console.log('📱 Generando iconos PWA...');
console.log('ℹ️  Por ahora, los iconos PNG apuntarán al SVG');
console.log('ℹ️  Para producción, usa un generador de iconos online como:');
console.log('   - https://realfavicongenerator.net/');
console.log('   - https://www.pwabuilder.com/imageGenerator');
console.log('');

// Por ahora, copiar el SVG como fallback
sizes.forEach(size => {
    const filename = `icon-${size}x${size}.png`;
    const destPath = path.join(publicDir, filename);

    // Copiar el SVG como PNG temporalmente
    fs.copyFileSync(svgPath, destPath.replace('.png', '.svg'));
    console.log(`✅ Creado: ${filename} (SVG temporal)`);
});

console.log('');
console.log('✨ ¡Iconos base creados!');
console.log('📝 Recomendación: Genera los PNG reales con una herramienta externa');
