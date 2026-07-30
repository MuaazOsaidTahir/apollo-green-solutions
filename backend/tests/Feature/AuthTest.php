<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user registration.
     */
    public function test_user_can_register()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'status',
                'data' => [
                    'user' => ['id', 'name', 'email', 'created_at', 'updated_at'],
                    'token',
                ]
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
        ]);
    }

    /**
     * Test registration validation errors.
     */
    public function test_registration_validation()
    {
        $response = $this->postJson('/api/register', [
            'name' => '',
            'email' => 'not-an-email',
            'password' => 'short',
            'password_confirmation' => 'mismatch',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    /**
     * Test user login.
     */
    public function test_user_can_login_with_correct_credentials()
    {
        $user = User::factory()->create([
            'email' => 'jane@example.com',
            'password' => bcrypt('secret-password'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'jane@example.com',
            'password' => 'secret-password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    'user',
                    'token',
                ]
            ]);
    }

    /**
     * Test login failure.
     */
    public function test_user_cannot_login_with_incorrect_credentials()
    {
        $user = User::factory()->create([
            'email' => 'jane@example.com',
            'password' => bcrypt('secret-password'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'jane@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'status' => 'error',
                'message' => 'Invalid login credentials.',
            ]);
    }

    /**
     * Test unauthorized access protection.
     */
    public function test_routes_are_protected_by_sanctum()
    {
        $response = $this->getJson('/api/workspaces');

        $response->assertStatus(401);
    }

    /**
     * Test workspace is scoped to authenticated user.
     */
    public function test_user_can_only_access_their_own_workspaces()
    {
        // GIVEN: Two users, user A has workspace A, user B has workspace B
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $workspaceA = Workspace::create([
            'name' => 'Workspace A',
            'user_id' => $userA->id,
        ]);

        $workspaceB = Workspace::create([
            'name' => 'Workspace B',
            'user_id' => $userB->id,
        ]);

        // WHEN: Listing workspaces as User A
        $response = $this->actingAs($userA, 'sanctum')->getJson('/api/workspaces');

        // THEN: Only Workspace A should be shown, Workspace B is hidden
        $response->assertStatus(200);
        
        $data = $response->json('data.data');
        $this->assertCount(1, $data);
        $this->assertEquals('Workspace A', $data[0]['name']);

        // WHEN: Accessing Workspace B directly as User A
        $responseB = $this->actingAs($userA, 'sanctum')->getJson('/api/workspaces/' . $workspaceB->id);

        // THEN: It should return a 500 error (or FindOrFail models exception)
        $responseB->assertStatus(500)
            ->assertJson(['status' => 'error']);
    }

    /**
     * Test logout revokes the current token.
     */
    public function test_logout_revokes_the_current_token()
    {
        $user = User::factory()->create();

        $loginResponse = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $token = $loginResponse->json('data.token');

        $logoutResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/logout');

        $logoutResponse->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Logged out successfully.',
            ]);

        $protectedResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/user');

        $protectedResponse->assertStatus(401);
    }

    /**
     * Test user logout.
     */
    public function test_user_can_logout()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Logged out successfully.',
            ]);
    }
}
