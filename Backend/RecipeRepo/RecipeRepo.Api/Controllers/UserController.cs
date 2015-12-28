using System.Web.Http;
using RecipeRepo.Api.Core;
using RecipeRepo.Api.Entities;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;

namespace RecipeRepo.Api.Controllers
{
    public class UserController : BaseApiController
	{
	    private readonly IUserManager _userManager;

		public UserController(IUserManager userManager)
		{
			_userManager = userManager;
		}

	    public IHttpActionResult Get(string id)
		{
			if (string.IsNullOrEmpty(id))
			{
				return BadRequest(AppStatusCode.InvalidInput, "User ID must be provided.");
			}

			var response = _userManager.GetUser(id);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("GET /user/{0} failed with code {1}. {2}", id, (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}

		[AllowAnonymous]
		public IHttpActionResult Post(User user)
		{
			if (user == null)
			{
				return BadRequest(AppStatusCode.InvalidInput, "User must be provided.");
			}

			var response = _userManager.CreateUser(user);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("POST /user failed with code {0}. {1}", (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}

		public IHttpActionResult Put(User user)
		{
			if (user == null || string.IsNullOrEmpty(user.Id))
			{
				return BadRequest(AppStatusCode.InvalidInput, "User and/or a valid ID must be provided.");
			}

			var response = _userManager.UpdateUser(user);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("PUT /user failed with code {0}. {1}", (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}

		public IHttpActionResult Delete(string id)
		{
			if (string.IsNullOrEmpty(id))
			{
				return BadRequest(AppStatusCode.InvalidInput, "User ID must be provided.");
			}

			var response = _userManager.DeleteUser(id);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("DELETE /user/{0} failed with code {1}. {2}", id, (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}

		[Route("api/user/find")]
		[HttpPost]
		public IHttpActionResult Find(FindItemRequest request)
		{
			if (request == null)
			{
				return BadRequest(AppStatusCode.InvalidInput, "Find request object must be provided.");
			}

			var response = _userManager.FindUsersByUserName(request.Value, request.Limit);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("POST /user/find failed for value {0} with code {1}. {2}", request.Value, (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}

	    [Route("api/user/history/{userId}")]
	    public IHttpActionResult GetHistory(string userId)
	    {
			if (string.IsNullOrEmpty(userId))
			{
				return BadRequest(AppStatusCode.InvalidInput, "User ID must be provided.");
			}

		    var response = _userManager.GetUserHistory(userId);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("GET /user/history/{0} failed with code {1}. {2}", userId, response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

		    return Ok(response);
	    }

		[Route("api/user/history")]
		[HttpPut]
		public IHttpActionResult UpdateHistory(UserRecipePairRequest request)
		{
			if (request == null)
			{
				return BadRequest(AppStatusCode.InvalidInput, "Request object must be provided.");
			}

			var response = _userManager.UpdateUserHistory(request.UserId, request.RecipeId);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("POST /user/history failed for user {0} with code {1}. {2}", request.UserId, response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}

		[Route("api/user/favorites")]
		[HttpPut]
		public IHttpActionResult AddFavorite(UserRecipePairRequest request)
		{
			if (request == null)
			{
				return BadRequest(AppStatusCode.InvalidInput, "Request object must be provided.");
			}

			var response = _userManager.SetFavoriteRecipe(request.UserId, request.RecipeId, true);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("PUT /user/favorites failed for user {0} with code {1}. {2}", request.UserId, response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}

		[Route("api/user/favorites/{userId}/{recipeId}")]
		[HttpDelete]
		public IHttpActionResult RemoveFavorite(string userId, string recipeId)
		{
			if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(recipeId))
			{
				return BadRequest(AppStatusCode.InvalidInput, "User and recipe IDs must be provided.");
			}

			var response = _userManager.SetFavoriteRecipe(userId, recipeId, false);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("DELETE /user/favorites/{0}/{1} failed with code {2}. {3}", userId, recipeId, response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}
    }
}
