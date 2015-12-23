namespace RecipeRepo.Common.Contract
{
	public enum AppStatusCode
	{
		Ok = 0,

		// 1xx: Input errors
		InvalidInput = 100,

		// 2xx: Transaction errors
		DuplicateExists = 200,
		EntityNotFound = 201,
		Unsupported = 202,

		// 3xx: Security errors
		Unauthorized = 300,
		InvalidCredentials = 301,

		// 4xx: General errors
		UnknownError = 400
	}
}
