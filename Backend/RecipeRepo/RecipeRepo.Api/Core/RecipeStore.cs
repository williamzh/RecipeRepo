using System;
using System.Collections.Generic;
using System.Linq;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;
using RecipeRepo.Integrations.Repositories;

namespace RecipeRepo.Api.Core
{
	public class RecipeStore : IRecipeStore
	{
		private readonly IDbRepository<Recipe> _recipeRepository;
		private readonly IDbRepository<User> _userRepository;

		public RecipeStore(IDbRepository<Recipe> recipeRepository, IDbRepository<User> userRepository)
		{
			_recipeRepository = recipeRepository;
			_userRepository = userRepository;
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

			// Verfiy that recipe doesn't already exist
			var getRecipeResponse = _recipeRepository.Find("Name", recipe.Name, MatchingStrategy.Equals);
			if (getRecipeResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse
				{
					Code = getRecipeResponse.Code,
					Message = "Could not add recipe - recipe retrieval failed. Underlying error: " + getUserResponse.Message
				};
			}

			if (getRecipeResponse.Data != null && getRecipeResponse.Data.Any())
			{
				return new ActionResponse
				{
					Code = AppStatusCode.DuplicateExists,
					Message = "A recipe with the name " + recipe.Name + " already exists."
				};
			}

			// Add recipe
			recipe.Meta.Created = DateTime.Now;
			recipe.Meta.LastEdited = DateTime.Now;

			var addRecipeResponse = _recipeRepository.Add(recipe);
			if (addRecipeResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse
				{
					Code = addRecipeResponse.Code,
					Message = addRecipeResponse.Message
				};
			}

			// Associate added recipe with the specified user
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

		public ActionResponse DeleteRecipe(string recipeId)
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

			return _recipeRepository.Remove(recipeId);
		}

		public ActionResponse<IEnumerable<Recipe>> FindRecipes<TValue>(string fieldName, TValue value, MatchingStrategy strategy, int limit = 100)
		{
			return _recipeRepository.Find(fieldName, value, strategy, limit);
		}

		public ActionResponse<IEnumerable<Recipe>> Search(string query, int limit = 100)
		{
			return _recipeRepository.Search(query, limit);
		}
	}
}