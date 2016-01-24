using System.Collections.Generic;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;

namespace RecipeRepo.Api.Core
{
	public interface IRecipeStore
	{
		ActionResponse AddRecipe(string userId, Recipe recipe);
		ActionResponse<Recipe> GetRecipe(string recipeId);
		ActionResponse<IEnumerable<Recipe>> GetRecipes(IEnumerable<string> recipeIds);
		ActionResponse UpdateRecipe(Recipe recipe);
		ActionResponse DeleteRecipe(string userId, string recipeId);

		ActionResponse<IEnumerable<Recipe>> FindRecipes<TValue>(string fieldName, TValue value, MatchingStrategy strategy, int limit = 100);
		ActionResponse<IEnumerable<Recipe>> Search(string query, string userLang, int limit = 100);
	}
}