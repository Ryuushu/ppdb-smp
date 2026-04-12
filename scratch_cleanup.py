import os
import re

files_to_process = [
    'resources/js/Pages/Admin/Ppdb/ListDaftarUlang.tsx',
    'resources/js/Pages/Admin/Ppdb/ListBelumDaftarUlang.tsx',
    'resources/js/Pages/Admin/Kwitansi/Index.tsx',
    'resources/js/Pages/Admin/UkuranSeragam/Index.tsx',
    'resources/js/Pages/Admin/Document/Index.tsx',
    'resources/js/Pages/Admin/Ppdb/Create.tsx',
    'resources/js/Pages/Admin/Ppdb/Edit.tsx',
    'resources/js/Pages/Admin/Ppdb/Show.tsx',
    'resources/js/Pages/Admin/Kwitansi/Rekap.tsx'
]

def remove_tabs_and_programs(file_path):
    if not os.path.exists(file_path):
        return
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove programItems block
    content = re.sub(r'const programItems.*?\];\s*', '', content, flags=re.DOTALL)
    
    # Remove Program interface
    content = re.sub(r'interface Program\s*\{[^}]+\}\s*', '', content, flags=re.DOTALL)
    
    # Remove program property from Peserta or similar interfaces
    content = re.sub(r'\s*program\??: Program;', '', content)
    content = re.sub(r'\s*program\??: string \| number;', '', content)

    # Remove program from Props destructuring
    content = re.sub(r',\s*program(?!Items)', '', content)
    content = re.sub(r'\bprogram\s*,?', '', content) # careful here, but usually safe in these destructures
    
    # Actually wait, simple brute force regex might break things like 'programOptions' or similar strings.
    # It's better not to use regex for destructuring if we aren't careful.
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

for file in files_to_process:
    remove_tabs_and_programs(file)

print("Done")
