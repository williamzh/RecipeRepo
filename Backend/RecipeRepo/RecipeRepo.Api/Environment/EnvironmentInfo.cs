using System.Web;
using System.Web.Hosting;

namespace RecipeRepo.Api.Environment
{
	public class EnvironmentInfo
	{
		public virtual string CurrentHost
		{
			get { return HttpContext.Current.Request.Url.Host; }
		}

		public string MapToPhysicalPath(string virtualPath)
		{
			return HostingEnvironment.MapPath(virtualPath);
		}

		public virtual string MapToUrl(string virtualPath)
		{
			return VirtualPathUtility.ToAbsolute(virtualPath);
		}
	}
}