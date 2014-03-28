using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BusinessLogic.Entities
{
	public enum Metric
	{
		// Volume
		Pinch,
		Teaspoon,
		Tablespoon,
		Deciliter,
		// Weight
		Gram,
		Hectogram,
		Kilogram
	}

	public class Unit
	{
		public Metric Type { get; set; }

		private static IDictionary<Metric, string> _labels = new Dictionary<Metric, string>()
		{
			{ Metric.Pinch, "krm" },
			{ Metric.Teaspoon, "tsk" },
			{ Metric.Tablespoon, "msk" },
			{ Metric.Deciliter, "dl" },
			{ Metric.Gram, "g" },
			{ Metric.Hectogram, "hg" },
			{ Metric.Kilogram, "kg" }
		};

		public Unit(Metric type)
		{
			Type = type;
		}

		public override string ToString()
		{
			return _labels[Type];
		}
	}

	public class Ingredient
	{
		public string Name { get; set; }
		public double Quantity { get; set; }
		public Unit Unit { get; set; }
	}
}