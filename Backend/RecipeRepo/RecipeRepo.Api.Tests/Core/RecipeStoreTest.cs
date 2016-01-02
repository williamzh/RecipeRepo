﻿using System;
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
	public class RecipeStoreTest
	{
		private Mock<IDbRepository<Recipe>> _recipeRepoMock;
		private Mock<IDbRepository<User>> _userRepoMock;
		private RecipeStore _recipeStore;

		[TestInitialize]
		public void SetUp()
		{
			_recipeRepoMock = new Mock<IDbRepository<Recipe>>();
			_userRepoMock = new Mock<IDbRepository<User>>();

			_recipeStore = new RecipeStore(_recipeRepoMock.Object, _userRepoMock.Object);
		}

		[TestMethod]
		public void AddRecipe_UserDoesNotExist_ReturnsError()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get(It.IsAny<string>())).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = null
			});

			// Act
			var response = _recipeStore.AddRecipe("12345", new Recipe());

			// Assert
			Assert.AreEqual(AppStatusCode.EntityNotFound, response.Code);
		}

		[TestMethod]
		public void AddRecipe_RecipeAlreadyExists_ReturnsError()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get(It.IsAny<string>())).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = new User()
			});

			_recipeRepoMock.Setup(r => r.Find("Name", It.IsAny<string>(), MatchingStrategy.Equals, It.IsAny<int>())).Returns(new ActionResponse<IEnumerable<Recipe>>
			{
				Code = AppStatusCode.Ok,
				Data = new [] { new Recipe() }
			});

			// Act
			var response = _recipeStore.AddRecipe("12345", new Recipe());

			// Assert
			Assert.AreEqual(AppStatusCode.DuplicateExists, response.Code);
		}

		[TestMethod]
		public void AddRecipe_UserAndRecipeValid_AddsRecipeWithInitializedMetaInfo()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get(It.IsAny<string>())).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = new User { OwnedRecipes = new List<string>() }
			});

			_recipeRepoMock.Setup(r => r.Find("Name", It.IsAny<string>(), MatchingStrategy.Equals, It.IsAny<int>())).Returns(new ActionResponse<IEnumerable<Recipe>>
			{
				Code = AppStatusCode.Ok,
				Data = new List<Recipe>()
			});

			_recipeRepoMock.Setup(r => r.Add(It.IsAny<Recipe>())).Returns(new ActionResponse
			{
				Code = AppStatusCode.Ok
			});

			_userRepoMock.Setup(r => r.Update(It.IsAny<User>())).Returns(new ActionResponse
			{
				Code = AppStatusCode.Ok
			});

			// Act
			var response = _recipeStore.AddRecipe("12345", new Recipe { Meta = new MetaInfo() });

			// Assert
			Assert.AreEqual(AppStatusCode.Ok, response.Code);
			_recipeRepoMock.Verify(repo => repo.Add(It.Is<Recipe>(r => 
				r.Meta.Created != DateTime.MinValue &&
				r.Meta.LastEdited != DateTime.MinValue)
			), Times.Once());
		}

		[TestMethod]
		public void AddRecipe_UserAndRecipeValid_AssociatesRecipeWithUser()
		{
			// Arrange
			_userRepoMock.Setup(u => u.Get(It.IsAny<string>())).Returns(new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = new User { OwnedRecipes = new List<string>() }
			});

			_recipeRepoMock.Setup(r => r.Find("Name", It.IsAny<string>(), MatchingStrategy.Equals, It.IsAny<int>())).Returns(new ActionResponse<IEnumerable<Recipe>>
			{
				Code = AppStatusCode.Ok,
				Data = new List<Recipe>()
			});

			_recipeRepoMock.Setup(r => r.Add(It.IsAny<Recipe>())).Returns(new ActionResponse
			{
				Code = AppStatusCode.Ok
			});

			_userRepoMock.Setup(r => r.Update(It.IsAny<User>())).Returns(new ActionResponse
			{
				Code = AppStatusCode.Ok
			});

			// Act
			var response = _recipeStore.AddRecipe("12345", new Recipe { Id = "1", Meta = new MetaInfo() });

			// Assert
			Assert.AreEqual(AppStatusCode.Ok, response.Code);
			_userRepoMock.Verify(repo => repo.Update(It.Is<User>(r =>
				r.OwnedRecipes.Single() == "1")
			), Times.Once());
		}

		[TestMethod]
		public void UpdateRecipe_RecipeDoesntExist_ReturnsError()
		{
			// Arrange
			_recipeRepoMock.Setup(r => r.Get(It.IsAny<string>())).Returns(new ActionResponse<Recipe>
			{
				Code = AppStatusCode.Ok,
				Data = null
			});

			// Act
			var response = _recipeStore.UpdateRecipe(new Recipe());

			// Assert
			Assert.AreEqual(AppStatusCode.EntityNotFound, response.Code);
		}

		[TestMethod]
		public void UpdateRecipe_RecipeExists_UpdatesRecipe()
		{
			// Arrange
			_recipeRepoMock.Setup(r => r.Get(It.IsAny<string>())).Returns(new ActionResponse<Recipe>
			{
				Code = AppStatusCode.Ok,
				Data = new Recipe { Id = "1", Name = "Recipe 1" }
			});

			_recipeRepoMock.Setup(r => r.Update(It.IsAny<Recipe>())).Returns(new ActionResponse
			{
				Code = AppStatusCode.Ok
			});

			// Act
			var response = _recipeStore.UpdateRecipe(new Recipe { Id = "1", Name = "Recipe 2" });

			// Assert
			Assert.AreEqual(AppStatusCode.Ok, response.Code);
			_recipeRepoMock.Verify(repo => repo.Update(It.Is<Recipe>(r => r.Name == "Recipe 2")), Times.Once());
		}

		[TestMethod]
		public void DeleteRecipe_RecipeDoesntExist_ReturnsError()
		{
			// Arrange
			_recipeRepoMock.Setup(r => r.Get(It.IsAny<string>())).Returns(new ActionResponse<Recipe>
			{
				Code = AppStatusCode.Ok,
				Data = null
			});

			// Act
			var response = _recipeStore.DeleteRecipe("12345");

			// Assert
			Assert.AreEqual(AppStatusCode.EntityNotFound, response.Code);
		}

		[TestMethod]
		public void DeleteRecipe_RecipeExists_UpdatesRecipe()
		{
			// Arrange
			_recipeRepoMock.Setup(r => r.Get(It.IsAny<string>())).Returns(new ActionResponse<Recipe>
			{
				Code = AppStatusCode.Ok,
				Data = new Recipe { Id = "1", Name = "Recipe 1" }
			});

			_recipeRepoMock.Setup(r => r.Remove(It.IsAny<string>())).Returns(new ActionResponse
			{
				Code = AppStatusCode.Ok
			});

			// Act
			var response = _recipeStore.DeleteRecipe("1");

			// Assert
			Assert.AreEqual(AppStatusCode.Ok, response.Code);
			_recipeRepoMock.Verify(repo => repo.Remove("1"), Times.Once());
		}
	}
}
