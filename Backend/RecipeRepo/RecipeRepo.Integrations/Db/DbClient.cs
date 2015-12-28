using System;
using System.Configuration;
using System.Globalization;
using log4net;
using MongoDB.Driver;
using RecipeRepo.Integrations.Entities;

namespace RecipeRepo.Integrations.Db
{
	public class DbClient : IDbClient
	{
		private static IMongoDatabase _db;
		private readonly ILog _log;

		public DbClient()
		{
			_log = LogManager.GetLogger(typeof (DbClient));
		}

		public static void Initialize(string dbUrl = null)
		{
			dbUrl = dbUrl ?? ConfigurationManager.AppSettings["MongoDbUrl"];
			if (dbUrl == null)
			{
				throw new InvalidOperationException("Cannot initialize database. No MongoDB connection string has been defined in the AppSettings.");
			}

			var dbName = dbUrl.Substring(dbUrl.LastIndexOf('/') + 1);
			var client = new MongoClient(dbUrl);
			_db = client.GetDatabase(dbName);
		}

		public static void BuildIndices()
		{
			// Recipe indices
			var recipeIndexBuilder = Builders<Recipe>.IndexKeys;
			_db.GetCollection<Recipe>("recipes").Indexes.CreateMany(new []
			{
				new CreateIndexModel<Recipe>(recipeIndexBuilder.Text(r => r.Name).Text("Ingredients.Name"), new CreateIndexOptions { DefaultLanguage = CultureInfo.CurrentCulture.TwoLetterISOLanguageName }),
				new CreateIndexModel<Recipe>(recipeIndexBuilder.Descending("Meta.Rating")),
				new CreateIndexModel<Recipe>(recipeIndexBuilder.Descending("Meta.Created"))
			});

			// User indices
			var userIndexBuilder = Builders<User>.IndexKeys;
			_db.GetCollection<User>("users").Indexes.CreateMany(new[]
			{
				new CreateIndexModel<User>(userIndexBuilder.Descending(u => u.UserName))
			});
		}

		public virtual IMongoCollection<T> GetCollection<T>(string collectionName)
		{
			if (_db == null)
			{
				_log.Warn("Database was null. Reinitializing...");

				try
				{
					Initialize();
				}
				catch (Exception ex)
				{
					_log.Fatal("Database initalization failed.", ex);
					return null;
				}
			}

			return _db.GetCollection<T>(collectionName);
		}
	}
}
