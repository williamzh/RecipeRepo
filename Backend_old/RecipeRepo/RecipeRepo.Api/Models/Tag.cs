using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RecipeRepo.Api.Models
{
	public enum Category
	{
		MealType,
		CourseType,
		Cuisine,
		Occasion
	}

	public class Tag
	{
		public Tag() { }

		public Tag(Category category, string value)
		{
			Category = category;
			Value = value;
		}

		public Category Category { get; set; }
		public string Value { get; set; }
	}
}