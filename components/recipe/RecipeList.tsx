'use client';

import React from 'react';
import { Recipe } from '@/lib/types';
import { Edit, Trash2 } from 'lucide-react';

interface RecipeListProps {
  recipes: Recipe[];
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipeId: string) => void;
}

export const RecipeList: React.FC<RecipeListProps> = ({ recipes, onEdit, onDelete }) => {
  if (recipes.length === 0) {
    return (
      <div className="bg-gray-800 p-8 rounded-lg text-center">
        <p className="text-gray-400">No recipes yet. Create your first recipe!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">{recipe.name}</h3>
              <p className="text-gray-400 text-sm">{recipe.totalMass}g total</p>
              <p className="text-gray-500 text-xs mt-1">
                {recipe.ingredients.length} ingredient{recipe.ingredients.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(recipe)}
                className="p-2 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded-lg transition"
                title="Edit recipe"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(recipe.id)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition"
                title="Delete recipe"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700">
            <div>
              <p className="text-gray-400 text-xs mb-1">Per 100g</p>
              <p className="text-white text-lg font-bold">
                {recipe.nutrientsPer100g.calories.toFixed(0)} kcal
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Protein</p>
              <p className="text-blue-400 text-lg font-semibold">
                {recipe.nutrientsPer100g.protein.toFixed(1)}g
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Fats</p>
              <p className="text-yellow-400 text-lg font-semibold">
                {recipe.nutrientsPer100g.fats.toFixed(1)}g
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Carbs</p>
              <p className="text-green-400 text-lg font-semibold">
                {recipe.nutrientsPer100g.carbohydrates.toFixed(1)}g
              </p>
            </div>
          </div>

          {/* Total nutrition */}
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-gray-500 text-xs mb-2">Total Recipe Nutrition:</p>
            <div className="flex gap-4 text-sm">
              <span className="text-gray-400">
                {recipe.totalNutrients.calories.toFixed(0)} kcal
              </span>
              <span className="text-gray-400">
                P: {recipe.totalNutrients.protein.toFixed(1)}g
              </span>
              <span className="text-gray-400">
                F: {recipe.totalNutrients.fats.toFixed(1)}g
              </span>
              <span className="text-gray-400">
                C: {recipe.totalNutrients.carbohydrates.toFixed(1)}g
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
