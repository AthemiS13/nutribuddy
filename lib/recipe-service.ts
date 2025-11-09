import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import { Recipe, RecipeIngredient, Nutrient } from './types';

export const calculateNutrients = (ingredients: RecipeIngredient[]): {
  totalNutrients: Nutrient;
  totalMass: number;
  nutrientsPer100g: Nutrient;
} => {
  const totalMass = ingredients.reduce((sum, item) => sum + item.mass, 0);
  
  const totalNutrients: Nutrient = {
    calories: 0,
    protein: 0,
    fats: 0,
    carbohydrates: 0,
  };

  ingredients.forEach((item) => {
    const multiplier = item.mass / 100; // Convert to per 100g
    totalNutrients.calories += item.ingredient.nutrients.calories * multiplier;
    totalNutrients.protein += item.ingredient.nutrients.protein * multiplier;
    totalNutrients.fats += item.ingredient.nutrients.fats * multiplier;
    totalNutrients.carbohydrates += item.ingredient.nutrients.carbohydrates * multiplier;
  });

  const nutrientsPer100g: Nutrient = {
    calories: totalMass > 0 ? (totalNutrients.calories / totalMass) * 100 : 0,
    protein: totalMass > 0 ? (totalNutrients.protein / totalMass) * 100 : 0,
    fats: totalMass > 0 ? (totalNutrients.fats / totalMass) * 100 : 0,
    carbohydrates: totalMass > 0 ? (totalNutrients.carbohydrates / totalMass) * 100 : 0,
  };

  return { totalNutrients, totalMass, nutrientsPer100g };
};

export const createRecipe = async (
  userId: string,
  name: string,
  ingredients: RecipeIngredient[]
): Promise<string> => {
  try {
    const { totalNutrients, totalMass, nutrientsPer100g } = calculateNutrients(ingredients);
    
  const now = new Date().toISOString();
  if (!db) throw new Error('Firestore not initialized. Ensure NEXT_PUBLIC_FIREBASE_* env vars are set and Firebase initializes on the client.');
  const recipesRef = collection(db as any, 'users', userId, 'recipes');
    
    // Clean ingredients to remove undefined fields
    const cleanedIngredients = ingredients.map(item => {
      const cleanItem: any = {
        ingredient: item.ingredient,
        mass: item.mass,
      };
      if (item.quantity !== undefined) {
        cleanItem.quantity = item.quantity;
      }
      return cleanItem;
    });
    
    const recipeData = {
      userId,
      name,
      ingredients: cleanedIngredients,
      totalNutrients,
      nutrientsPer100g,
      totalMass,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(recipesRef, recipeData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
};

export const getRecipe = async (userId: string, recipeId: string): Promise<Recipe | null> => {
  try {
  if (!db) throw new Error('Firestore not initialized. Ensure NEXT_PUBLIC_FIREBASE_* env vars are set and Firebase initializes on the client.');
  const docRef = doc(db as any, 'users', userId, 'recipes', recipeId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Recipe;
    }
    return null;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
};

export const getUserRecipes = async (userId: string): Promise<Recipe[]> => {
  try {
  if (!db) throw new Error('Firestore not initialized. Ensure NEXT_PUBLIC_FIREBASE_* env vars are set and Firebase initializes on the client.');
  const recipesRef = collection(db as any, 'users', userId, 'recipes');
  const q = query(recipesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Recipe[];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

export const updateRecipe = async (
  userId: string,
  recipeId: string,
  name: string,
  ingredients: RecipeIngredient[]
): Promise<void> => {
  try {
    const { totalNutrients, totalMass, nutrientsPer100g } = calculateNutrients(ingredients);
    
    // Clean ingredients to remove undefined fields
    const cleanedIngredients = ingredients.map(item => {
      const cleanItem: any = {
        ingredient: item.ingredient,
        mass: item.mass,
      };
      if (item.quantity !== undefined) {
        cleanItem.quantity = item.quantity;
      }
      return cleanItem;
    });
    
    if (!db) throw new Error('Firestore not initialized. Ensure NEXT_PUBLIC_FIREBASE_* env vars are set and Firebase initializes on the client.');
    const docRef = doc(db as any, 'users', userId, 'recipes', recipeId);
    await updateDoc(docRef, {
      name,
      ingredients: cleanedIngredients,
      totalNutrients,
      nutrientsPer100g,
      totalMass,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
};

export const deleteRecipe = async (userId: string, recipeId: string): Promise<void> => {
  try {
    if (!db) throw new Error('Firestore not initialized. Ensure NEXT_PUBLIC_FIREBASE_* env vars are set and Firebase initializes on the client.');
    const docRef = doc(db as any, 'users', userId, 'recipes', recipeId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};
