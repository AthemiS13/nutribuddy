'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getUserRecipes } from '@/lib/recipe-service';
import { logMeal } from '@/lib/meal-service';
import { Recipe } from '@/lib/types';
import { Plus, Loader2, Search, X } from 'lucide-react';

interface MealLogFormProps {
  userId: string;
  onSuccess: () => void;
}

export const MealLogForm: React.FC<MealLogFormProps> = ({ userId, onSuccess }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [mass, setMass] = useState('');
  const [useFullRecipe, setUseFullRecipe] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadRecipes();
  }, [userId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.recipe-search-container')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  // Filter recipes based on search query
  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) return recipes;
    
    const query = searchQuery.toLowerCase();
    return recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(query)
    );
  }, [recipes, searchQuery]);

  const loadRecipes = async () => {
    try {
      const userRecipes = await getUserRecipes(userId);
      setRecipes(userRecipes);
    } catch (err: any) {
      setError('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRecipe) {
      setError('Please select a recipe');
      return;
    }
    
    // Use full recipe mass or custom mass
    const massToLog = useFullRecipe ? selectedRecipe.totalMass : parseFloat(mass);
    
    if (isNaN(massToLog) || massToLog <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    setSaving(true);
    setError('');
    
    try {
      await logMeal(
        userId,
        selectedRecipe.id,
        selectedRecipe.name,
        massToLog,
        selectedRecipe.nutrientsPer100g
      );
      setSelectedRecipe(null);
      setMass('');
      setUseFullRecipe(true);
      setSearchQuery('');
      setShowDropdown(false);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to log meal');
    } finally {
      setSaving(false);
    }
  };

  const calculateNutrients = () => {
    if (!selectedRecipe) return null;
    
    const massToUse = useFullRecipe ? selectedRecipe.totalMass : (parseFloat(mass) || 0);
    const multiplier = massToUse / 100;
    
    return {
      calories: selectedRecipe.nutrientsPer100g.calories * multiplier,
      protein: selectedRecipe.nutrientsPer100g.protein * multiplier,
      fats: selectedRecipe.nutrientsPer100g.fats * multiplier,
      carbohydrates: selectedRecipe.nutrientsPer100g.carbohydrates * multiplier,
      mass: massToUse,
    };
  };

  const nutrients = calculateNutrients();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <p className="text-gray-400">No recipes found. Create a recipe first to log meals.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">Log a Meal</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className="recipe-search-container">
          <label className="block text-sm font-medium text-gray-300 mb-2">Select Recipe</label>
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={selectedRecipe ? selectedRecipe.name : searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                  if (selectedRecipe) {
                    setSelectedRecipe(null);
                  }
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search recipes..."
                className="w-full pl-10 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {(searchQuery || selectedRecipe) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRecipe(null);
                    setShowDropdown(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {showDropdown && !selectedRecipe && (
              <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredRecipes.length > 0 ? (
                  filteredRecipes.map((recipe) => (
                    <button
                      key={recipe.id}
                      type="button"
                      onClick={() => {
                        setSelectedRecipe(recipe);
                        setSearchQuery('');
                        setShowDropdown(false);
                        setUseFullRecipe(true);
                        setMass('');
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-600 transition border-b border-gray-600 last:border-b-0"
                    >
                      <div className="font-medium text-white">{recipe.name}</div>
                      <div className="text-sm text-gray-400">
                        {recipe.totalNutrients.calories.toFixed(0)} kcal • {recipe.totalMass}g
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-400 text-center">
                    No recipes found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {selectedRecipe && (
          <>
            <div className="space-y-3">
              {/* Full Recipe Option */}
              <button
                type="button"
                onClick={() => setUseFullRecipe(true)}
                className={`w-full p-4 rounded-lg border-2 transition text-left ${
                  useFullRecipe
                    ? 'border-blue-600 bg-blue-600/10'
                    : 'border-zinc-700 bg-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">Full Recipe</span>
                  <span className="text-sm text-zinc-400">{selectedRecipe.totalMass}g</span>
                </div>
                <div className="text-sm text-zinc-400">
                  {selectedRecipe.totalNutrients.calories.toFixed(0)} kcal • {selectedRecipe.totalNutrients.protein.toFixed(0)}g protein
                </div>
              </button>

              {/* Custom Amount Option */}
              <button
                type="button"
                onClick={() => setUseFullRecipe(false)}
                className={`w-full p-4 rounded-lg border-2 transition text-left ${
                  !useFullRecipe
                    ? 'border-blue-600 bg-blue-600/10'
                    : 'border-zinc-700 bg-zinc-800'
                }`}
              >
                <span className="font-semibold text-white">Custom Amount</span>
              </button>
            </div>

            {!useFullRecipe && (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Amount (grams)
                </label>
                <input
                  type="number"
                  value={mass}
                  onChange={(e) => setMass(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Enter grams"
                  min="0"
                  step="1"
                />
              </div>
            )}

            {nutrients && (
              <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                <h3 className="text-sm font-semibold text-zinc-300 mb-3">
                  {useFullRecipe ? 'Full Recipe' : `${nutrients.mass}g`} Nutrition
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-zinc-400 text-xs">Calories</p>
                    <p className="text-white text-lg font-bold">
                      {nutrients.calories.toFixed(0)} kcal
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-xs">Protein</p>
                    <p className="text-white text-lg">{nutrients.protein.toFixed(1)}g</p>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-xs">Fats</p>
                    <p className="text-white text-lg">{nutrients.fats.toFixed(1)}g</p>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-xs">Carbs</p>
                    <p className="text-white text-lg">{nutrients.carbohydrates.toFixed(1)}g</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              {saving ? 'Logging...' : 'Log Meal'}
            </button>
          </>
        )}
      </form>
    </div>
  );
};
