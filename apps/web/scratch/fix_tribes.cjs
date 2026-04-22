const fs = require('fs');
const path = require('path');

const wizardPath = path.join(__dirname, '../src/app/tribes/create/page.tsx');
const detailPath = path.join(__dirname, '../src/app/tribes/[slug]/page.tsx');

console.log('Checking Wizard:', wizardPath);
console.log('Checking Detail:', detailPath);

// Fix Detail Page
if (fs.existsSync(detailPath)) {
    let content = fs.readFileSync(detailPath, 'utf8');
    content = content.replace(/\{tribe\.internalId\}/g, '@{tribe.slug}');
    content = content.replace(/Fingerprint/g, 'Hash');
    content = content.replace(/tribe\.memberCount\.toLocaleString\(\)/g, '(tribe.memberCount || 0).toLocaleString()');
    fs.writeFileSync(detailPath, content);
    console.log('Fixed Detail Page');
} else {
    console.log('Detail Page NOT found');
}

// Fix Wizard
if (fs.existsSync(wizardPath)) {
    let content = fs.readFileSync(wizardPath, 'utf8');
    
    // Add check logic if not there
    if (!content.includes('isUsernameTaken')) {
        content = content.replace(/const \[newRule, setNewRule\] = useState\(""\);/g, 
            'const [newRule, setNewRule] = useState("");\n  const [isCheckingUsername, setIsCheckingUsername] = useState(false);\n  const [isUsernameTaken, setIsUsernameTaken] = useState(false);');
    }

    // Disable button in Step 2
    // Use a more flexible regex for spaces
    content = content.replace(/disabled=\{\!formData\.name \|\| formData\.username\.length < 10\}/g, 
        'disabled={!formData.name || formData.username.length < 10 || isUsernameTaken || isCheckingUsername}');
    
    fs.writeFileSync(wizardPath, content);
    console.log('Fixed Wizard');
} else {
    console.log('Wizard NOT found');
}
