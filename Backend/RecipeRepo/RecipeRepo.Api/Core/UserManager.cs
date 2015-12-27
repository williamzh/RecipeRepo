using System.Collections.Generic;
using System.Linq;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;
using RecipeRepo.Integrations.Repositories;

namespace RecipeRepo.Api.Core
{
	public class UserManager : IUserManager
	{
		private readonly IDbRepository<User> _userRepository;
		private readonly IDbRepository<Recipe> _recipeRepository;

		public UserManager(IDbRepository<User> userRepository, IDbRepository<Recipe> recipeRepository)
		{
			_userRepository = userRepository;
			_recipeRepository = recipeRepository;
		}

		public ActionResponse AddUser(User user)
		{
			var findUserResponse = _userRepository.Find("UserName", user.UserName, MatchingStrategy.Equals);
			if (findUserResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.EntityNotFound,
					Message = "Add failed. Failed to check for existing user."
				};
			}

			if (findUserResponse.Data != null)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.DuplicateExists,
					Message = "A user with the username " + user.UserName + " already exists."
				};
			}

			user.OwnedRecipes = new List<string>();
			user.LastViewedRecipes = new List<string>();
			user.FavoriteRecipes = new List<string>();
			user.Settings = new UserSettings { Language = "sv-SE" };

			return _userRepository.Add(user);
		}

		public ActionResponse<User> GetUser(string userId)
		{
			var response = _userRepository.Get(userId);
			if (response.Code == AppStatusCode.Ok)
			{
				response.Data.Password = null;
			}

			return response;
		}

		public ActionResponse UpdateUser(User user)
		{
			var getUserResponse = _userRepository.Get(user.Id);
			if (getUserResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.EntityNotFound,
					Message = "Update failed. Failed to check for existing user."
				};
			}

			if (getUserResponse.Data == null)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.EntityNotFound,
					Message = "Update failed. Could not find a user with a matching ID (" + user.Id + ")."
				};
			}

			// Make sure we don't overwrite fields that aren't updateable directly
			var existingUser = getUserResponse.Data;
			user.OwnedRecipes = existingUser.OwnedRecipes;	// Updated when adding recipe
			user.LastViewedRecipes = existingUser.LastViewedRecipes;	// Updated through history API
			user.FavoriteRecipes = existingUser.FavoriteRecipes;	// Updated through favorites API

			return _userRepository.Update(user);
		}

		public ActionResponse DeleteUser(string userId)
		{
			var getUserResponse = _userRepository.Get(userId);
			if (getUserResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.EntityNotFound,
					Message = "Delete failed. Failed to check for existing user."
				};
			}

			if (getUserResponse.Data == null)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.EntityNotFound,
					Message = "Delete failed. Could not find a user with a matching ID (" + userId + ")."
				};
			}

			return _userRepository.Remove(userId);
		}

		public ActionResponse<IEnumerable<User>> FindUsersByUserName(string userName, int limit)
		{
			var response = _userRepository.Find("UserName", userName, MatchingStrategy.Equals, limit == 0 ? 100 : limit);
			if (response.Code == AppStatusCode.Ok)
			{
				foreach (var user in response.Data)
				{
					user.Password = null;
				}
			}

			return response;
		}

		public ActionResponse<IEnumerable<Recipe>> GetUserHistory(string userId)
		{
			var response = _userRepository.Get(userId);
			if (response.Code != AppStatusCode.Ok)
			{
				return new ActionResponse<IEnumerable<Recipe>>
				{
					Code = response.Code,
					Message = response.Message
				};
			}

			var history = response.Data.LastViewedRecipes.Take(10);
			var viewedRecipes = _recipeRepository.Get(history).Data;

			return new ActionResponse<IEnumerable<Recipe>>
			{
				Code = AppStatusCode.Ok,
				Data = viewedRecipes.ToList()
			};
		}

		public ActionResponse UpdateUserHistory(string userId, string recipeId)
		{
			var getUserResponse = _userRepository.Get(userId);
			if (getUserResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse
				{
					Code = getUserResponse.Code,
					Message = getUserResponse.Message
				};
			}

			var history = getUserResponse.Data.LastViewedRecipes.ToList();
			if (history.Contains(recipeId))
			{
				// Don't do anything if item already exists in history
				return new ActionResponse { Code = AppStatusCode.Ok };
			}

			if (history.Count >= 10)
			{
				history.RemoveAt(10);
			}
			history.Insert(0, recipeId);
			getUserResponse.Data.LastViewedRecipes = history;

			return _userRepository.Update(getUserResponse.Data);
		}

		public ActionResponse SetFavoriteRecipe(string userId, string recipeId, bool isFavorite)
		{
			var getUserResponse = _userRepository.Get(userId);
			if (getUserResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse
				{
					Code = getUserResponse.Code,
					Message = getUserResponse.Message
				};
			}

			var favorites = getUserResponse.Data.FavoriteRecipes.ToList();
			if (isFavorite)
			{
				if (!favorites.Contains(recipeId))
				{
					favorites.Add(recipeId);
				}
			}
			else
			{
				if (favorites.Contains(recipeId))
				{
					favorites.Remove(recipeId);
				}
			}

			getUserResponse.Data.FavoriteRecipes = favorites;

			return _userRepository.Update(getUserResponse.Data);
		}
	}
}