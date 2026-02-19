from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Team, User, Workout, Activity, Leaderboard


class TeamModelTest(TestCase):
    """Test cases for the Team model"""
    
    def setUp(self):
        self.team = Team.objects.create(
            name="Test Team",
            description="Test Description",
            created_at="2026-01-01T00:00:00",
            member_count=0
        )

    def test_team_creation(self):
        """Test that a team can be created"""
        self.assertEqual(self.team.name, "Test Team")
        self.assertEqual(self.team.description, "Test Description")
        self.assertEqual(self.team.member_count, 0)

    def test_team_str(self):
        """Test the string representation of a team"""
        self.assertEqual(str(self.team), "Test Team")


class UserModelTest(TestCase):
    """Test cases for the User model"""
    
    def setUp(self):
        self.user = User.objects.create(
            name="Test User",
            email="test@example.com",
            hero_name="Test Hero",
            team_id="123",
            team_name="Test Team",
            joined_at="2026-01-01T00:00:00",
            total_points=100,
            avatar="🦸"
        )

    def test_user_creation(self):
        """Test that a user can be created"""
        self.assertEqual(self.user.name, "Test User")
        self.assertEqual(self.user.email, "test@example.com")
        self.assertEqual(self.user.hero_name, "Test Hero")
        self.assertEqual(self.user.total_points, 100)

    def test_user_str(self):
        """Test the string representation of a user"""
        self.assertEqual(str(self.user), "Test User (Test Hero)")


class WorkoutModelTest(TestCase):
    """Test cases for the Workout model"""
    
    def setUp(self):
        self.workout = Workout.objects.create(
            name="Running",
            points_per_unit=10,
            unit="km"
        )

    def test_workout_creation(self):
        """Test that a workout can be created"""
        self.assertEqual(self.workout.name, "Running")
        self.assertEqual(self.workout.points_per_unit, 10)
        self.assertEqual(self.workout.unit, "km")

    def test_workout_str(self):
        """Test the string representation of a workout"""
        self.assertEqual(str(self.workout), "Running (10 points per km)")


class ActivityModelTest(TestCase):
    """Test cases for the Activity model"""
    
    def setUp(self):
        self.activity = Activity.objects.create(
            user_id="123",
            user_name="Test User",
            hero_name="Test Hero",
            team_id="456",
            team_name="Test Team",
            workout_type="Running",
            quantity=5.0,
            unit="km",
            points=50,
            date="2026-01-01T00:00:00",
            created_at="2026-01-01T00:00:00"
        )

    def test_activity_creation(self):
        """Test that an activity can be created"""
        self.assertEqual(self.activity.user_name, "Test User")
        self.assertEqual(self.activity.workout_type, "Running")
        self.assertEqual(self.activity.quantity, 5.0)
        self.assertEqual(self.activity.points, 50)

    def test_activity_str(self):
        """Test the string representation of an activity"""
        self.assertEqual(str(self.activity), "Test Hero - Running (50 points)")


class LeaderboardModelTest(TestCase):
    """Test cases for the Leaderboard model"""
    
    def setUp(self):
        self.leaderboard = Leaderboard.objects.create(
            user_id="123",
            user_name="Test User",
            hero_name="Test Hero",
            team_id="456",
            team_name="Test Team",
            total_points=500,
            rank=1,
            avatar="🦸",
            last_updated="2026-01-01T00:00:00"
        )

    def test_leaderboard_creation(self):
        """Test that a leaderboard entry can be created"""
        self.assertEqual(self.leaderboard.user_name, "Test User")
        self.assertEqual(self.leaderboard.total_points, 500)
        self.assertEqual(self.leaderboard.rank, 1)

    def test_leaderboard_str(self):
        """Test the string representation of a leaderboard entry"""
        self.assertEqual(str(self.leaderboard), "#1 - Test Hero (500 points)")


class APIRootTest(APITestCase):
    """Test cases for the API root endpoint"""
    
    def test_api_root(self):
        """Test that the API root returns links to all endpoints"""
        url = reverse('api-root')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('teams', response.data)
        self.assertIn('users', response.data)
        self.assertIn('workouts', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('leaderboard', response.data)


class TeamAPITest(APITestCase):
    """Test cases for the Team API endpoints"""
    
    def setUp(self):
        self.team_data = {
            'name': 'Test Team',
            'description': 'Test Description',
            'created_at': '2026-01-01T00:00:00',
            'member_count': 0
        }

    def test_get_teams_list(self):
        """Test retrieving the list of teams"""
        url = reverse('team-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class UserAPITest(APITestCase):
    """Test cases for the User API endpoints"""
    
    def test_get_users_list(self):
        """Test retrieving the list of users"""
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class WorkoutAPITest(APITestCase):
    """Test cases for the Workout API endpoints"""
    
    def test_get_workouts_list(self):
        """Test retrieving the list of workouts"""
        url = reverse('workout-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ActivityAPITest(APITestCase):
    """Test cases for the Activity API endpoints"""
    
    def test_get_activities_list(self):
        """Test retrieving the list of activities"""
        url = reverse('activity-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LeaderboardAPITest(APITestCase):
    """Test cases for the Leaderboard API endpoints"""
    
    def test_get_leaderboard_list(self):
        """Test retrieving the leaderboard"""
        url = reverse('leaderboard-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
