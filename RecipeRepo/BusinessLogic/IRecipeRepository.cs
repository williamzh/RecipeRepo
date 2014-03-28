using BusinessLogic.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic
{
	public interface IRecipeRepository
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
