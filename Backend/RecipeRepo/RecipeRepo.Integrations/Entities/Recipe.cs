using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RecipeRepo.Integrations.Entities
{
	public class Recipe : IDbEntity
	{
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }

		public string Name { get; set; }
		public string Description { get; set; }
		public string ImageUrl { get; set; }
		public bool IsPrivate { get; set; }
		public ICollection<Ingredient> Ingredients { get; set; }
		public ICollection<string> Steps { get; set; }
		public MetaInfo Meta { get; set; }
	}
}
