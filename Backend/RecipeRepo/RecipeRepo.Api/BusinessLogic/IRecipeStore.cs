using RecipeRepo.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RecipeRepo.Api.BusinessLogic
{
	public interface IRecipeStore
	{
		void AddRecipe(Recipe recipe);

		Recipe GetRecipe(int id);
		IEnumerable<Recipe> GetRecipes();
		Recipe FindRecipe(string name);
		IEnumerable<Recipe> FilterRecipes(IEnumerable<Tag> tags);

		void UpdateRecipe(Recipe recipe);

		void DeleteRecipe(int id);
	}
}
