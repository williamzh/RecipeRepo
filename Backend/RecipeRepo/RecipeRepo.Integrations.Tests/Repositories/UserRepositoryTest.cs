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
	public class UserRepositoryTest
	{
		private readonly IDbClient _dbClient = new DbClient();
		private UserRepository _userRepo;

		[TestInitialize]
		public void SetUp()
		{
			_userRepo = new UserRepository(_dbClient);
		}

		[TestCleanup]
		public void CleanUp()
		{
			_dbClient.GetCollection<BsonDocument>("users").DeleteMany(new BsonDocument());
		}

		private IMongoCollection<User> Collection { get { return _dbClient.GetCollection<User>("users"); } }
			
		[TestMethod]
		public void AddUser_UserAlreadyExists_ReturnsError()
		{
			// Arrange
			Collection.InsertOne(new User
			{
				UserName = "testuser"
			});

			// Act
			var response = _userRepo.Add(new User
			{
				UserName = "testuser"
			});

			// Assert
			Assert.AreEqual(AppStatusCode.DuplicateExists, response.Code);
		}

		[TestMethod]
		public void AddUser_UserDoesNotExist_AddsUser()
		{
			// Act
			var response = _userRepo.Add(new User
			{
				UserName = "testuser"
			});

			// Assert
			Assert.AreEqual(AppStatusCode.Ok, response.Code);
		}

		[TestMethod]
		public void GetUser_NoMatchingUserExists_ReturnsNull()
		{
			// Act
			var response = _userRepo.Get("566da43c41d18b0ff8291f2d");

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && response.Data == null);
		}

		[TestMethod]
		public void GetUser_MatchingUserExists_ReturnsUser()
		{
			// Arrange
			Collection.InsertOne(new User
			{
				UserName = "testuser"
			});

			var insertedUser = Collection.Find(new BsonDocument()).ToList()[0];

			// Act
			var response = _userRepo.Get(insertedUser.Id);

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && response.Data.Id == insertedUser.Id);
		}

		[TestMethod]
		public void FindUsers_NoMatchingUsersExist_ReturnsEmptySequence()
		{
			// Arrange
			Collection.InsertMany(new []
			{
				new User { UserName = "testuser" }
			});

			// Act
			var response = _userRepo.Find("UserName", "testuser2", MatchingStrategy.Equals);

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && !response.Data.Any());
		}

		[TestMethod]
		public void FindUsers_InvalidFieldName_ReturnsError()
		{
			// Arrange
			Collection.InsertMany(new[]
			{
				new User { UserName = "testuser" }
			});

			// Act
			var response = _userRepo.Find("Password", "testuser", MatchingStrategy.Equals);

			// Assert
			Assert.AreEqual(AppStatusCode.Unsupported, response.Code);
		}

		[TestMethod]
		public void FindUsers_InvalidStrategy_ReturnsError()
		{
			// Arrange
			Collection.InsertMany(new[]
			{
				new User { UserName = "testuser" }
			});

			// Act
			var response = _userRepo.Find("UserName", "testuser", MatchingStrategy.GreaterThan);

			// Assert
			Assert.AreEqual(AppStatusCode.Unsupported, response.Code);
		}

		[TestMethod]
		public void FindUsers_UserWithMatchingUsernameExists_ReturnsHit()
		{
			// Arrange
			Collection.InsertMany(new[]
			{
				new User { UserName = "A" },
				new User { UserName = "B" },
				new User { UserName = "C" },
				new User { UserName = "D" }
			});

			// Act
			var response = _userRepo.Find("UserName", "C", MatchingStrategy.Equals);

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && response.Data.SingleOrDefault(u => u.UserName == "C") != null);
		}

		[TestMethod]
		public void FindUsers_UserWithMatchingEmailExists_ReturnsHit()
		{
			// Arrange
			Collection.InsertMany(new[]
			{
				new User { UserName = "A", Email = "a@test.com" },
				new User { UserName = "B", Email = "b@test.com" },
				new User { UserName = "C", Email = "c@test.com" },
				new User { UserName = "D", Email = "d@test.com" }
			});

			// Act
			var response = _userRepo.Find("Email", "c@test.com", MatchingStrategy.Equals);

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && response.Data.SingleOrDefault(u => u.UserName == "C") != null);
		}

		[TestMethod]
		public void UpdateUser_UserDoesNotExist_ReturnsError()
		{
			// Act
			var response = _userRepo.Update(new User());

			// Assert
			Assert.AreEqual(AppStatusCode.EntityNotFound, response.Code);
		}

		[TestMethod]
		public void UpdateUser_OnUserNameField_ReturnsError()
		{
			// Arrange
			Collection.InsertOne(new User
			{
				UserName = "testuser"
			});

			var recipe = Collection.Find(Builders<User>.Filter.Empty).First();
			recipe.UserName = "testuser2";

			// Act
			var response = _userRepo.Update(recipe);

			// Assert
			Assert.AreEqual(AppStatusCode.Unsupported, response.Code);
		}

		[TestMethod]
		public void UpdateUser_UserDoesExist_UpdatesUser()
		{
			// Arrange
			Collection.InsertOne(new User
			{
				UserName = "testuser", 
				Password = "1234"
			});

			var recipe = Collection.Find(Builders<User>.Filter.Empty).First();
			recipe.Password = "2345";

			// Act
			var response = _userRepo.Update(recipe);

			// Assert
			Assert.AreEqual(AppStatusCode.Ok, response.Code);
		}

		[TestMethod]
		public void RemoveUser_UserDoesNotExist_ReturnsError()
		{
			// Act
			var response = _userRepo.Remove("566da43c41d18b0ff8291f2d");

			// Assert
			Assert.AreEqual(AppStatusCode.EntityNotFound, response.Code);
		}

		[TestMethod]
		public void RemoveUser_UserDoesExist_RemovesUser()
		{
			// Arrange
			Collection.InsertOne(new User
			{
				UserName = "testuser"
			});

			var addedUser = Collection.Find(Builders<User>.Filter.Empty).First();
			
			// Act
			var response = _userRepo.Remove(addedUser.Id);

			// Assert
			Assert.AreEqual(AppStatusCode.Ok, response.Code);
		}
	}
}
