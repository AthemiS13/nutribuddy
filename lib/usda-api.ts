import { Ingredient } from './types';

const USDA_API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY;
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

interface USDASearchResult {
  fdcId: number;
  description: string;
  servingSize?: number;
  servingSizeUnit?: string;
  foodPortions?: Array<{
    amount: number;
    gramWeight: number;
    modifier: string;
  }>;
  foodNutrients: Array<{
    nutrientId: number;
    nutrientName: string;
    nutrientNumber: string;
    unitName: string;
    value: number;
  }>;
}

interface USDASearchResponse {
  foods: USDASearchResult[];
  totalHits: number;
}

// Nutrient IDs from USDA API
const NUTRIENT_IDS = {
  ENERGY: 1008, // Energy (kcal)
  PROTEIN: 1003, // Protein
  FAT: 1004, // Total lipid (fat)
  CARBS: 1005, // Carbohydrate
};

// In-memory cache for frequently used ingredients
const ingredientCache = new Map<number, Ingredient>();

export const searchIngredients = async (query: string): Promise<Ingredient[]> => {
  if (!USDA_API_KEY) {
    throw new Error('USDA API key is not configured');
  }

  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch(
      `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(
        query
      )}&dataType=Foundation,SR Legacy&pageSize=25`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('API rate limit exceeded. Please wait a moment and try again.');
      }
      throw new Error('Failed to fetch ingredients from USDA API');
    }

    const data: USDASearchResponse = await response.json();

    const ingredients: Ingredient[] = data.foods.map((food) => {
      const nutrients = {
        calories: 0,
        protein: 0,
        fats: 0,
        carbohydrates: 0,
      };

      food.foodNutrients.forEach((nutrient) => {
        // Convert all values to per 100g
        const valuePer100g = nutrient.value;

        switch (nutrient.nutrientId) {
          case NUTRIENT_IDS.ENERGY:
            nutrients.calories = valuePer100g;
            break;
          case NUTRIENT_IDS.PROTEIN:
            nutrients.protein = valuePer100g;
            break;
          case NUTRIENT_IDS.FAT:
            nutrients.fats = valuePer100g;
            break;
          case NUTRIENT_IDS.CARBS:
            nutrients.carbohydrates = valuePer100g;
            break;
        }
      });

      const ingredient: Ingredient = {
        fdcId: food.fdcId,
        description: food.description,
        nutrients,
      };

      // Extract serving size information from API only
      if (food.servingSize && food.servingSizeUnit) {
        ingredient.servingSize = food.servingSize;
        ingredient.servingUnit = food.servingSizeUnit;
      } else if (food.foodPortions && food.foodPortions.length > 0) {
        // Use the first portion as default serving
        const portion = food.foodPortions[0];
        ingredient.servingSize = portion.gramWeight;
        ingredient.servingUnit = portion.modifier || 'serving';
      }

      // Cache the ingredient
      ingredientCache.set(food.fdcId, ingredient);

      return ingredient;
    });

    return ingredients;
  } catch (error) {
    console.error('Error searching ingredients:', error);
    throw error;
  }
};

export const getIngredientById = async (fdcId: number): Promise<Ingredient | null> => {
  // Check cache first
  if (ingredientCache.has(fdcId)) {
    return ingredientCache.get(fdcId)!;
  }

  if (!USDA_API_KEY) {
    throw new Error('USDA API key is not configured');
  }

  try {
    const response = await fetch(
      `${USDA_BASE_URL}/food/${fdcId}?api_key=${USDA_API_KEY}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch ingredient details');
    }

    const data: USDASearchResult = await response.json();

    const nutrients = {
      calories: 0,
      protein: 0,
      fats: 0,
      carbohydrates: 0,
    };

    data.foodNutrients.forEach((nutrient) => {
      const valuePer100g = nutrient.value;

      switch (nutrient.nutrientId) {
        case NUTRIENT_IDS.ENERGY:
          nutrients.calories = valuePer100g;
          break;
        case NUTRIENT_IDS.PROTEIN:
          nutrients.protein = valuePer100g;
          break;
        case NUTRIENT_IDS.FAT:
          nutrients.fats = valuePer100g;
          break;
        case NUTRIENT_IDS.CARBS:
          nutrients.carbohydrates = valuePer100g;
          break;
      }
    });

    const ingredient: Ingredient = {
      fdcId: data.fdcId,
      description: data.description,
      nutrients,
    };

    // Cache the ingredient
    ingredientCache.set(fdcId, ingredient);

    return ingredient;
  } catch (error) {
    console.error('Error fetching ingredient by ID:', error);
    throw error;
  }
};

// Clear cache if needed (e.g., after a certain time)
export const clearIngredientCache = () => {
  ingredientCache.clear();
};
