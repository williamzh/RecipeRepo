using System;

namespace RecipeRepo.Integrations.Entities
{
	public class MetaInfo
	{
		public string Owner { get; set; }
		public string Cuisine { get; set; }
		public string Category { get; set; }
		public string Course { get; set; }
		public int LikeCount { get; set; }
		public int DislikeCount { get; set; }
		public double RelativeScore { get; set; }
		public int Servings { get; set; }
		public DateTime Created { get; set; }
		public DateTime LastEdited { get; set; }
	}
}
