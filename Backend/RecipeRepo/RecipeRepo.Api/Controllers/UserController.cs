using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using RecipeRepo.Api.Entities;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;
using RecipeRepo.Integrations.Repositories;

namespace RecipeRepo.Api.Controllers
{
    public class UserController : BaseApiController
	{
		private readonly IDbRepository<User> _userRepository;
		private readonly IDbRepository<Recipe> _recipeRepository;

		public UserController(IDbRepository<User> userRepository, IDbRepository<Recipe> recipeRepository)
		{
			_userRepository = userRepository;
			_recipeRepository = recipeRepository;
		}

	    public IHttpActionResult Get(string id)
		{
			if (string.IsNullOrEmpty(id))
			{
				return BadRequest(AppStatusCode.InvalidInput, "User ID must be provided.");
			}

			var response = _userRepository.Get(id);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("GET /user/{0} failed with code {1}. {2}", id, (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			response.Data.Password = null;

			return Ok(response);
		}

		public IHttpActionResult Post(User user)
		{
			if (user == null)
			{
				return BadRequest(AppStatusCode.InvalidInput, "User must be provided.");
			}

			var response = _userRepository.Add(user);
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

			var response = _userRepository.Update(user);
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

			var response = _userRepository.Remove(id);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("DELETE /user/{0} failed with code {1}. {2}", id, (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}

		[Route("api/user/find")]
		[HttpPost]
		public IHttpActionResult Find(FindClientRequest request)
		{
			if (request == null)
			{
				return BadRequest(AppStatusCode.InvalidInput, "Find request object must be provided.");
			}

			var response = _userRepository.Find(request.FieldName, request.Value, request.Strategy, request.Limit);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("POST /user/find failed for field {0} and value {1} with code {2}. {3}", request.FieldName, request.Value, (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			foreach (var user in response.Data)
			{
				user.Password = null;
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

		    var response = _userRepository.Get(userId);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("GET /user/history/{0} failed. Could not retrieve user with ID {1}. {2}", userId, userId, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

		    var history = response.Data.LastViewedRecipes.Take(10);
		    var viewedRecipes = _recipeRepository.Get(history).Data;

		    return Ok(new ActionResponse<ICollection<Recipe>>
		    {
			    Code = response.Code,
				Data = viewedRecipes.ToList()
		    });
	    }

		[Route("api/user/history")]
		[HttpPost]
		public IHttpActionResult UpdateHistory(UpdateHistoryRequest request)
		{
			if (request == null)
			{
				return BadRequest(AppStatusCode.InvalidInput, "Find request object must be provided.");
			}

			var getUserResponse = _userRepository.Get(request.UserId);
			if (getUserResponse.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("POST /user/history failed. Could not retrieve user with ID {0}. {1}", request.UserId, getUserResponse.Message);
				return InternalServerError(getUserResponse.Code, getUserResponse.Message);
			}

			var history = getUserResponse.Data.LastViewedRecipes.ToList();
			if (history.Count >= 10)
			{
				history.RemoveAt(10);
			}
			history.Insert(0, request.RecipeId);
			getUserResponse.Data.LastViewedRecipes = history;

			var response = _userRepository.Update(getUserResponse.Data);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("POST /user/history failed. Could not update user with ID {0}. {1}", request.UserId, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}
    }
}
