using System.Globalization;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MongoDB.Bson;
using MongoDB.Driver;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Db;
using RecipeRepo.Integrations.Entities;
using RecipeRepo.Integrations.Repositories;

namespace RecipeRepo.Integrations.Tests.Repositories
{
	[TestClass]
	public class RecipeRepositoryTest
	{
		private readonly IDbClient _dbClient = new DbClient();
		private RecipeRepository _recipeRepo;

		[TestInitialize]
		public void SetUp()
		{
			_recipeRepo = new RecipeRepository(_dbClient);

			var builder = Builders<Recipe>.IndexKeys;
			var textIndex = builder.Text("Name").Text("Ingredients.Name");
			Collection.Indexes.CreateOne(textIndex, new CreateIndexOptions { DefaultLanguage = CultureInfo.CurrentCulture.TwoLetterISOLanguageName });
		}

		[TestCleanup]
		public void CleanUp()
		{
			_dbClient.GetCollection<BsonDocument>("recipes").DeleteMany(new BsonDocument());
			_dbClient.GetCollection<BsonDocument>("recipes").Indexes.DropAll();
		}

		private IMongoCollection<Recipe> Collection { get { return _dbClient.GetCollection<Recipe>("recipes"); } }
			
		[TestMethod]
		public void AddRecipe_RecipeAlreadyExists_ReturnsError()
		{
			// Arrange
			Collection.InsertOne(new Recipe
			{
				Name = "Lasagne"
			});

			// Act
			var response = _recipeRepo.Add(new Recipe
			{
				Name = "Lasagne"
			});

			// Assert
			Assert.AreEqual(AppStatusCode.DuplicateExists, response.Code);
		}

		[TestMethod]
		public void AddRecipe_RecipeDoesNotExist_AddsRecipe()
		{
			// Arrange

			// Act
			var response = _recipeRepo.Add(new Recipe
			{
				Name = "Lasagne"
			});

			// Assert
			Assert.AreEqual(AppStatusCode.Ok, response.Code);
		}

		[TestMethod]
		public void GetRecipe_NoMatchingRecipeExists_ReturnsNull()
		{
			// Arrange

			// Act
			var response = _recipeRepo.Get("566da43c41d18b0ff8291f2d");

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && response.Data == null);
		}

