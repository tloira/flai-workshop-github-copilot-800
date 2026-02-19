from djongo import models


class Team(models.Model):
    _id = models.ObjectIdField()
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.CharField(max_length=50)
    member_count = models.IntegerField(default=0)

    class Meta:
        db_table = 'teams'

    def __str__(self):
        return self.name


class User(models.Model):
    _id = models.ObjectIdField()
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    hero_name = models.CharField(max_length=100)
    team_id = models.CharField(max_length=50)
    team_name = models.CharField(max_length=100)
    joined_at = models.CharField(max_length=50)
    total_points = models.IntegerField(default=0)
    avatar = models.CharField(max_length=10)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f"{self.name} ({self.hero_name})"


class Workout(models.Model):
    _id = models.ObjectIdField()
    name = models.CharField(max_length=100)
    points_per_unit = models.IntegerField()
    unit = models.CharField(max_length=50)

    class Meta:
        db_table = 'workouts'

    def __str__(self):
        return f"{self.name} ({self.points_per_unit} points per {self.unit})"


class Activity(models.Model):
    _id = models.ObjectIdField()
    user_id = models.CharField(max_length=50)
    user_name = models.CharField(max_length=100)
    hero_name = models.CharField(max_length=100)
    team_id = models.CharField(max_length=50)
    team_name = models.CharField(max_length=100)
    workout_type = models.CharField(max_length=100)
    quantity = models.FloatField()
    unit = models.CharField(max_length=50)
    points = models.IntegerField()
    date = models.CharField(max_length=50)
    created_at = models.CharField(max_length=50)

    class Meta:
        db_table = 'activities'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.hero_name} - {self.workout_type} ({self.points} points)"


class Leaderboard(models.Model):
    _id = models.ObjectIdField()
    user_id = models.CharField(max_length=50)
    user_name = models.CharField(max_length=100)
    hero_name = models.CharField(max_length=100)
    team_id = models.CharField(max_length=50)
    team_name = models.CharField(max_length=100)
    total_points = models.IntegerField()
    rank = models.IntegerField()
    avatar = models.CharField(max_length=10)
    last_updated = models.CharField(max_length=50)

    class Meta:
        db_table = 'leaderboard'
        ordering = ['rank']

    def __str__(self):
        return f"#{self.rank} - {self.hero_name} ({self.total_points} points)"
