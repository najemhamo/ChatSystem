using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Models;
using Services;
using Repository;

namespace Endpoints
{
    public static class AuthEndpoint
    {
        public static void ConfigureAuthEndpoints(this WebApplication app)
        {
            var auth = app.MapGroup("Authentication");
            auth.MapPost("/registerMember", RegisterMember);
            auth.MapPost("/registerAdmin", RegisterAdmin);
            auth.MapPost("/login", Login);
        }

        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        private static async Task<IResult> RegisterMember(UserManager<ApplicationUser> userManager, [FromBody] RegisterUserPayload payload, IChatRepository chatRepository)
        {
            if (payload.UserName == null) return TypedResults.BadRequest("Username is required");
            if (payload.Password == null) return TypedResults.BadRequest("Password is required");
            if (payload.Name == null) return TypedResults.BadRequest("Name is required");
            if (payload.Email == null) return TypedResults.BadRequest("Email is required");

            // check if user is already registered
            var user = await userManager.FindByNameAsync(payload.UserName);
            if (user != null)
            {
                return TypedResults.BadRequest("User already exists");
            }

            // check if email is already registered
            var email = await userManager.FindByEmailAsync(payload.Email);
            if (email != null)
            {
                return TypedResults.BadRequest("Email already exists");
            }

            // Register the user in the database for the Authentication
            var result = await userManager.CreateAsync(new ApplicationUser
            {
                UserName = payload.UserName,
                Email = payload.Email,
                Role = Roles.Member

            }, payload.Password!);

            if (result.Succeeded)
            {
                // Create a member in the database
                await chatRepository.CreateMember(new CreateMemberPayload(payload.Name, payload.UserName, payload.Email, payload.Password, payload.AboutMe, payload.ProfilePicture, Roles.Member));
                return TypedResults.Created($"/auth/", new { payload.UserName, role = Roles.Member });
            }
            return Results.BadRequest(result.Errors);
        }

        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        private static async Task<IResult> RegisterAdmin(UserManager<ApplicationUser> userManager, [FromBody] RegisterUserPayload payload, IChatRepository chatRepository)
        {
            if (payload.UserName == null) return TypedResults.BadRequest("Username is required");
            if (payload.Password == null) return TypedResults.BadRequest("Password is required");
            if (payload.Name == null) return TypedResults.BadRequest("Name is required");
            if (payload.Email == null) return TypedResults.BadRequest("Email is required");

            // check if user is already registered
            var user = await userManager.FindByNameAsync(payload.UserName);
            if (user != null)
            {
                return TypedResults.BadRequest("User already exists");
            }

            // check if email is already registered
            var email = await userManager.FindByEmailAsync(payload.Email);
            if (email != null)
            {
                return TypedResults.BadRequest("Email already exists");
            }


            // Register the user in the database for the Authentication
            var result = await userManager.CreateAsync(new ApplicationUser
            {
                UserName = payload.UserName,
                Email = payload.Email,
                Role = Roles.Admin

            }, payload.Password!);

            if (result.Succeeded)
            {
                // Create a member in the database
                await chatRepository.CreateMember(new CreateMemberPayload(payload.Name, payload.UserName, payload.Email, payload.Password, payload.AboutMe, payload.ProfilePicture, Roles.Admin));
                return TypedResults.Created($"/auth/", new { payload.UserName, role = Roles.Admin });
            }
            return Results.BadRequest(result.Errors);
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        private static async Task<IResult> Login(UserManager<ApplicationUser> userManager, TokenService tokenService, LoginUserPayload payload, IChatRepository repository)
        {
            if (payload.UserName == null) return TypedResults.BadRequest("Username is required");
            if (payload.Password == null) return TypedResults.BadRequest("Password is required");

            var user = await userManager.FindByNameAsync(payload.UserName);
            if (user == null)
            {
                return TypedResults.BadRequest("Invalid username or password");
            }
            var isPasswordValid = await userManager.CheckPasswordAsync(user, payload.Password);
            if (!isPasswordValid)
            {
                return TypedResults.BadRequest("Invalid username or password.");
            }

            var userInDb = repository.GetUser(payload.UserName);

            if (userInDb == null)
            {
                return Results.Unauthorized();
            }

            var accessToken = tokenService.CreateToken(userInDb);
            return TypedResults.Ok(new AuthenticateUserResponse(accessToken, userInDb.UserName, userInDb.Role));
        }
    }
}