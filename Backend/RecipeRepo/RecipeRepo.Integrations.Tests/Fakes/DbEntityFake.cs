using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using RecipeRepo.Integrations.Entities;

namespace RecipeRepo.Integrations.Tests.Fakes
{
	public class DbEntityFake : IDbEntity
	{
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }

		public string Value { get; set; }
	}
}
