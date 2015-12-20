using System;

namespace RecipeRepo.Integrations.Entities
{
	public class MetaInfo
	{
		public string Cuisine { get; set; }
		public string Category { get; set; }
		public string Course { get; set; }
		public double Rating { get; set; }
		public int Servings { get; set; }
		public DateTime Created { get; set; }
		public DateTime LastEdited { get; set; }
		public DateTime LastViewed { get; set; }
	}
}
