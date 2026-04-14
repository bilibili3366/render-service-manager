import re

with open('/home/engine/project/src/views/dashboardScript.js', 'r') as f:
    content = f.read()

split_idx = content.find('// Jobs')
if split_idx != -1:
    part1 = content[:split_idx]
    part2 = content[split_idx:]
    
    # Revert first if needed, but since we are modifying the ALREADY CHECKED OUT file,
    # part1 has `;\n\n\n at the end. Let's make sure.
    part1 = part1.replace("});\n`;\n\n\n\n", "});\n\n\n\n")
    part1 = part1.replace("});\n`;\n\n\n", "});\n\n\n")
    part1 = part1.replace("});\n`;\n\n", "});\n\n")
    
    # Escape backticks in part2
    part2 = part2.replace('`', '\\`')
    
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
