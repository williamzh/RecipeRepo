using System;
using System.Collections.Generic;
using RecipeRepo.Api.Core.Search;
using RecipeRepo.Common.Contract;
using RecipeRepo.Common.Extensions;
using RecipeRepo.Integrations.Entities;
using RecipeRepo.Integrations.Repositories;

namespace RecipeRepo.Api.Core
{
	public class RecipeStore : IRecipeStore
	{
		private readonly IDbRepository<Recipe> _recipeRepository;
		private readonly IDbRepository<User> _userRepository;
		private readonly MappedSearchHandler<Recipe> _mappedSearchHandler;

		public RecipeStore(IDbRepository<Recipe> recipeRepository, IDbRepository<User> userRepository, MappedSearchHandler<Recipe> mappedSearchHandler)
		{
			_recipeRepository = recipeRepository;
			_userRepository = userRepository;
			_mappedSearchHandler = mappedSearchHandler;
		}

		public ActionResponse AddRecipe(string userId, Recipe recipe)
		{
			// Verify that user exists
			var getUserResponse = _userRepository.Get(userId);
			if (getUserResponse.Code != AppStatusCode.Ok || getUserResponse.Data == null)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.EntityNotFound,
					Message = "Could not add recipe - failed to get user " + userId + ". Underlying error: " + getUserResponse.Message
				};
			}

			// Set default meta info
			recipe.Meta.Created = DateTime.Now;
			recipe.Meta.LastEdited = DateTime.Now;
			recipe.Meta.Owner = getUserResponse.Data.UserName;
			
			var addRecipeResponse = _recipeRepository.Add(recipe);
			if (addRecipeResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse
				{
					Code = addRecipeResponse.Code,
					Message = addRecipeResponse.Message
				};
			}

			// Add to user's list of owned recipes
			var user = getUserResponse.Data;
			user.OwnedRecipes.Add(recipe.Id);

			var updateUserResponse = _userRepository.Update(user);
			if (updateUserResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse
				{
					Code = updateUserResponse.Code,
					Message = "Could not add recipe - failed to associate new recipe with user."
				};
			}

			return new ActionResponse { Code = AppStatusCode.Ok };
		}

		public ActionResponse<Recipe> GetRecipe(string recipeId)
		{
			return _recipeRepository.Get(recipeId);
		}

		public ActionResponse<IEnumerable<Recipe>> GetRecipes(IEnumerable<string> recipeIds)
		{
			return _recipeRepository.Get(recipeIds);
		}

		public ActionResponse UpdateRecipe(Recipe recipe)
		{
			var getRecipeResponse = _recipeRepository.Get(recipe.Id);
			if (getRecipeResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse
				{
					Code = getRecipeResponse.Code,
					Message = "Could not update recipe - existance check failed. Underlying error: " + getRecipeResponse.Message
				};
			}

			if (getRecipeResponse.Data == null)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.EntityNotFound,
					Message = "Update failed. Could not find a recipe with a matching ID (" + recipe.Id + ")."
				};
			}

			return _recipeRepository.Update(recipe);
		}

		public ActionResponse DeleteRecipe(string userId, string recipeId)
		{
			var getRecipeResponse = _recipeRepository.Get(recipeId);
			if (getRecipeResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse
				{
					Code = getRecipeResponse.Code,
					Message = "Could not delete recipe - existance check failed. Underlying error: " + getRecipeResponse.Message
				};
			}

			if (getRecipeResponse.Data == null)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.EntityNotFound,
					Message = "Delete failed. Could not find a recipe with a matching ID (" + recipeId + ")."
				};
			}

			var getUserResponse = _userRepository.Get(userId);
			if (getUserResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse
				{
					Code = getRecipeResponse.Code,
					Message = "Could not delete recipe - Could not obtain owner. Underlying error: " + getRecipeResponse.Message
				};
			}

			var owner = getUserResponse.Data;
			owner.OwnedRecipes.Remove(recipeId);
			_userRepository.Update(owner);

			return _recipeRepository.Remove(recipeId);
		}

		public ActionResponse<IEnumerable<Recipe>> FindRecipes<TValue>(string fieldName, TValue value, MatchingStrategy strategy, int limit = 100)
		{
			return _recipeRepository.Find(fieldName, value, strategy, limit);
		}

		public ActionResponse<IEnumerable<Recipe>> Search(string query, string userLang, int limit = 100)
		{
			var response = new ActionResponse<IEnumerable<Recipe>>
			{
				Code = AppStatusCode.Ok
			};

			var mappedHits = _mappedSearchHandler.ExecuteSearch(query, userLang);
			response.Data = mappedHits;

			var searchResponse = _recipeRepository.Search(query, limit);
			if (searchResponse.Code != AppStatusCode.Ok)
			{
				response.Code = searchResponse.Code;
				response.Message = searchResponse.Message;
				return response;
			}

			response.Data = response.Data.Union(searchResponse.Data, r => r.Id);
			return response;
		}
	}
}