namespace RecipeRepo.Api.Security
{
	public interface IClaimContext
	{
		string UserId { get; }
		string UserName { get; }
	}
}