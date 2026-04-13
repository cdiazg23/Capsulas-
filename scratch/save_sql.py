import subprocess
import os

with open('c:/Users/carlo/OneDrive/Escritorio/iuris/scratch/all_procesal.sql', 'w', encoding='utf-8') as f:
    subprocess.run(['python', 'c:/Users/carlo/OneDrive/Escritorio/iuris/parse_procesal.py'], stdout=f)

print("SQL generated successfully in UTF-8")
