using System;
using System.Configuration;
using log4net;
using MongoDB.Driver;

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

			var client = new MongoClient(dbUrl);
			_db = client.GetDatabase("reciperepo");
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
