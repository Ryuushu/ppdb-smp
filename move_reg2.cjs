const fs = require('fs');
let file = 'c:/laragon/www/ppdb-smp/resources/js/components/registration-form.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /([ \t]*)<FormField id="master_ukuran_seragam_id"([\s\S]*?)<\/FormField>/;
const match = content.match(regex);
if (match) {
    let fullBlock = match[0];
    content = content.replace(fullBlock, '');
    
    // Find nisn
    const nisnStr = '<FormField id="nisn" label="NISN"';
    const nIndex = content.indexOf(nisnStr);
    if(nIndex !== -1) {
         const endOfNisn = content.indexOf('</FormField>', nIndex) + '</FormField>'.length;
         content = content.slice(0, endOfNisn) + '\n\n' + fullBlock + content.slice(endOfNisn);
         fs.writeFileSync(file, content);
         console.log("Moved in registration-form.tsx");
    } else {
         console.log("NISN not found");
    }
} else {
    console.log("FormField not found");
}
