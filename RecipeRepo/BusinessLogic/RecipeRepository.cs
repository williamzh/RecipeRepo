using BusinessLogic.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic
{
    public class RecipeRepository : IRecipeRepository
    {
		public void AddRecipe(Recipe recipe)
		{
			if (!Recipe.Recipes.Any(r => r.Id == recipe.Id))
			{
				Recipe.Recipes.Add(recipe);
			}
		}

		public Recipe GetRecipe(int id)
		{
			return Recipe.Recipes.FirstOrDefault(r => r.Id == id);
		}

		public IEnumerable<Recipe> GetRecipes()
		{
			return Recipe.Recipes;
		}

		public Recipe FindRecipe(string name)
		{
			return Recipe.Recipes.FirstOrDefault(r => r.Name.Equals(name, StringComparison.OrdinalIgnoreCase) || r.Name.Contains(name));
		}

		public IEnumerable<Recipe> FilterRecipes(IEnumerable<Tag> tags)
		{
			var filteredRecipes = new List<Recipe>();

			foreach (var tag in tags)
			{
				filteredRecipes.AddRange(Recipe.Recipes.Where(r => r.Tags.Any(t => t.Category == tag.Category && t.Value == tag.Value)));
			}

			return filteredRecipes;
		}

		public void UpdateRecipe(Recipe recipe)
		{
			var existingRecipe = Recipe.Recipes.FirstOrDefault(r => r.Id == recipe.Id);
			if (existingRecipe == null)
			{
				throw new InvalidOperationException("Item with id " + recipe.Id + " does not exist.");
			}

			Recipe.Recipes.Remove(existingRecipe);
			Recipe.Recipes.Add(recipe);
		}

		public void DeleteRecipe(int id)
		{
			var recipeToRemove = Recipe.Recipes.FirstOrDefault(r => r.Id == id);
			if (recipeToRemove != null)
			{
				Recipe.Recipes.Remove(recipeToRemove);
			}
		}
	}
}
