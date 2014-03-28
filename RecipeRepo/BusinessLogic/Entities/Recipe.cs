using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BusinessLogic.Entities
{
	public class Recipe
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string ImagePath { get; set; }
		public string Description { get; set; }
		public int Rating { get; set; }
		public IEnumerable<Ingredient> Ingredients { get; set; }
		public IEnumerable<string> PreparationMethod { get; set; }
		public IEnumerable<Tag> Tags { get; set; }

		// TEMP
		public static ICollection<Recipe> Recipes
		{
			get
			{
				return new[]
				{
					new Recipe
					{
						Id = 1,
						Name = "Pasta Bolognese",
						Description = "En god pasta med morot och selleri",
						ImagePath = "~/Content/img/Brick and Mortar-Brick and Mortar-0003.jpg",
						Ingredients = new [] 
						{
 							new Ingredient { Name = "Köttfärs", Quantity = 500, Unit = new Unit(Metric.Gram) },
							new Ingredient { Name = "Krossade tomater", Quantity = 400, Unit = new Unit(Metric.Gram) }
						},
						PreparationMethod = new []
						{
							"Hacka löken och riv grönsakerna.",
							"Fräs ca 5 min i olivolja, tillsätt sedan färsen och bryn den.",
							"Tillsätt pressad vitlök samt de krossade tomaterna och tomatpurén.",
							"Lägg i buljongen och krydda med salt och peppar.",
							"Låt puttra i minst 20 min.",
							"Tillsätt basilika och oregano, smaka av.",
							"Koka upp pastan och rör ner den i såsen.",
							"Låt småputtra i ca 5 min till, servera."
						},
						Tags = new [] { new Tag(Category.Cuisine, "Italian"), new Tag(Category.CourseType, "Main"), new Tag(Category.MealType, "Dinner") }
					},
					new Recipe
					{
						Id = 2,
						Name = "Pasta Alfredo",
						Description = "En god och krämig rätt med kyckling",
						ImagePath = "",
						Ingredients = new [] 
						{
 							new Ingredient { Name = "Kycklingfilé", Quantity = 400, Unit = new Unit(Metric.Gram) },
							new Ingredient { Name = "Matlagningsgrädde", Quantity = 2, Unit = new Unit(Metric.Deciliter) }
						},
						Tags = new [] { new Tag(Category.Cuisine, "Italian"), new Tag(Category.CourseType, "Main"), new Tag(Category.MealType, "Dinner") }
					},
					new Recipe
					{
						Id = 3,
						Name = "Pastagratäng med kyckling",
						ImagePath = "",
						Description = "En god och krämig pastagratäng",
						Ingredients = new [] 
						{
 							new Ingredient { Name = "Köttfärs", Quantity = 500, Unit = new Unit(Metric.Gram) },
							new Ingredient { Name = "Krossade tomater", Quantity = 400, Unit = new Unit(Metric.Gram) }
						},
						Tags = new [] { new Tag(Category.Cuisine, "Swedish"), new Tag(Category.CourseType, "Main"), new Tag(Category.MealType, "Dinner") }
					},
					new Recipe
					{
						Id = 4,
						Name = "Chili con Carne",
						ImagePath = "",
						Description = "Mustig köttgryta med chili och bönor",
						Ingredients = new [] 
						{
 							new Ingredient { Name = "Köttfärs", Quantity = 500, Unit = new Unit(Metric.Gram) },
							new Ingredient { Name = "Krossade tomater", Quantity = 400, Unit = new Unit(Metric.Gram) }
						},
						Tags = new [] { new Tag(Category.Cuisine, "Mexican"), new Tag(Category.CourseType, "Main"), new Tag(Category.MealType, "Dinner") }
					},
					new Recipe
					{
						Id = 5,
						Name = "Korv Stroganoff",
						ImagePath = "",
						Description = "Enkel och snabblagad rätt med falukorv",
						Ingredients = new [] 
						{
 							new Ingredient { Name = "Falukorv", Quantity = 400, Unit = new Unit(Metric.Gram) },
							new Ingredient { Name = "Krossade tomater", Quantity = 400, Unit = new Unit(Metric.Gram) }
						},
						Tags = new [] { new Tag(Category.Cuisine, "Swedish"), new Tag(Category.CourseType, "Main"), new Tag(Category.MealType, "Dinner") }
					}
				};
			}
		}
	}
}