		[TestMethod]
		public void GetRecipe_MatchingRecipeExists_ReturnsRecipe()
		{
			// Arrange
			Collection.InsertOne(new Recipe
			{
				Name = "Lasagne"
			});

			var insertedRecipe = Collection.Find(new BsonDocument()).ToList()[0];

			// Act
			var response = _recipeRepo.Get(insertedRecipe.Id);

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && response.Data.Id == insertedRecipe.Id);
		}

		[TestMethod]
		public void FindRecipes_NoMatchingRecipesExist_ReturnsEmptySequence()
		{
			// Arrange
			Collection.InsertMany(new []
			{
				new Recipe { Name = "Lasagne" }
			});

			// Act
			var response = _recipeRepo.Find("Name", "Hamburgare", MatchingStrategy.Equals);

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && !response.Data.Any());
		}

		[TestMethod]
		public void FindRecipes_InvalidFieldName_ReturnsEmptySequence()
		{
			// Arrange
			Collection.InsertMany(new[]
			{
				new Recipe { Name = "Lasagne" }
			});

			// Act
			var response = _recipeRepo.Find("Foo", "Hamburgare", MatchingStrategy.Equals);

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && !response.Data.Any());
		}

		[TestMethod]
		public void FindRecipes_MatchingRecipesExist_ReturnsHits()
		{
			// Arrange
			Collection.InsertMany(new[]
			{
				new Recipe { Name = "A", IsPrivate = false },
				new Recipe { Name = "B", IsPrivate = false },
				new Recipe { Name = "C", IsPrivate = true },
				new Recipe { Name = "D", IsPrivate = false },
			});

			// Act
			var response = _recipeRepo.Find("IsPrivate", false, MatchingStrategy.Equals);

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && response.Data.Count(r => !r.IsPrivate) == 3);
		}

		[TestMethod]
		public void FindRecipes_CustomLimitProvided_ReturnsLimitedHits()
		{
			// Arrange
			Collection.InsertMany(new[]
			{
				new Recipe { Name = "A", Meta = new MetaInfo { Rating = 4 } },
				new Recipe { Name = "B", Meta = new MetaInfo { Rating = 2 } },
				new Recipe { Name = "C", Meta = new MetaInfo { Rating = 5 } },
				new Recipe { Name = "D", Meta = new MetaInfo { Rating = 1 } }
			});

			// Act
			var response = _recipeRepo.Find("Meta.Rating", 2, MatchingStrategy.GreaterThan, 2);

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok &&
				response.Data.First().Meta.Rating == 5 &&
				response.Data.ElementAt(1).Meta.Rating == 4
			);
		}

		[TestMethod]
		public void SearchRecipes_NoMatchingRecipesExist_ReturnsEmptySequence()
		{
			// Arrange
			Collection.InsertMany(new[]
			{
				new Recipe { Name = "Lasagne" }
			});

			// Act
			var response = _recipeRepo.Search("Pasta");

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && !response.Data.Any());
		}

		[TestMethod]
		public void SearchRecipes_MatchingRecipesExist_ReturnsMatchesForRecipeName()
		{
			// Arrange
			Collection.InsertMany(new[]
			{
				new Recipe { Name = "Pasta med ost och skinksås" },
				new Recipe { Name = "Köttbullar med makaroner" },
				new Recipe { Name = "Pastagratäng" }	// Note that this won't match due to "ihopskrivning"
			});

			// Act
			var response = _recipeRepo.Search("past");

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && response.Data.Count() == 1);
		}

		[TestMethod]
		public void SearchRecipes_MatchingRecipesExist_ReturnsMatchesForIngredientName()
		{
			// Arrange
			Collection.InsertMany(new[]
			{
				new Recipe
				{
					Ingredients = new [] { new Ingredient { Name = "Champinjon" } }
				},
				new Recipe
				{
					Ingredients = new [] { new Ingredient { Name = "Gul lök" } }
				},
				new Recipe
				{
					Ingredients = new [] { new Ingredient { Name = "champinjon" } }
				}
			});

			// Act
			var response = _recipeRepo.Search("Champinjoner");

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && response.Data.Count() == 2);
		}

		[TestMethod]
		public void UpdateRecipe_RecipeDoesNotExist_ReturnsError()
		{
			// Act
			var response = _recipeRepo.Update(new Recipe());

			// Assert
			Assert.AreEqual(AppStatusCode.EntityNotFound, response.Code);
		}

		[TestMethod]
		public void UpdateRecipe_RecipeDoesExist_UpdatesRecipe()
		{
			// Arrange
			Collection.InsertOne(new Recipe
			{
				Name = "Lasagne", 
				Ingredients = new []
				{
					new Ingredient { Name = "Vetemjöl", Quantity = 1, Unit = "dl" }
				}
			});

			var recipe = Collection.Find(Builders<Recipe>.Filter.Empty).First();
			recipe.Name = "Lasagne2";
			recipe.Ingredients.First().Quantity = 2;

			// Act
			var response = _recipeRepo.Update(recipe);

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok);
		}

		[TestMethod]
		public void RemoveRecipe_RecipeDoesNotExist_ReturnsError()
		{
			// Act
			var response = _recipeRepo.Remove("566da43c41d18b0ff8291f2d");

			// Assert
			Assert.AreEqual(AppStatusCode.EntityNotFound, response.Code);
		}

		[TestMethod]
		public void RemoveRecipe_RecipeDoesExist_RemovesRecipe()
		{
			// Arrange
			Collection.InsertOne(new Recipe
			{
				Name = "Lasagne"
			});

			var addedRecipe = Collection.Find(Builders<Recipe>.Filter.Empty).First();
			
			// Act
			var response = _recipeRepo.Remove(addedRecipe.Id);

			// Assert
			Assert.AreEqual(AppStatusCode.Ok, response.Code);
		}
	}
}
