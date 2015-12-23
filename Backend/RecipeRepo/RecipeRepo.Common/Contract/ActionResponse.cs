using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace RecipeRepo.Common.Contract
{
	public class ActionResponse
	{
		[JsonConverter(typeof(StringEnumConverter))]
		public AppStatusCode Code { get; set; }

		public string Message { get; set; }
	}

	public class ActionResponse<TData> : ActionResponse
	{
		public TData Data { get; set; }
	}
}
