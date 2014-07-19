using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RecipeRepo.Api.Models
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
}