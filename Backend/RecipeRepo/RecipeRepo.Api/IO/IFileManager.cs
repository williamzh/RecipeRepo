using System.Collections.Generic;

namespace RecipeRepo.Api.IO
{
	public interface IFileManager
	{
		IEnumerable<string> GetFilesInDirectory(string virtualPath, bool recurse);
	}
}
