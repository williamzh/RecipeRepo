using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;

namespace RecipeRepo.Api.Security
{
	public interface IAuthService
	{
		ActionResponse<User> Authenticate(string userName, string password);
		ActionResponse<bool> IsAdmin(string userName);
	}
}
