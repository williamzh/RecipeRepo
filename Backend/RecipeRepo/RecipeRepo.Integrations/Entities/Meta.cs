using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RecipeRepo.Integrations.Entities
{
	public class Meta : IDbEntity
	{
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }

		public string Name { get; set; }
		public IEnumerable<string> Values { get; set; }
	}
}
