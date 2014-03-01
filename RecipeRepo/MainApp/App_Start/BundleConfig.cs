using System.Web;
using System.Web.Optimization;

namespace MainApp
{
	public class BundleConfig
	{
		// For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
						"~/Scripts/lib/jquery-{version}.js"));

			bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
						"~/Scripts/lib/bootstrap.js"));

			bundles.Add(new StyleBundle("~/Content/css").Include(
				"~/Content/css/bootstrap.css",
				"~/Content/css/bootstrap-theme.css",
				"~/Content/css/one-page-wonder.css",
				"~/Content/css/shop-homepage.css",
				"~/Content/css/3-col-portfolio.css"
			));
		}
	}
}