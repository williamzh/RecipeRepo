using System.Web.Optimization;

namespace RecipeRepo.Web
{
	public static class BundleConfig
	{
		public static void RegisterBundles(BundleCollection bundles)
		{
			// CSS
			BundleTable.Bundles.Add(new StyleBundle("~/bundles/styles")
				.Include("~/Styles/main.css")
			);

			// Lib
			BundleTable.Bundles.Add(new ScriptBundle("~/bundles/scripts/lib")
				.Include("~/bower_components/jquery/dist/jquery.js")
				.Include("~/bower_components/jquery-ui/jquery-ui.js")
				.Include("~/bower_components/sugar/release/sugar-full.development.js")
				.Include("~/bower_components/angular/angular.js")
				.Include("~/bower_components/angular-ui-router/release/angular-ui-router.js")
				.Include("~/bower_components/ngstorage/ngStorage.js")
				.Include("~/bower_components/angular-uuid-generator/angular-uuid-generator.js")
				.Include("~/bower_components/angular-slugify/angular-slugify.js")
				.Include("~/bower_components/angular-ui-sortable/sortable.js")
				.Include("~/bower_components/ng-file-upload/ng-file-upload.js")
				.Include("~/bower_components/moment/min/moment-with-locales.js")
			);

			// App
			BundleTable.Bundles.Add(new ScriptBundle("~/bundles/scripts/app")
				.IncludeDirectory("~/Scripts/app", "*.js", true)
			);
		}
	}
}