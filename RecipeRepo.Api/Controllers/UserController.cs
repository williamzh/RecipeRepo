using System.Web.Http;
using RecipeRepo.Api.Core;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;

namespace RecipeRepo.Api.Controllers
{
	[Authorize]
    public class UserController : BaseApiController
	{
	    private readonly IUserManager _userManager;

		public UserController(IUserManager userManager)
		{
			_userManager = userManager;
		}

	    public IHttpActionResult Get()
		{
			var response = _userManager.GetUser(ClaimContext.UserId);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("GET /user/{0} failed with code {1}. {2}", ClaimContext.UserId, (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.UserMessage);
			}

			return Ok(response);
		}

		[Route("api/user/find/{userName}")]
		public IHttpActionResult GetByUserName(string userName)
		{
			if (string.IsNullOrEmpty(userName))
			{
				return BadRequest(AppStatusCode.InvalidInput, "Username must be provided.");
			}

			var response = _userManager.GetUserByUserName(userName);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("GET /user/{0} failed with code {1}. {2}", userName, (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.UserMessage);
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
				return InternalServerError(response.Code, response.UserMessage);
			}

			return Ok(response);
		}

		public IHttpActionResult Put(User user)
		{
			if (user == null)
			{
				return BadRequest(AppStatusCode.InvalidInput, "User must be provided.");
			}

			// Ensure that we only update the current user
			user.Id = ClaimContext.UserId;

			var response = _userManager.UpdateUser(user);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("PUT /user failed with code {0}. {1}", (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.UserMessage);
			}

			return Ok(response);
		}

		public IHttpActionResult Delete()
		{
			var response = _userManager.DeleteUser(ClaimContext.UserId);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("DELETE /user/{0} failed with code {1}. {2}", ClaimContext.UserId, (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.UserMessage);
			}

			return Ok(response);
		}

	    [Route("api/user/history")]
	    public IHttpActionResult GetHistory()
	    {
		    var response = _userManager.GetUserHistory(ClaimContext.UserId);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("GET /user/history failed with code {0}. {1}", response.Code, response.Message);
				return InternalServerError(response.Code, response.UserMessage);
			}

		    return Ok(response);
	    }

		[Route("api/user/history/{recipeId}")]
		[HttpPut]
		public IHttpActionResult AddHistory(string recipeId)
		{
			if (string.IsNullOrEmpty(recipeId))
			{
				return BadRequest(AppStatusCode.InvalidInput, "Recipe ID must be provided.");
			}

			var response = _userManager.AddUserHistory(ClaimContext.UserId, recipeId);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("PUT /user/history failed for user {0} with code {1}. {2}", ClaimContext.UserId, response.Code, response.Message);
				return InternalServerError(response.Code, response.UserMessage);
			}

			return Ok(response);
		}

		[Route("api/user/history/{recipeId}")]
		[HttpDelete]
		public IHttpActionResult RemoveHistory(string recipeId)
		{
			if (string.IsNullOrEmpty(recipeId))
			{
				return BadRequest(AppStatusCode.InvalidInput, "Recipe ID must be provided.");
			}

			var response = _userManager.RemoveUserHistory(ClaimContext.UserId, recipeId);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("DELETE /user/history failed for user {0} with code {1}. {2}", ClaimContext.UserId, response.Code, response.Message);
				return InternalServerError(response.Code, response.UserMessage);
			}

			return Ok(response);
		}

		[Route("api/user/favorites/{recipeId}")]
		[HttpPut]
		public IHttpActionResult AddFavorite(string recipeId)
		{
			if (string.IsNullOrEmpty(recipeId))
			{
				return BadRequest(AppStatusCode.InvalidInput, "Rrecipe ID must be provided.");
			}

			var response = _userManager.SetFavoriteRecipe(ClaimContext.UserId, recipeId, true);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("PUT /user/favorites/{0} failed for user {1} with code {2}. {3}", recipeId, ClaimContext.UserId, response.Code, response.Message);
				return InternalServerError(response.Code, response.UserMessage);
			}

			return Ok(response);
		}

		[Route("api/user/favorites/{recipeId}")]
		[HttpDelete]
		public IHttpActionResult RemoveFavorite(string recipeId)
		{
			if (string.IsNullOrEmpty(recipeId))
			{
				return BadRequest(AppStatusCode.InvalidInput, "Recipe ID must be provided.");
			}

			var response = _userManager.SetFavoriteRecipe(ClaimContext.UserId, recipeId, false);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("DELETE /user/favorites/{0} failed for user {1} with code {2}. {3}", recipeId, ClaimContext.UserId, response.Code, response.Message);
				return InternalServerError(response.Code, response.UserMessage);
			}

			return Ok(response);
		}
    }
}
