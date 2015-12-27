using System.Web.Http;
using RecipeRepo.Api.Entities;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;
using RecipeRepo.Integrations.Repositories;

namespace RecipeRepo.Api.Controllers
{
    public class RecipesController : BaseApiController
	{
		private readonly IDbRepository<Recipe> _recipeRepo;
		private readonly IDbRepository<User> _userRepository;

		public RecipesController(IDbRepository<Recipe> recipeRepo, IDbRepository<User> userRepository)
		{
			_recipeRepo = recipeRepo;
			_userRepository = userRepository;
		}

	    public IHttpActionResult Get(string id)
		{
			if (string.IsNullOrEmpty(id))
			{
				return BadRequest(AppStatusCode.InvalidInput, "Recipe ID must be provided.");
			}

			var response = _recipeRepo.Get(id);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("GET /recipes/{0} failed with code {1}. {2}", id, (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}

		public IHttpActionResult Post(AddRecipeRequest request)
		{
			if (request == null)
			{
				return BadRequest(AppStatusCode.InvalidInput, "Request must be provided.");
			}

			var getUserResponse = _userRepository.Get(request.UserId);
			if (getUserResponse.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("POST /recipes failed. Could not retrieve user with ID {0}. {1}", request.UserId, getUserResponse.Message);
				return InternalServerError(getUserResponse.Code, getUserResponse.Message);
			}

			var response = _recipeRepo.Add(request.Recipe);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("POST /recipes failed with code {0}. Could not add recipe. {1}", (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			var user = getUserResponse.Data;
			user.OwnedRecipes.Add(request.Recipe.Id);

			var updateUserResponse = _userRepository.Update(user);
			if (updateUserResponse.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("POST /recipes failed. Could not associate new recipe with user {0}. {1}", request.UserId, updateUserResponse.Message);
				return InternalServerError(getUserResponse.Code, getUserResponse.Message);
			}

			return Ok(response);
		}

		public IHttpActionResult Put(Recipe recipe)
		{
			if (recipe == null || string.IsNullOrEmpty(recipe.Id))
			{
				return BadRequest(AppStatusCode.InvalidInput, "Recipe and/or a valid ID must be provided.");
			}

			var response = _recipeRepo.Update(recipe);
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

			var response = _recipeRepo.Remove(id);
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

			var response = _recipeRepo.Search(query);
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

			var response = _recipeRepo.Find(request.FieldName, request.Value, request.Strategy, request.Limit);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("POST /recipes/find failed for field {0} and value {1} with code {2}. {3}", request.FieldName, request.Value, (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}
    }
}
