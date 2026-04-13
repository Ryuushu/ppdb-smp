const fs = require('fs');

const files = [
    'c:/laragon/www/ppdb-smp/resources/js/Pages/Admin/Ppdb/Create.tsx',
    'c:/laragon/www/ppdb-smp/resources/js/Pages/Admin/Ppdb/Edit.tsx',
    'c:/laragon/www/ppdb-smp/resources/js/components/registration-form.tsx'
];

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // Extract the block using indexOf to prevent regex issues.
    // We look for '<Label htmlFor="master_ukuran_seragam_id">'
    const labelIndex = content.indexOf('<Label htmlFor="master_ukuran_seragam_id">');
    if (labelIndex === -1) {
        console.log(`Not found in ${file}`);
        continue;
    }
    
    // The block is inside a `<div className="space-y-2">` which is ~42 characters before.
    let startIdx = content.lastIndexOf('<div className="space-y-2">', labelIndex);
    // Find the end of this div hierarchy. The block usually contains the Select tag and a potential error span.
    // It ends right before the next `<div className="space-y-2">` or `<div className="grid` 
    // BUT since we can just use regex for the entire block text:
    
    const blockRegex = /\s*<div className="space-y-2">\s*<Label htmlFor="master_ukuran_seragam_id">Ukuran Seragam(.*?)\n\s*<\/div>/s;
    const match = content.match(blockRegex);
    if (!match) {
         console.log(`Regex match failed in ${file}`);
         continue;
    }
    
    let blockText = match[0];
    
    // However, if there are nested errors, it could fail. But for master_ukuran_seragam_id, it is standard:
    // <div className="space-y-2"> ... </Select> {errors...} </div>
    // The closing div of the space-y-2 is reliably located. Let's precise the regex to include the span error if any.
    const customRegex = /([ \t]*)<div className="space-y-2">\s*<Label htmlFor="master_ukuran_seragam_id">([\s\S]*?)<\/Select>([\s\S]*?)<\/div>/;
    const preciseMatch = content.match(customRegex);
    
    if (preciseMatch) {
         let indent = preciseMatch[1];
         let fullBlock = preciseMatch[0];
         console.log(`Found complete block in ${file}`);
         
         // Remove block from its current location
         content = content.replace(fullBlock, '');
         
         // Find the end of step 1: 
         // In Create and Edit.tsx it's right before `</div>\n\n							{/* Step 2: Identitas Orang Tua */}`
         // Or more simply insert right before `</div>\n\n							{/* Step 2`
         
         const step2Index = content.indexOf('{/* Step 2: Identitas Orang Tua */}');
         if(step2Index !== -1) {
             const insertPos = content.lastIndexOf('</div>', step2Index);
             content = content.slice(0, insertPos) + fullBlock + '\n\t\t\t\t\t\t\t\t' + content.slice(insertPos);
         } else {
             // For registration-form.tsx, it might use different comments or structure.
             // Find end of generic step 1 block
             const tkIndex = content.indexOf('<Label htmlFor="nisn">NISN</Label>');
             if (tkIndex !== -1) {
                 const nisnEndIndex = content.indexOf('</div>', tkIndex);
                 const nisnDivEnd = content.indexOf('</div>', nisnEndIndex + 6); // ends the space-y-2
                 content = content.slice(0, nisnDivEnd + 6) + '\n\n\t\t\t\t\t\t\t\t\t' + fullBlock + content.slice(nisnDivEnd + 6);
             }
         }
         
         fs.writeFileSync(file, content);
         console.log(`Updated ${file}`);
    }

}
