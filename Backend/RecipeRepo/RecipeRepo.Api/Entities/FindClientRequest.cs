using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using RecipeRepo.Integrations.Entities;

namespace RecipeRepo.Api.Entities
{
	public class FindClientRequest
	{
		public string FieldName { get; set; }
		public dynamic Value { get; set; }

		[JsonConverter(typeof(StringEnumConverter))]
		public MatchingStrategy	Strategy { get; set; }
		
		public int Limit { get; set; }
	}
}