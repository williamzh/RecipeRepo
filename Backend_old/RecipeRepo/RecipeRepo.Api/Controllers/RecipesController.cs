using RecipeRepo.Api.BusinessLogic;
using RecipeRepo.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace RecipeRepo.Api.Controllers
{
	[EnableCors(origins: "http://localhost:8000", headers: "*", methods: "*")]
	public class RecipesController : ApiController
	{
		private readonly IRecipeStore _recipeStore;

		public RecipesController(IRecipeStore recipeStore)
		{
			_recipeStore = recipeStore;
		}

		// GET api/recipes
		public IEnumerable<Recipe> Get()
		{
			return _recipeStore.GetRecipes();
		}

		// GET api/recipes/{id}
		public Recipe Get(int id)
		{
			return _recipeStore.GetRecipe(id);
		}

		// POST api/recipes
		public void Post([FromBody]Recipe recipe)
		{
			_recipeStore.AddRecipe(recipe);
		}

		// PUT api/recipes/{id}
		public void Put([FromBody]Recipe recipe)
		{
			_recipeStore.UpdateRecipe(recipe);
		}

		// DELETE api/recipes/{id}
		public void Delete(int id)
		{
			_recipeStore.DeleteRecipe(id);
		}
	}
}