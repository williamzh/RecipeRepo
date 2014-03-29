using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RecipeRepo.Api.Models
{
	public class Ingredient
	{
		public string Name { get; set; }
		public double Quantity { get; set; }
		public Unit Unit { get; set; }
	}
}