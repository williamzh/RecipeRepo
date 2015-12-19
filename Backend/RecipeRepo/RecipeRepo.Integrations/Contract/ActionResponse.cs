namespace RecipeRepo.Integrations.Contract
{
	public class ActionResponse
	{
		public bool IsSuccess { get; set; }
		public string Message { get; set; }
	}

	public class ActionResponse<TData> : ActionResponse
	{
		public TData Data { get; set; }
	}
}
