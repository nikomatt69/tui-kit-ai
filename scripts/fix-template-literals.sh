#!/bin/bash

# Find and replace problematic template literals across the project
find . -type f -name "*.ts" | while read file; do
    # Replace template literals with concatenation
    sed -i '' 's/`\([^`]*\)\${/`\1` + \${/g' "$file"
    
    # Remove double quote escaping if needed
    sed -i '' 's/\\"/ /g' "$file"
    
    # Remove trailing literal template backticks that might have been mangled
    sed -i '' 's/`$//g' "$file"
    
    # Catch any remaining interpolation syntax issues
    sed -i '' 's/`\(.*\)\${/\1 + \${/g' "$file"
    sed -i '' 's/\${/\{/g' "$file"
done

echo "Template literal fixing complete."