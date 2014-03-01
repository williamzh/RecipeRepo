using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MainApp.Models
{
	public enum UnitType
	{
		Metric,
		Imperial
	}

	public class Ingredient
	{
		public string Name { get; set; }
		public double Quantity { get; set; }
		public UnitType Unit { get; set; }
	}
}