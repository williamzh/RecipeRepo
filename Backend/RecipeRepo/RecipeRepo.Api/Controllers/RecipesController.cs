using System.Web.Http;
using RecipeRepo.Api.Entities;
using RecipeRepo.Integrations.Entities;
using RecipeRepo.Integrations.Repositories;

namespace RecipeRepo.Api.Controllers
{
    public class RecipesController : BaseApiController
	{
		private readonly IDbRepository<Recipe> _recipeRepo;

		public RecipesController(IDbRepository<Recipe> recipeRepo)
		{
			_recipeRepo = recipeRepo;
		}

		public IHttpActionResult Get(string id)
		{
			if (string.IsNullOrEmpty(id))
			{
				return BadRequest("Recipe ID must be provided.");
			}

			var response = _recipeRepo.Get(id);
			if (!response.IsSuccess)
			{
				Log.ErrorFormat("GET /recipes/{0} failed. {1}", id, response.Message);
				return InternalServerError(response.Message);
			}

			return Ok(response.Data);
		}

		public IHttpActionResult Post(Recipe recipe)
		{
			if (recipe == null)
			{
				return BadRequest("Recipe must be provided.");
			}

			var response = _recipeRepo.Add(recipe);
			if (!response.IsSuccess)
			{
				Log.ErrorFormat("POST /recipes failed. {0}", response.Message);
				return InternalServerError(response.Message);
			}

			return Ok();
		}

		public IHttpActionResult Put(Recipe recipe)
		{
			if (recipe == null || string.IsNullOrEmpty(recipe.Id))
			{
				return BadRequest("Recipe and/or a valid ID must be provided.");
			}

			var response = _recipeRepo.Update(recipe);
			if (!response.IsSuccess)
			{
				Log.ErrorFormat("PUT /recipes failed. {0}", response.Message);
				return InternalServerError(response.Message);
			}

			return Ok();
		}

		public IHttpActionResult Delete(string id)
		{
			if (string.IsNullOrEmpty(id))
			{
				return BadRequest("Recipe ID must be provided.");
			}

			var response = _recipeRepo.Remove(id);
			if (!response.IsSuccess)
			{
				Log.ErrorFormat("DELETE /recipes/{0} failed. {1}", id, response.Message);
				return InternalServerError(response.Message);
			}

			return Ok();
		}

		[Route("api/recipes/search/{query}")]
		[HttpGet]
		public IHttpActionResult Search(string query)
		{
			if (string.IsNullOrEmpty(query))
			{
				return BadRequest("Search query must be provided.");
			}

			var response = _recipeRepo.Search(query);
			if (!response.IsSuccess)
			{
				Log.ErrorFormat("POST /recipes/search failed for query {0}. {1}", query, response.Message);
				return InternalServerError(response.Message);
			}

			return Ok(response.Data);
		}

		[Route("api/recipes/find")]
		[HttpPost]
		public IHttpActionResult Find(FindClientRequest request)
		{
			if (request == null)
			{
				return BadRequest("Find request object must be provided.");
			}

			var response = _recipeRepo.Find(request.FieldName, request.Value, request.Strategy, request.Limit);
			if (!response.IsSuccess)
			{
				Log.ErrorFormat("POST /recipes/find failed for field {0} and value {1}. {2}", request.FieldName, request.Value, response.Message);
				return InternalServerError(response.Message);
			}

			return Ok(response.Data);
		}
    }
}
