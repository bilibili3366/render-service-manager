import re
import sys

with open('/home/engine/project/src/views/dashboardScript.js', 'r') as f:
    content = f.read()

split_idx = content.find('// Jobs')
if split_idx != -1:
    part1 = content[:split_idx]
    part2 = content[split_idx:]
    
    # Remove the backtick at line 1963
    part1 = part1.replace("});\n`;\n\n\n\n", "});\n\n\n\n")
    part1 = part1.replace("});\n`;\n\n\n", "});\n\n\n")
    
    # Also just in case:
    part1 = part1.replace("});\n`;", "});\n")
    
    # Escape ${ in part2
    part2 = part2.replace('${', '\\${')
    
    # Ensure part2 ends with a newline
    if not part2.endswith('\n'):
        part2 += '\n'
        
    part2 += '`;\n'
    
    with open('/home/engine/project/src/views/dashboardScript.js', 'w') as f:
        f.write(part1 + part2)
    print("Fixed!")
else:
    print("Could not find // Jobs")
