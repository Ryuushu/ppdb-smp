const fs = require('fs');
let file = 'c:/laragon/www/ppdb-smp/resources/js/components/registration-form.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /([ \t]*)<FormField id="master_ukuran_seragam_id"([\s\S]*?)<\/FormField>/;
const match = content.match(regex);
if (match) {
    let fullBlock = match[0];
    content = content.replace(fullBlock, '');
    
    // Find the end of step 1. Step 1 is "Data Diri Pribadi".
    // Near the end of step 1, there is nisn.
    const nisnBlock = '<FormField id="nisn" label="NISN" text="10 digit nomor NISN">';
    const nIndex = content.indexOf(nisnBlock);
    if(nIndex !== -1) {
         // The nisn form field goes for a few lines.
         const nextLabelIndex = content.indexOf('<div className="relative pt-8">', nIndex); // next step
         content = content.slice(0, nextLabelIndex) + fullBlock + '\n\n\t                                        ' + content.slice(nextLabelIndex);
         fs.writeFileSync(file, content);
         console.log("Moved in registration-form.tsx");
    } else {
         console.log("NISN not found");
    }
} else {
    console.log("FormField not found");
}
