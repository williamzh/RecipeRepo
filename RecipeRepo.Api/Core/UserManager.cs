﻿using System.Collections.Generic;
using System.Linq;
using RecipeRepo.Api.Localization;
using RecipeRepo.Api.Security;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;
using RecipeRepo.Integrations.Repositories;

namespace RecipeRepo.Api.Core
{
	public class UserManager : IUserManager
	{
		private readonly IDbRepository<User> _userRepository;
		private readonly IDbRepository<Recipe> _recipeRepository;
		private readonly ITranslator _translator;
		private readonly IClaimContext _claimContext;

		public UserManager(IDbRepository<User> userRepository, IDbRepository<Recipe> recipeRepository, ITranslator translator, IClaimContext claimContext)
		{
			_userRepository = userRepository;
			_recipeRepository = recipeRepository;
			_translator = translator;
			_claimContext = claimContext;
		}

		public ActionResponse CreateUser(User user)
		{
			var findUserResponse = _userRepository.Find("UserName", user.UserName, MatchingStrategy.Equals);
			if (findUserResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse
				{
					Code = findUserResponse.Code,
					Message = "Could not create user - existance check failed. Underlying error: " + findUserResponse.Message,
					UserMessage = _translator.Translate("global", "generalErrorMessage", _claimContext.UserLanguage)
				};
			}

			if (findUserResponse.Data != null && findUserResponse.Data.Any())
			{
				return new ActionResponse
				{
					Code = AppStatusCode.DuplicateExists,
					Message = "A user with the username " + user.UserName + " already exists.",
					UserMessage = _translator.Translate("profile", "duplicateUserError", _claimContext.UserLanguage)
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
			return _userRepository.Get(userId);
		}

		public ActionResponse<User> GetUserByUserName(string userName)
		{
			var response = _userRepository.Find("UserName", userName, MatchingStrategy.Equals, 1);
			if (response.Code != AppStatusCode.Ok)
			{
				return new ActionResponse<User>
				{
					Code = response.Code,
					Message = response.Message,
					UserMessage = _translator.Translate("global", "generalErrorMessage", _claimContext.UserLanguage)
				};
			}

			return new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = response.Data.FirstOrDefault()
			};
		}

		public ActionResponse UpdateUser(User user)
		{
			var getUserResponse = _userRepository.Get(user.Id);
			if (getUserResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse
				{
					Code = getUserResponse.Code,
					Message = "Could not update user - existance check failed. Underlying error: " + getUserResponse.Message,
					UserMessage = _translator.Translate("global", "generalErrorMessage", _claimContext.UserLanguage)
				};
			}

			if (getUserResponse.Data == null)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.EntityNotFound,
					Message = "Update failed. Could not find a user with a matching ID (" + user.Id + ").",
					UserMessage = _translator.Translate("global", "generalErrorMessage", _claimContext.UserLanguage)
				};
			}

