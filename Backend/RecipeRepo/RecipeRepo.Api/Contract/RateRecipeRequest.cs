namespace RecipeRepo.Api.Contract
{
	public class RateRecipeRequest
	{
		public string RecipeId { get; set; }
		public bool IsUpVote { get; set; }
	}
}