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

			Log.Debug("Successfully connected to database  " + dbUrl + ".");
		}

		public static void BuildIndices()
		{
			// Recipe indices
			var recipeCollection = _db.GetCollection<Recipe>("recipes");
			var recipeIndexBuilder = Builders<Recipe>.IndexKeys;

			CreateIndices(recipeCollection,
				new CreateIndexModel<Recipe>(recipeIndexBuilder.Text(r => r.Name).Text("Ingredients.Name"), new CreateIndexOptions
				{
					Name = "Recipe_Compound_Text",
					DefaultLanguage = CultureInfo.CurrentCulture.TwoLetterISOLanguageName
				}),
				new CreateIndexModel<Recipe>(recipeIndexBuilder.Descending("Meta.Rating"), new CreateIndexOptions
				{
					Name = "Recipe_Rating_Desc",
				}),
				new CreateIndexModel<Recipe>(recipeIndexBuilder.Descending("Meta.Created"), new CreateIndexOptions
				{
					Name = "Recipe_Created_Desc",
				})
				);

			// User indices
			var userCollection = _db.GetCollection<User>("users");
			var userIndexBuilder = Builders<User>.IndexKeys;

			CreateIndices(userCollection,
				new CreateIndexModel<User>(userIndexBuilder.Descending(u => u.UserName), new CreateIndexOptions
				{
					Name = "User_Username_Desc"
				})
			);

			Log.Debug("Index initialization complete");
		}

		public virtual IMongoCollection<T> GetCollection<T>(string collectionName)
		{
			if (_db == null)
			{
				Log.Warn("Database was null. Reinitializing...");

				try
				{
					Initialize();
				}
				catch (Exception ex)
				{
					Log.Fatal("Database initalization failed.", ex);
					return null;
				}
			}

			return _db.GetCollection<T>(collectionName);
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