			// Make sure we don't overwrite fields that aren't updateable directly
			var existingUser = getUserResponse.Data;
			user.UserName = existingUser.UserName;		// Username isn't editable
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
					Code = getUserResponse.Code,
					Message = "Could not delete user - existance check failed. Underlying error: " + getUserResponse.Message,
					UserMessage = _translator.Translate("global", "generalErrorMessage", _claimContext.UserLanguage)
				};
			}

			if (getUserResponse.Data == null)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.EntityNotFound,
					Message = "Delete failed. Could not find a user with a matching ID (" + userId + ").",
					UserMessage = _translator.Translate("global", "generalErrorMessage", _claimContext.UserLanguage)
				};
			}

			return _userRepository.Remove(userId);
		}

		public ActionResponse<IEnumerable<Recipe>> GetUserHistory(string userId)
		{
			var userResponse = _userRepository.Get(userId);
			if (userResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse<IEnumerable<Recipe>>
				{
					Code = userResponse.Code,
					Message = userResponse.Message,
					UserMessage = _translator.Translate("global", "generalErrorMessage", _claimContext.UserLanguage)
				};
			}
			var user = userResponse.Data;

			if (user == null)
			{
				return new ActionResponse<IEnumerable<Recipe>>
				{
					Code = AppStatusCode.EntityNotFound,
					Message = "Failed to get user history. Could not find a user with a matching ID (" + userId + ").",
					UserMessage = _translator.Translate("global", "generalErrorMessage", _claimContext.UserLanguage)
				};
			}

			var history = user.LastViewedRecipes.Take(10).ToList();
			var recipesResponse = _recipeRepository.Get(history);
			if (recipesResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse<IEnumerable<Recipe>>
				{
					Code = recipesResponse.Code,
					Message = recipesResponse.Message,
					UserMessage = _translator.Translate("global", "generalErrorMessage", _claimContext.UserLanguage)
				};
			}
			//var recipes = recipesResponse.Data;

			// Remove history items that point to invalid recipes.
			// TODO: create a purge task that purges all recipe references instead
			//history.RemoveAll(h => !recipes.Any(r => r.Id == h));

			//user.LastViewedRecipes = history;
			//_userRepository.Update(user);

			return new ActionResponse<IEnumerable<Recipe>>
			{
				Code = AppStatusCode.Ok,
				Data = recipesResponse.Data,
				UserMessage = _translator.Translate("global", "generalErrorMessage", _claimContext.UserLanguage)
			};
		}

		public ActionResponse AddUserHistory(string userId, string recipeId)
		{
			var getUserResponse = _userRepository.Get(userId);
			if (getUserResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse
				{
					Code = getUserResponse.Code,
					Message = getUserResponse.Message,
					UserMessage = _translator.Translate("global", "generalErrorMessage", _claimContext.UserLanguage)
				};
			}

			var history = getUserResponse.Data.LastViewedRecipes.ToList();
			if (history.Contains(recipeId))
			{
				// If the recipe is already present in the history, remove it so it can
				// be re-added at the top.
				history.Remove(recipeId);
			}
			else if (history.Count >= 10)
			{
				// If the recipe isn't present in the history and the history is full,
				// remove the oldest history item.
				history.RemoveAt(history.Count - 1);
			}

			history.Insert(0, recipeId);
			getUserResponse.Data.LastViewedRecipes = history;

			return _userRepository.Update(getUserResponse.Data);
		}

		public ActionResponse RemoveUserHistory(string userId, string recipeId)
		{
			var getUserResponse = _userRepository.Get(userId);
			if (getUserResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse
				{
					Code = getUserResponse.Code,
					Message = getUserResponse.Message,
					UserMessage = _translator.Translate("global", "generalErrorMessage", _claimContext.UserLanguage)
				};
			}

			var history = getUserResponse.Data.LastViewedRecipes.ToList();
			history.Remove(recipeId);
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
					Message = getUserResponse.Message,
					UserMessage = _translator.Translate("global", "generalErrorMessage", _claimContext.UserLanguage)
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

		public ActionResponse Purge(string userId)
		{
			var userResponse = _userRepository.Get(userId);
			if (userResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse<IEnumerable<Recipe>>
				{
					Code = userResponse.Code,
					Message = userResponse.Message,
					UserMessage = _translator.Translate("global", "generalErrorMessage", _claimContext.UserLanguage)
				};
			}
			var user = userResponse.Data;

			if (user == null)
			{
				return new ActionResponse<IEnumerable<Recipe>>
				{
					Code = AppStatusCode.EntityNotFound,
					Message = "Failed to get user history. Could not find a user with a matching ID (" + userId + ").",
					UserMessage = _translator.Translate("global", "generalErrorMessage", _claimContext.UserLanguage)
				};
			}

			var favorites = user.FavoriteRecipes.ToList();
			var history = user.LastViewedRecipes.ToList();

			var combined = favorites.Union(history).Distinct();

			var recipesResponse = _recipeRepository.Get(combined);
			if (recipesResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse<IEnumerable<Recipe>>
				{
					Code = recipesResponse.Code,
					Message = recipesResponse.Message,
					UserMessage = _translator.Translate("global", "generalErrorMessage", _claimContext.UserLanguage)
				};
			}

			var recipes = recipesResponse.Data;

			favorites.RemoveAll(f => !recipes.Any(r => r.Id == f));
			history.RemoveAll(h => !recipes.Any(r => r.Id == h));

			if (user.FavoriteRecipes.SequenceEqual(favorites) && user.LastViewedRecipes.SequenceEqual(history))
			{
				return new ActionResponse { Code = AppStatusCode.Ok };
			}

			user.FavoriteRecipes = favorites;
			user.LastViewedRecipes = history;
			
			var updateUserResponse = _userRepository.Update(user);
			if (updateUserResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse<IEnumerable<Recipe>>
				{
					Code = updateUserResponse.Code,
					Message = updateUserResponse.Message,
					UserMessage = _translator.Translate("global", "generalErrorMessage", _claimContext.UserLanguage)
				};
			}
			
			return new ActionResponse { Code = AppStatusCode.Ok };
		}
	}
}