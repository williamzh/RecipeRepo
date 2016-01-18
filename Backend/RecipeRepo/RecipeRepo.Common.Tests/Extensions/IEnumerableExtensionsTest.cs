using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using RecipeRepo.Common.Extensions;

namespace RecipeRepo.Common.Tests.Extensions
{
	[TestClass]
	public class IEnumerableExtensionsTest
	{
		private class TestClass
		{
			public string StrValue { get; set; }
			public int IntValue { get; set; }
		}

		[TestMethod]
		public void Union_SequencesContainDuplicateStringProperties_IncludesDistinctElementsOnly()
		{
			// Arrange
			var s1 = new[] { new TestClass { StrValue = "A" }, new TestClass { StrValue = "B" } };
			var s2 = new[] { new TestClass { StrValue = "B" }, new TestClass { StrValue = "C" } };

			// Act
			var result = s1.Union(s2, s => s.StrValue);

			// Assert
			Assert.IsTrue(result.Select(t => t.StrValue).SequenceEqual(new [] { "A", "B", "C" }));
		}

		[TestMethod]
		public void Union_SequencesContainDuplicateIntProperties_IncludesDistinctElementsOnly()
		{
			// Arrange
			var s1 = new[] { new TestClass { IntValue = 1 }, new TestClass { IntValue = 2 } };
			var s2 = new[] { new TestClass { IntValue = 2 }, new TestClass { IntValue = 3 } };

			// Act
			var result = s1.Union(s2, s => s.IntValue);

			// Assert
			Assert.IsTrue(result.Select(t => t.IntValue).SequenceEqual(new[] { 1, 2, 3 }));
		}

		[TestMethod]
		public void Union_SequencesDoNotContainDuplicates_IncludesAllElements()
		{
			// Arrange
			var s1 = new[] { new TestClass { StrValue = "A" }, new TestClass { StrValue = "B" } };
			var s2 = new[] { new TestClass { StrValue = "C" } };

			// Act
			var result = s1.Union(s2, s => s.StrValue);

			// Assert
			Assert.IsTrue(result.Select(t => t.StrValue).SequenceEqual(new[] { "A", "B", "C" }));
		}
	}
}
