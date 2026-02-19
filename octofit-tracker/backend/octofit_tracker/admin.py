from django.contrib import admin
from .models import Team, User, Workout, Activity, Leaderboard


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'member_count', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('created_at',)
    ordering = ('name',)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'hero_name', 'email', 'team_name', 'total_points', 'avatar')
    search_fields = ('name', 'email', 'hero_name')
    list_filter = ('team_name', 'joined_at')
    ordering = ('-total_points',)


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('name', 'points_per_unit', 'unit')
    search_fields = ('name', 'unit')
    ordering = ('name',)


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('hero_name', 'workout_type', 'quantity', 'unit', 'points', 'team_name', 'date')
    search_fields = ('user_name', 'hero_name', 'workout_type')
    list_filter = ('team_name', 'workout_type', 'date')
    ordering = ('-created_at',)


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('rank', 'hero_name', 'total_points', 'team_name', 'avatar')
    search_fields = ('user_name', 'hero_name')
    list_filter = ('team_name',)
    ordering = ('rank',)
