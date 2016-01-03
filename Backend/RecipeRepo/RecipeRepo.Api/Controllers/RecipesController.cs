using System.Web.Http;
using RecipeRepo.Api.Contract;
using RecipeRepo.Api.Core;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;

namespace RecipeRepo.Api.Controllers
{
    public class RecipesController : BaseApiController
    {
	    private readonly IRecipeStore _recipeStore;

		public RecipesController(IRecipeStore recipeStore)
		{
			_recipeStore = recipeStore;
		}

	    public IHttpActionResult Get(string id)
		{
			if (string.IsNullOrEmpty(id))
			{
				return BadRequest(AppStatusCode.InvalidInput, "Recipe ID must be provided.");
			}

			var response = _recipeStore.GetRecipe(id);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("GET /recipes/{0} failed with code {1}. {2}", id, (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}

		public IHttpActionResult Post(Recipe recipe)
		{
			if (recipe == null)
			{
				return BadRequest(AppStatusCode.InvalidInput, "Recipe must be provided.");
			}

			var response = _recipeStore.AddRecipe(ClaimContext.UserId, recipe);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("POST /recipes failed with code {0}. Could not add recipe. {1}", (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}

		public IHttpActionResult Put(Recipe recipe)
		{
			if (recipe == null || string.IsNullOrEmpty(recipe.Id))
			{
				return BadRequest(AppStatusCode.InvalidInput, "Recipe and/or a valid ID must be provided.");
			}

			var response = _recipeStore.UpdateRecipe(recipe);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("PUT /recipes failed with code {0}. {1}", (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}

		public IHttpActionResult Delete(string id)
		{
			if (string.IsNullOrEmpty(id))
			{
				return BadRequest(AppStatusCode.InvalidInput, "Recipe ID must be provided.");
			}

			var response = _recipeStore.DeleteRecipe(id);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("DELETE /recipes/{0} failed with code {1}. {2}", id, (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}

		[Route("api/recipes/search/{query}")]
		[HttpGet]
		public IHttpActionResult Search(string query)
		{
			if (string.IsNullOrEmpty(query))
			{
				return BadRequest(AppStatusCode.InvalidInput, "Search query must be provided.");
			}

			var response = _recipeStore.Search(query);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("POST /recipes/search failed for query {0} with code {1}. {2}", query, (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}

		[Route("api/recipes/find")]
		[HttpPost]
		public IHttpActionResult Find(FindItemRequest request)
		{
			if (request == null)
			{
				return BadRequest(AppStatusCode.InvalidInput, "Find request object must be provided.");
			}

			var response = _recipeStore.FindRecipes(request.FieldName, request.Value, request.Strategy, request.Limit);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("POST /recipes/find failed for field {0} and value {1} with code {2}. {3}", request.FieldName, request.Value, (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}
    }
}
