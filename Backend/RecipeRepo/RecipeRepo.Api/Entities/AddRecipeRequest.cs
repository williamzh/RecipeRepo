using RecipeRepo.Integrations.Entities;

namespace RecipeRepo.Api.Entities
{
	public class AddRecipeRequest
	{
		public Recipe Recipe { get; set; }
		public string UserId { get; set; }
	}
}