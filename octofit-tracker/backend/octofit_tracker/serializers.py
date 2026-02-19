from rest_framework import serializers
from .models import Team, User, Workout, Activity, Leaderboard


class TeamSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'created_at', 'member_count']


class UserSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'hero_name', 'team_id', 'team_name', 
                  'joined_at', 'total_points', 'avatar']


class WorkoutSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)

    class Meta:
        model = Workout
        fields = ['id', 'name', 'points_per_unit', 'unit']


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)

    class Meta:
        model = Activity
        fields = ['id', 'user_id', 'user_name', 'hero_name', 'team_id', 'team_name',
                  'workout_type', 'quantity', 'unit', 'points', 'date', 'created_at']


class LeaderboardSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)

    class Meta:
        model = Leaderboard
        fields = ['id', 'user_id', 'user_name', 'hero_name', 'team_id', 'team_name',
                  'total_points', 'rank', 'avatar', 'last_updated']
