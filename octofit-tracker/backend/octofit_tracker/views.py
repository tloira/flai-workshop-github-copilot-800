from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Team, User, Workout, Activity, Leaderboard
from .serializers import (
    TeamSerializer, UserSerializer, WorkoutSerializer, 
    ActivitySerializer, LeaderboardSerializer
)


class TeamViewSet(viewsets.ModelViewSet):
    """
    API endpoint for teams.
    Supports list, retrieve, create, update, and delete operations.
    """
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'member_count', 'created_at']
    ordering = ['name']

    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        """Get all members of a specific team"""
        team = self.get_object()
        users = User.objects.filter(team_id=str(team._id))
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get team statistics"""
        teams = Team.objects.all()
        stats = []
        for team in teams:
            team_users = User.objects.filter(team_id=str(team._id))
            total_points = sum(user.total_points for user in team_users)
            stats.append({
                'id': str(team._id),
                'name': team.name,
                'member_count': team.member_count,
                'total_points': total_points
            })
        return Response(stats)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for users.
    Supports list, retrieve, create, update, and delete operations.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['team_id', 'team_name']
    search_fields = ['name', 'email', 'hero_name']
    ordering_fields = ['name', 'total_points', 'joined_at']
    ordering = ['-total_points']

    @action(detail=True, methods=['get'])
    def activities(self, request, pk=None):
        """Get all activities for a specific user"""
        user = self.get_object()
        activities = Activity.objects.filter(user_id=str(user._id))
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)


class WorkoutViewSet(viewsets.ModelViewSet):
    """
    API endpoint for workout types.
    Supports list, retrieve, create, update, and delete operations.
    """
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'unit']
    ordering_fields = ['name', 'points_per_unit']
    ordering = ['name']


class ActivityViewSet(viewsets.ModelViewSet):
    """
    API endpoint for activities.
    Supports list, retrieve, create, update, and delete operations.
    """
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['user_id', 'team_id', 'team_name', 'workout_type']
    search_fields = ['user_name', 'hero_name', 'workout_type']
    ordering_fields = ['created_at', 'points', 'date']
    ordering = ['-created_at']

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent activities (last 20)"""
        activities = Activity.objects.all()[:20]
        serializer = self.get_serializer(activities, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_team(self, request):
        """Get activities grouped by team"""
        team_name = request.query_params.get('team_name', None)
        if team_name:
            activities = Activity.objects.filter(team_name=team_name)
        else:
            activities = Activity.objects.all()
        serializer = self.get_serializer(activities, many=True)
        return Response(serializer.data)


class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for leaderboard (read-only).
    Supports list and retrieve operations only.
    """
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['team_id', 'team_name']
    ordering_fields = ['rank', 'total_points']
    ordering = ['rank']

    @action(detail=False, methods=['get'])
    def top(self, request):
        """Get top N users from leaderboard"""
        limit = int(request.query_params.get('limit', 10))
        top_users = Leaderboard.objects.all()[:limit]
        serializer = self.get_serializer(top_users, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_team(self, request):
        """Get leaderboard filtered by team"""
        team_name = request.query_params.get('team_name', None)
        if team_name:
            leaderboard = Leaderboard.objects.filter(team_name=team_name)
        else:
            leaderboard = Leaderboard.objects.all()
        serializer = self.get_serializer(leaderboard, many=True)
        return Response(serializer.data)
