using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RecipeRepo.Integrations.Entities
{
	public class User
	{
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }

		public string UserName { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Email { get; set; }
		public string Password { get; set; }
		public ICollection<int> OwnedRecipes { get; set; }
		public ICollection<int> FavoriteRecipes { get; set; }
		public ICollection<int> LastViewedRecipes { get; set; }
		public UserSettings Settings { get; set; }
	}
}
