using System.Globalization;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MongoDB.Bson;
using MongoDB.Driver;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Db;
using RecipeRepo.Integrations.Entities;
using RecipeRepo.Integrations.Repositories;
using RecipeRepo.Integrations.Tests.Fakes;

namespace RecipeRepo.Integrations.Tests.Repositories
{
	[TestClass]
	public class DbRepositoryTest
	{
		private const string CollectionName = "items_test";

		private readonly IDbClient _dbClient = new DbClient();
		private DbRepository<DbEntityFake> _dbRepository;

		[ClassInitialize]
		public static void Initialize(TestContext context)
		{
			DbClient.Initialize();
		}

		[TestInitialize]
		public void SetUp()
		{
			_dbRepository = new DbRepository<DbEntityFake>(_dbClient)
			{
				CollectionName = CollectionName
			};

			var builder = Builders<DbEntityFake>.IndexKeys;
			var textIndex = builder.Text("Value");
			Collection.Indexes.CreateOne(textIndex, new CreateIndexOptions { DefaultLanguage = CultureInfo.CurrentCulture.TwoLetterISOLanguageName });
		}

		[TestCleanup]
		public void CleanUp()
		{
			_dbClient.GetCollection<BsonDocument>(CollectionName).DeleteMany(new BsonDocument());
			_dbClient.GetCollection<BsonDocument>(CollectionName).Indexes.DropAll();
		}

		private IMongoCollection<DbEntityFake> Collection { get { return _dbClient.GetCollection<DbEntityFake>(CollectionName); } }
			
		[TestMethod]
		public void Add()
		{
			// Act
			var response = _dbRepository.Add(new DbEntityFake { Value = "A" });
			var insertedItem = Collection.Find(new BsonDocument()).ToList()[0];

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && insertedItem.Value == "A");
		}

		[TestMethod]
		public void Get_NoMatchingItemExists_ReturnsNull()
		{
			// Act
			var response = _dbRepository.Get("566da43c41d18b0ff8291f2d");

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && response.Data == null);
		}

		[TestMethod]
		public void Get_MatchingItemExists_ReturnsItem()
		{
			// Arrange
			Collection.InsertOne(new DbEntityFake { Value = "A" });

			var insertedItem = Collection.Find(new BsonDocument()).ToList()[0];

			// Act
			var response = _dbRepository.Get(insertedItem.Id);

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && response.Data.Id == insertedItem.Id);
		}

		[TestMethod]
		public void Find_NoMatchingItemsExist_ReturnsEmptySequence()
		{
			// Arrange
			Collection.InsertMany(new [] { new DbEntityFake { Value = "Foo" } });

			// Act
			var response = _dbRepository.Find("Value", "Bar", MatchingStrategy.Equals);

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && !response.Data.Any());
		}

		[TestMethod]
		public void Find_InvalidFieldName_ReturnsEmptySequence()
		{
			// Arrange
			Collection.InsertMany(new[] { new DbEntityFake { Value = "Foo" } });

			// Act
			var response = _dbRepository.Find("x", "Foo", MatchingStrategy.Equals);

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && !response.Data.Any());
		}

		[TestMethod]
		public void Find_MatchingItemsExist_ReturnsHits()
		{
			// Arrange
			Collection.InsertMany(new[]
			{
				new DbEntityFake { Value = "A" },
				new DbEntityFake { Value = "B" },
				new DbEntityFake { Value = "A" },
				new DbEntityFake { Value = "B" }
			});

			// Act
			var response = _dbRepository.Find("Value", "A", MatchingStrategy.Equals);

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && response.Data.Count(i => i.Value == "A") == 2);
		}

		[TestMethod]
		public void Find_CustomLimitProvided_ReturnsLimitedHits()
		{
			// Arrange
			Collection.InsertMany(new[]
			{
				new DbEntityFake { Value = "A" },
				new DbEntityFake { Value = "B" },
				new DbEntityFake { Value = "A" },
				new DbEntityFake { Value = "B" }
			});

			// Act
			var response = _dbRepository.Find("Value", "A", MatchingStrategy.Equals, 1);

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && response.Data.Single(i => i.Value == "A") != null);
		}

		[TestMethod]
		public void Search_NoMatchingItemsExist_ReturnsEmptySequence()
		{
			// Arrange
			Collection.InsertMany(new[] { new DbEntityFake { Value = "Lasagne" } });

			// Act
			var response = _dbRepository.Search("Pasta");

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && !response.Data.Any());
		}

		[TestMethod]
		public void Search_MatchingItemsExist_ReturnsHits()
		{
			// Arrange
			Collection.InsertMany(new[]
			{
				new DbEntityFake { Value = "Pasta med ost och skinksås" },
				new DbEntityFake { Value = "Köttbullar med makaroner" },
				new DbEntityFake { Value = "Pastagratäng" }	// Note that this won't match due to "ihopskrivning"
			});

			// Act
			var response = _dbRepository.Search("pasta");

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && response.Data.Count() == 1);
		}

		[TestMethod]
		public void Update()
		{
			// Arrange
			Collection.InsertOne(new DbEntityFake { Value = "A" });

			var recipe = Collection.Find(Builders<DbEntityFake>.Filter.Empty).First();
			recipe.Value = "B";

			// Act
			var response = _dbRepository.Update(recipe);
			var updatedRecipe = Collection.Find(Builders<DbEntityFake>.Filter.Empty).First();

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && updatedRecipe.Value == "B");
		}

		[TestMethod]
		public void Remove()
		{
			// Arrange
			Collection.InsertOne(new DbEntityFake { Value = "A" });

			var addedRecipe = Collection.Find(Builders<DbEntityFake>.Filter.Empty).First();
			
			// Act
			var response = _dbRepository.Remove(addedRecipe.Id);
			var allRecipes = Collection.Find(Builders<DbEntityFake>.Filter.Empty);

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && !allRecipes.Any());
		}
	}
}
