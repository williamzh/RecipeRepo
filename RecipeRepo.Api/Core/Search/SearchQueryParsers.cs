using System.Web.Http;

namespace RecipeRepo.Api.Core.Search
{
	public static class SearchQueryParsers
	{
		public static ISearchQueryParser MetaQueryParser
		{
			get { return (MetaSearchQueryParser)GlobalConfiguration.Configuration.DependencyResolver.GetService(typeof(MetaSearchQueryParser)); }
		}

		public static ISearchQueryParser UserNameQueryParser
		{
			get { return (UserNameSearchQueryParser)GlobalConfiguration.Configuration.DependencyResolver.GetService(typeof(UserNameSearchQueryParser)); }
		}
	}
}