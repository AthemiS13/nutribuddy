#!/bin/bash

# Define color mappings
declare -A colors=(
    ["bg-\[#0D1B2A\]"]="bg-neutral-950"
    ["bg-\[#1B263B\]"]="bg-neutral-900"
    ["bg-\[#415A77\]"]="bg-neutral-800"
    ["text-\[#E0E1DD\]"]="text-neutral-50"
    ["text-\[#778DA9\]"]="text-neutral-400"
    ["border-\[#0D1B2A\]"]="border-neutral-950"
    ["border-\[#1B263B\]"]="border-neutral-900"
    ["border-\[#415A77\]"]="border-neutral-800"
    ["border border-\[#415A77\]"]="border border-neutral-800"
    ["placeholder-\[#778DA9\]"]="placeholder-neutral-400"
    ["hover:bg-\[#778DA9\]"]="hover:bg-neutral-600"
    ["hover:text-\[#E0E1DD\]"]="hover:text-neutral-50"
    ["hover:bg-\[#415A77\]"]="hover:bg-neutral-800"
    ["focus:ring-2 focus:ring-blue-500"]="focus:ring-2 focus:ring-neutral-600"
    ["focus:ring-2 focus:ring-blue-600"]="focus:ring-2 focus:ring-neutral-600"
)

# Files to process
files=(
    "components/meals/MealLogForm.tsx"
    "components/settings/SettingsPage.tsx"
    "components/recipe/RecipeForm.tsx"
    "components/recipe/RecipeList.tsx"
)

for file in "${files[@]}"; do
    echo "Processing $file..."
    for old in "${!colors[@]}"; do
        new="${colors[$old]}"
        sed -i "" "s/${old}/${new}/g" "$file"
    done
done

echo "Color replacement complete!"
