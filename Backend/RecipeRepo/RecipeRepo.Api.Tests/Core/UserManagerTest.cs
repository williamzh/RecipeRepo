using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using RecipeRepo.Api.Core;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;
using RecipeRepo.Integrations.Repositories;

namespace RecipeRepo.Api.Tests.Core
{
	[TestClass]
	public class UserManagerTest
	{
		private Mock<IDbRepository<User>> _userRepoMock;
		private Mock<IDbRepository<Recipe>> _recipeRepoMock;
		private UserManager _userManager;

		[TestInitialize]
		public void SetUp()
		{
			_userRepoMock = new Mock<IDbRepository<User>>();
			_recipeRepoMock = new Mock<IDbRepository<Recipe>>();

			_userManager = new UserManager(_userRepoMock.Object, _recipeRepoMock.Object);
		}

		[TestMethod]
		public void CreateUser_ExistanceCheckFailed_ReturnsError()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Find(It.IsAny<string>(), It.IsAny<string>(), MatchingStrategy.Equals, It.IsAny<int>())).Returns(new ActionResponse<IEnumerable<User>>
			{
				Code = AppStatusCode.UnknownError
			});

			// Act
			var response = _userManager.CreateUser(new User());

			// Assert
			Assert.AreEqual(AppStatusCode.UnknownError, response.Code);
		}

		[TestMethod]
		public void CreateUser_UserWithSameUsernameExists_ReturnsError()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Find(It.IsAny<string>(), It.IsAny<string>(), MatchingStrategy.Equals, It.IsAny<int>())).Returns(new ActionResponse<IEnumerable<User>>
			{
				Code = AppStatusCode.Ok,
				Data = new [] { new User() }
			});

			// Act
			var response = _userManager.CreateUser(new User());

			// Assert
			Assert.AreEqual(AppStatusCode.DuplicateExists, response.Code);
		}

		[TestMethod]
		public void CreateUser_NoUserWithSameUsernameExists_CreatesUser()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Find(It.IsAny<string>(), It.IsAny<string>(), MatchingStrategy.Equals, It.IsAny<int>())).Returns(new ActionResponse<IEnumerable<User>>
			{
				Code = AppStatusCode.Ok,
				Data = new User[0]
			});
			_userRepoMock.Setup(u => u.Add(It.IsAny<User>())).Returns(new ActionResponse
			{
				Code = AppStatusCode.Ok
			});

			// Act
			var response = _userManager.CreateUser(new User { UserName = "User1" });

			// Assert
			Assert.AreEqual(AppStatusCode.Ok, response.Code);
			_userRepoMock.Verify(r => r.Add(It.Is<User>(
				u => u.UserName == "User1" &&
					u.OwnedRecipes != null &&
					u.LastViewedRecipes != null &&
					u.FavoriteRecipes != null &&
					u.Settings != null && u.Settings.Language == "sv-SE"
				)), Times.Once());
		}

		[TestMethod]
		public void GetUser_DbQueryFailed_ReturnsError()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get(It.IsAny<string>())).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.UnknownError
			});

			// Act
			var response = _userManager.GetUser("12345");

			// Assert
			Assert.AreEqual(AppStatusCode.UnknownError, response.Code);
		}

		[TestMethod]
		public void GetUser_NoMatchingUserExists_ReturnsNull()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get(It.IsAny<string>())).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = null
			});

			// Act
			var response = _userManager.GetUser("12345");

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && response.Data == null);
		}

		[TestMethod]
		public void GetUser_MatchingUserExists_ReturnsUserWithHiddenPassword()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get(It.IsAny<string>())).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = new User { Password = "foo" }
			});

			// Act
			var response = _userManager.GetUser("12345");

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && response.Data.Password == null);
		}

		[TestMethod]
		public void UpdateUser_ExistanceCheckFailed_ReturnsError()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get(It.IsAny<string>())).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.UnknownError
			});

			// Act
			var response = _userManager.UpdateUser(new User());

			// Assert
			Assert.AreEqual(AppStatusCode.UnknownError, response.Code);
		}

		[TestMethod]
		public void UpdateUser_UserDoesntExist_ReturnsError()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get("2")).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = null
			});

			// Act
			var response = _userManager.UpdateUser(new User { Id = "2" });

			// Assert
			Assert.AreEqual(AppStatusCode.EntityNotFound, response.Code);
		}

		[TestMethod]
		public void UpdateUser_UserExists_UpdatesUser()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get("2")).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = new User
				{
					Id = "2", 
					UserName = "johndoe", 
					Password = "test1234", 
					Email = "johndoe@test.com",
					FirstName = "John",
					LastName = "Doe",
					FavoriteRecipes = new string[0],
					LastViewedRecipes = new string[0],
					OwnedRecipes = new string[0],
					Settings = new UserSettings { Language = "sv-SE" }
				}
			});
			_userRepoMock.Setup(u => u.Update(It.IsAny<User>())).Returns(new ActionResponse
			{
				Code = AppStatusCode.Ok
			});

			// Act
			var response = _userManager.UpdateUser(new User
			{
				Id = "2", 
				UserName = "johndoe1",
				Password = "test12345",
				Email = "johndoe1@test.com",
				FirstName = "John1",
				LastName = "Doe1",
				FavoriteRecipes = null,
				LastViewedRecipes = null,
				OwnedRecipes = null,
				Settings = new UserSettings { Language = "da-DK" }
			});

			// Assert
			Assert.AreEqual(AppStatusCode.Ok, response.Code);
			_userRepoMock.Verify(r => r.Update(It.Is<User>(
				u => u.Id == "2" &&
					u.UserName == "johndoe1" &&
					u.Password == "test12345" &&
					u.Email == "johndoe1@test.com" &&
					u.FirstName == "John1" &&
					u.LastName == "Doe1" &&
					u.FavoriteRecipes != null &&	// Check that this hasn't been overwritten
					u.LastViewedRecipes != null &&	// Check that this hasn't been overwritten
					u.OwnedRecipes != null &&		// Check that this hasn't been overwritten
					u.Settings.Language == "da-DK"
				)), Times.Once());
		}

		[TestMethod]
		public void DeleteUser_ExistanceCheckFailed_ReturnsError()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get("12345")).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.UnknownError
			});

			// Act
			var response = _userManager.DeleteUser("12345");

			// Assert
			Assert.AreEqual(AppStatusCode.UnknownError, response.Code);
		}

		[TestMethod]
		public void DeleteUser_UserDoesntExist_ReturnsError()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get("12345")).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = null
			});

			// Act
			var response = _userManager.DeleteUser("12345");

			// Assert
			Assert.AreEqual(AppStatusCode.EntityNotFound, response.Code);
		}

		[TestMethod]
		public void DeleteUser_UserExists_DeletesUser()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get("12345")).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = new User { Id = "12345" }
			});
			_userRepoMock.Setup(u => u.Remove(It.IsAny<string>())).Returns(new ActionResponse
			{
				Code = AppStatusCode.Ok
			});

			// Act
			var response = _userManager.DeleteUser("12345");

			// Assert
			Assert.AreEqual(AppStatusCode.Ok, response.Code);
			_userRepoMock.Verify(r => r.Remove("12345"), Times.Once());
		}

		[TestMethod]
		public void FindUsersByUserName_DbQueryFailed_ReturnsError()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Find(It.IsAny<string>(), It.IsAny<string>(), MatchingStrategy.Equals, It.IsAny<int>())).Returns(new ActionResponse<IEnumerable<User>>
			{
				Code = AppStatusCode.UnknownError
			});

			// Act
			var response = _userManager.FindUsersByUserName("foo", 100);

			// Assert
			Assert.AreEqual(AppStatusCode.UnknownError, response.Code);
		}

		[TestMethod]
		public void FindUsersByUserName_NoMatchingUsersExist_ReturnsEmptySequence()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Find(It.IsAny<string>(), It.IsAny<string>(), MatchingStrategy.Equals, It.IsAny<int>())).Returns(new ActionResponse<IEnumerable<User>>
			{
				Code = AppStatusCode.Ok,
				Data = new List<User>()
			});

			// Act
			var response = _userManager.FindUsersByUserName("foo", 100);

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && !response.Data.Any());
		}

		[TestMethod]
		public void FindUsersByUserName_MatchingUsersExist_ReturnsUsersWithHiddenPasswords()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Find(It.IsAny<string>(), It.IsAny<string>(), MatchingStrategy.Equals, It.IsAny<int>())).Returns(new ActionResponse<IEnumerable<User>>
			{
				Code = AppStatusCode.Ok,
				Data = new []
				{
					new User { Id = "1", UserName = "user1" },
					new User { Id = "2", UserName = "user2" }
				}
			});

			// Act
			var response = _userManager.FindUsersByUserName("user", 100);

			// Assert
			Assert.IsTrue(
				response.Code == AppStatusCode.Ok && 
				response.Data.Count() == 2 && 
				response.Data.All(u => u.Password == null)
			);
		}

		[TestMethod]
		public void GetUserHistory_UserRetrievalFailed_ReturnsError()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get(It.IsAny<string>())).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.UnknownError
			});

			// Act
			var response = _userManager.GetUserHistory("12345");

			// Assert
			Assert.AreEqual(AppStatusCode.UnknownError, response.Code);
		}

		[TestMethod]
		public void GetUserHistory_UserDoesntExist_ReturnsError()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get(It.IsAny<string>())).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = null
			});

			// Act
			var response = _userManager.GetUserHistory("12345");

			// Assert
			Assert.AreEqual(AppStatusCode.EntityNotFound, response.Code);
		}

		[TestMethod]
		public void GetUserHistory_UserExistsAndRecipesNotFetchedSuccessfully_ReturnsError()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get(It.IsAny<string>())).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = new User { LastViewedRecipes = new[] { "1", "2", "3" } }
			});

			_recipeRepoMock.Setup(r => r.Get(It.IsAny<IEnumerable<string>>())).Returns(new ActionResponse<IEnumerable<Recipe>>
			{
				Code = AppStatusCode.UnknownError
			});

			// Act
			var response = _userManager.GetUserHistory("12345");

			// Assert
			Assert.AreEqual(AppStatusCode.UnknownError, response.Code);
		}

		[TestMethod]
		public void GetUserHistory_UserExistsAndRecipesFetchedSuccessfully_ReturnsUserHistory()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get(It.IsAny<string>())).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = new User { LastViewedRecipes = new[] { "1", "2", "3" } }
			});

			_recipeRepoMock.Setup(r => r.Get(It.IsAny<IEnumerable<string>>())).Returns(new ActionResponse<IEnumerable<Recipe>>
			{
				Code = AppStatusCode.Ok,
				Data = new[] { new Recipe { Id = "1" }, new Recipe { Id = "2" }, new Recipe { Id = "3" } }
			});

			// Act
			var response = _userManager.GetUserHistory("12345");

			// Assert
			Assert.IsTrue(response.Code == AppStatusCode.Ok && response.Data.Count() == 3);
		}

		[TestMethod]
		public void UpdateUserHistory_UserRetrievalFailed_ReturnsError()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get(It.IsAny<string>())).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.UnknownError
			});

			// Act
			var response = _userManager.UpdateUserHistory("12345", "23456");

			// Assert
			Assert.AreEqual(AppStatusCode.UnknownError, response.Code);
		}

		[TestMethod]
		public void UpdateUserHistory_RecipeAlreadyInHistory_SetsItToLatest()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get(It.IsAny<string>())).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = new User
				{
					LastViewedRecipes = new[] { "1", "2", "3" }
				}
			});
			_userRepoMock.Setup(u => u.Update(It.IsAny<User>())).Returns(new ActionResponse
			{
				Code = AppStatusCode.Ok
			});

			// Act
			var response = _userManager.UpdateUserHistory("12345", "2");

			// Assert
			Assert.AreEqual(AppStatusCode.Ok, response.Code);
			_userRepoMock.Verify(r => r.Update(It.Is<User>(u => u.LastViewedRecipes.SequenceEqual(new []
			{
				"2", "1", "3"
			}))), Times.Once());
		}

		[TestMethod]
		public void UpdateUserHistory_HistoryIsFull_UpdatesHistoryWithoutExceedingLimit()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get(It.IsAny<string>())).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = new User
				{
					LastViewedRecipes = new[] { "1", "2", "3", "4", "5", "6", "7", "8", "9", "10" }
				}
			});
			_userRepoMock.Setup(u => u.Update(It.IsAny<User>())).Returns(new ActionResponse
			{
				Code = AppStatusCode.Ok
			});

			// Act
			var response = _userManager.UpdateUserHistory("12345", "11");

			// Assert
			Assert.AreEqual(AppStatusCode.Ok, response.Code);
			_userRepoMock.Verify(r => r.Update(It.Is<User>(u => u.LastViewedRecipes.SequenceEqual(new []
			{
				"11", "1", "2", "3", "4", "5", "6", "7", "8", "9"
			}))), Times.Once());
		}

		[TestMethod]
		public void SetFavoriteRecipe_UserRetrievalFailed_ReturnsError()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get(It.IsAny<string>())).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.UnknownError
			});

			// Act
			var response = _userManager.SetFavoriteRecipe("12345", "23456", true);

			// Assert
			Assert.AreEqual(AppStatusCode.UnknownError, response.Code);
		}

		[TestMethod]
		public void SetFavoriteRecipe_SetRecipeAlreadyFavorite_DoesntAddDuplicate()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get(It.IsAny<string>())).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = new User { FavoriteRecipes = new[] { "1", "2", "3" } }
			});
			_userRepoMock.Setup(u => u.Update(It.IsAny<User>())).Returns(new ActionResponse
			{
				Code = AppStatusCode.Ok
			});

			// Act
			var response = _userManager.SetFavoriteRecipe("12345", "2", true);

			// Assert
			Assert.AreEqual(AppStatusCode.Ok, response.Code);
			_userRepoMock.Verify(r => r.Update(It.Is<User>(u => u.FavoriteRecipes.SequenceEqual(new[]
			{
				"1", "2", "3"
			}))), Times.Once());
		}

		[TestMethod]
		public void SetFavoriteRecipe_SetRecipeNotFavorite_SetsItAsFavorite()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get(It.IsAny<string>())).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = new User { FavoriteRecipes = new[] { "1", "2", "3" } }
			});
			_userRepoMock.Setup(u => u.Update(It.IsAny<User>())).Returns(new ActionResponse
			{
				Code = AppStatusCode.Ok
			});

			// Act
			var response = _userManager.SetFavoriteRecipe("12345", "4", true);

			// Assert
			Assert.AreEqual(AppStatusCode.Ok, response.Code);
			_userRepoMock.Verify(r => r.Update(It.Is<User>(u => u.FavoriteRecipes.SequenceEqual(new[]
			{
				"1", "2", "3", "4"
			}))), Times.Once());
		}

		[TestMethod]
		public void SetFavoriteRecipe_UnsetRecipeNotFavorite_DoesntRemoveIt()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get(It.IsAny<string>())).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = new User { FavoriteRecipes = new[] { "1", "2", "3" } }
			});
			_userRepoMock.Setup(u => u.Update(It.IsAny<User>())).Returns(new ActionResponse
			{
				Code = AppStatusCode.Ok
			});

			// Act
			var response = _userManager.SetFavoriteRecipe("12345", "4", false);

			// Assert
			Assert.AreEqual(AppStatusCode.Ok, response.Code);
			_userRepoMock.Verify(r => r.Update(It.Is<User>(u => u.FavoriteRecipes.SequenceEqual(new[]
			{
				"1", "2", "3"
			}))), Times.Once());
		}

		[TestMethod]
		public void SetFavoriteRecipe_UnsetRecipeIsFavorite_UnsetsIt()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get(It.IsAny<string>())).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = new User { FavoriteRecipes = new[] { "1", "2", "3" } }
			});
			_userRepoMock.Setup(u => u.Update(It.IsAny<User>())).Returns(new ActionResponse
			{
				Code = AppStatusCode.Ok
			});

			// Act
			var response = _userManager.SetFavoriteRecipe("12345", "2", false);

			// Assert
			Assert.AreEqual(AppStatusCode.Ok, response.Code);
			_userRepoMock.Verify(r => r.Update(It.Is<User>(u => u.FavoriteRecipes.SequenceEqual(new[]
			{
				"1", "3"
			}))), Times.Once());
		}
	}
}
