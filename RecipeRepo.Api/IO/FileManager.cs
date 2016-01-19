using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Hosting;

namespace RecipeRepo.Api.IO
{
	public class FileManager : IFileManager
	{
		public IEnumerable<string> GetFilesInDirectory(string virtualPath, bool recurse)
		{
			var actualPath = HostingEnvironment.MapPath(virtualPath);
			if (actualPath == null)
			{
				return new List<string>();
			}

			var absolutePaths = Directory.GetFiles(actualPath, "*", recurse ? SearchOption.AllDirectories : SearchOption.TopDirectoryOnly);

			return absolutePaths.Select(p => p.Substring(p.LastIndexOf('\\') + 1));
		}
	}
}