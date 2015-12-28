using System.Collections.Generic;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;

namespace RecipeRepo.Api.Core
{
	public interface IUserManager
	{
		ActionResponse CreateUser(User user);
		ActionResponse<User> GetUser(string userId);
		ActionResponse UpdateUser(User user);
		ActionResponse DeleteUser(string userId);

		ActionResponse<IEnumerable<User>> FindUsersByUserName(string userName, int limit);

		ActionResponse<IEnumerable<Recipe>> GetUserHistory(string userId);
		ActionResponse UpdateUserHistory(string userId, string recipeId);

		ActionResponse SetFavoriteRecipe(string userId, string recipeId, bool isFavorite);
	}
}
