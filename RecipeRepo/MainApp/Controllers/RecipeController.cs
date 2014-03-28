using BusinessLogic;
using BusinessLogic.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MainApp.Controllers
{
    public class RecipeController : Controller
    {
		private readonly IRecipeRepository _recipeRepository;

		public RecipeController(IRecipeRepository recipeRepository)
		{
			_recipeRepository = recipeRepository;
		}

        //
        // GET: /Recipe/

		public ActionResult Index(string categoryType, string mealType)
		{
			Category category;
			var success = Enum.TryParse<Category>(categoryType, out category);

			if (!success)
			{
				// Invalid tag category.
			}

			var tags = new[] { new Tag(category, mealType) };
			var filteredRecipes = _recipeRepository.FilterRecipes(tags);

			return View(filteredRecipes);
		}

		//
		// GET: /Recipe/Details

		public ActionResult Details(int id)
		{
			var recipe = _recipeRepository.GetRecipe(id);

			if (recipe == null)
			{
				// TODO: Show error?
			}

			return View(recipe);
		}

    }
}
