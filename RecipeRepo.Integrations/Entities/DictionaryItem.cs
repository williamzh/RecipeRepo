using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RecipeRepo.Integrations.Entities
{
	public class DictionaryItem<TData> : IDbEntity
	{
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }

		public string Key { get; set; }
		public TData Value { get; set; }
	}
}
