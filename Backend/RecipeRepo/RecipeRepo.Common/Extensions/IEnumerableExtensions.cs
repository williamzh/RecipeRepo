using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace RecipeRepo.Common.Extensions
{
	public static class IEnumerableExtensions
	{
		public static IEnumerable<TSource> Union<TSource, TValue>(this IEnumerable<TSource> source, IEnumerable<TSource> dest, Expression<Func<TSource, TValue>> keySelector)
		{
			return source.Union(dest, new CustomKeyComparer<TSource, TValue>(keySelector));
		}

		private class CustomKeyComparer<TSource, TValue> : IEqualityComparer<TSource>
		{
			private readonly Expression<Func<TSource, TValue>> _keySelector;

			public CustomKeyComparer(Expression<Func<TSource, TValue>> keySelector)
			{
				_keySelector = keySelector;
			}

			public bool Equals(TSource x, TSource y)
			{
				var body = _keySelector.Body as MemberExpression;

				if (body == null)
				{
					var ubody = (UnaryExpression)_keySelector.Body;
					body = (MemberExpression)ubody.Operand;
				}

				var key = body.Member.Name;

				var valueX = x.GetType().GetProperty(key).GetValue(x, null);
				var valueY = y.GetType().GetProperty(key).GetValue(y, null);

				return valueX.Equals(valueY);
			}

			public int GetHashCode(TSource obj)
			{
				return 1;	// Force Equals execution
			}
		}
	}
}