using System.Collections.Generic;
using System.Linq;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;
using RecipeRepo.Integrations.Repositories;

namespace RecipeRepo.Api.Core.Search
{
	public class MappedSearchHandler<TEntity> where TEntity : IDbEntity
	{
		private readonly IDbRepository<TEntity> _repository;

		public MappedSearchHandler(IDbRepository<TEntity> repository)
		{
			_repository = repository;
		}

		public virtual IEnumerable<TEntity> ExecuteSearch(string query, string language)
		{
			var queryParsers = new[]
			{
				SearchQueryParsers.MetaQueryParser,
				SearchQueryParsers.UserNameQueryParser
			};

			var hits = new HashSet<IDbEntity>();

			foreach (var parser in queryParsers)
			{
				var searchConfig = parser.MapToFieldName(query, language);
				if (searchConfig != null)
				{
					var findResponse = _repository.Find(searchConfig.Item1, searchConfig.Item2, MatchingStrategy.Equals);
					if (findResponse.Code == AppStatusCode.Ok)
					{
						foreach (var d in findResponse.Data)
						{
							if (!hits.Contains(d))
							{
								hits.Add(d);
							}
						}
					}
				}
			}

			return hits.Cast<TEntity>().ToList();
		}
	}
}