using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using log4net;
using MongoDB.Driver;
using RecipeRepo.Integrations.Entities;

namespace RecipeRepo.Integrations.Db
{
	public class DbClient : IDbClient
	{
		private static IMongoDatabase _db;
		private static readonly ILog Log = LogManager.GetLogger(typeof (DbClient));

		public static void Initialize()
		{
			Connect();
			BuildIndices();
		}

		public virtual IMongoCollection<T> GetCollection<T>(string collectionName)
		{
			if (_db == null)
			{
				Log.Warn("Database was null. Reinitializing...");

				try
				{
					Connect();
				}
				catch (Exception ex)
				{
					Log.Fatal("Database initalization failed.", ex);
					return null;
				}
			}

			return _db.GetCollection<T>(collectionName);
		}

		private static void Connect()
		{
			var dbUrl = ConfigurationManager.AppSettings["MongoDbUrl"];
			if (dbUrl == null)
			{
				throw new InvalidOperationException("Cannot initialize database. No MongoDB connection string has been defined in the AppSettings.");
			}

			var dbName = dbUrl.Substring(dbUrl.LastIndexOf('/') + 1);
			var client = new MongoClient(dbUrl);
			_db = client.GetDatabase(dbName);

			Log.Debug("Successfully connected to database  " + dbUrl + ".");
		}

		private static void BuildIndices()
		{
			// Recipe indices
			var recipeCollection = _db.GetCollection<Recipe>("recipe");
			var recipeIndexBuilder = Builders<Recipe>.IndexKeys;

			CreateIndices(recipeCollection,
				new CreateIndexModel<Recipe>(recipeIndexBuilder.Text(r => r.Name), new CreateIndexOptions
				{
					Name = "Recipe_Name_Text",
					DefaultLanguage = CultureInfo.CurrentCulture.TwoLetterISOLanguageName
				}),
				new CreateIndexModel<Recipe>(recipeIndexBuilder.Descending("Meta.Category"), new CreateIndexOptions
				{
					Name = "Recipe_Category_Desc",
				}),
				new CreateIndexModel<Recipe>(recipeIndexBuilder.Descending("Meta.Cuisine"), new CreateIndexOptions
				{
					Name = "Recipe_Cuisine_Desc",
				}),
				new CreateIndexModel<Recipe>(recipeIndexBuilder.Descending("Meta.Course"), new CreateIndexOptions
				{
					Name = "Recipe_Course_Desc",
				}),
				new CreateIndexModel<Recipe>(recipeIndexBuilder.Descending("Meta.Rating"), new CreateIndexOptions
				{
					Name = "Recipe_Rating_Desc",
				}),
				new CreateIndexModel<Recipe>(recipeIndexBuilder.Descending("Meta.Created"), new CreateIndexOptions
				{
					Name = "Recipe_Created_Desc",
				}),
				new CreateIndexModel<Recipe>(recipeIndexBuilder.Descending("Meta.Owner"), new CreateIndexOptions
				{
					Name = "Recipe_Owner_Desc",
				})
			);

			// User indices
			var userCollection = _db.GetCollection<User>("user");
			var userIndexBuilder = Builders<User>.IndexKeys;

			CreateIndices(userCollection,
				new CreateIndexModel<User>(userIndexBuilder.Descending(u => u.UserName), new CreateIndexOptions
				{
					Name = "User_Username_Desc"
				})
			);

			Log.Debug("Index initialization complete.");
		}

		private static async void CreateIndices<T>(IMongoCollection<T> collection, params CreateIndexModel<T>[] indexDefinitions)
		{
			var newIndices = new List<CreateIndexModel<T>>();

			var existingIndices = collection.Indexes.List().ToList()
				.Select(d => d.Elements.First(e => e.Name == "name").Value)	// Get the index "name" field for each document
				.Where(i => i != "_id")	// Filter out the default "_id" index on the projected indices
				.ToList();

			Log.Debug("Found indices " + string.Join(",", existingIndices) + ".");

			foreach (var def in indexDefinitions)
			{
				if (!existingIndices.Contains(def.Options.Name))
				{
					Log.Debug("Adding new index " + def.Options.Name + ".");
					newIndices.Add(def);
				}
			}

			if (newIndices.Any())
			{
				await collection.Indexes.CreateManyAsync(newIndices);
			}
		}
	}
}
