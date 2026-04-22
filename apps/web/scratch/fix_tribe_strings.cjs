const fs = require('fs');
const path = require('path');

const files = [
    '../../apps/web/src/app/tribes/page.tsx',
    '../../apps/web/src/app/tribes/[slug]/page.tsx',
    '../../apps/web/src/app/tribes/create/page.tsx'
];

files.forEach(f => {
    const fullPath = path.join(__dirname, f);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Replace Hub with Tribe (respecting case)
        content = content.replace(/Hub/g, 'Tribe');
        content = content.replace(/hub/g, 'tribe');
        content = content.replace(/HUB/g, 'TRIBE');
        
        // Specific cleanup for "Initializing Tribe" (was Initializing Hub)
        content = content.replace(/Initializing Tribe\.\.\./g, 'Loading...');
        
        fs.writeFileSync(fullPath, content);
        console.log('Fixed strings in:', f);
    }
});
