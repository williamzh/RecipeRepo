using System.IO;
using System.Web.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace RecipeRepo.Api.IO
{
	public class JsonFileReader
	{
		public virtual dynamic GetFileContents(string virtualPath)
		{
			using (StreamReader sr = File.OpenText(HostingEnvironment.MapPath(virtualPath)))
			using (var reader = new JsonTextReader(sr))
			{
				var serializer = new JsonSerializer();
				return serializer.Deserialize(reader);
			}
		}

		public virtual string GetFileContentsAsString(string virtualPath)
		{
			using (var file = File.OpenText(HostingEnvironment.MapPath(virtualPath)))
			using (var reader = new JsonTextReader(file))
			{
				var jsonObj = (JObject)JToken.ReadFrom(reader);
				return jsonObj.ToString(Formatting.None);
			}
		}
	}
}