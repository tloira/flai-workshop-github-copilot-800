from django.core.management.base import BaseCommand
from pymongo import MongoClient, ASCENDING
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        # Connect to MongoDB
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']

        self.stdout.write(self.style.SUCCESS('Connected to MongoDB'))

        # Delete existing data
        self.stdout.write('Deleting existing data...')
        db.users.delete_many({})
        db.teams.delete_many({})
        db.activities.delete_many({})
        db.leaderboard.delete_many({})
        db.workouts.delete_many({})
        self.stdout.write(self.style.SUCCESS('Existing data deleted'))

        # Create unique index on email field for users collection
        db.users.create_index([("email", ASCENDING)], unique=True)
        self.stdout.write(self.style.SUCCESS('Created unique index on email field'))

        # Create Teams
        teams_data = [
            {
                "name": "Team Marvel",
                "description": "Earth's Mightiest Heroes",
                "created_at": datetime.now().isoformat(),
                "member_count": 0
            },
            {
                "name": "Team DC",
                "description": "Justice League United",
                "created_at": datetime.now().isoformat(),
                "member_count": 0
            }
        ]
        teams_result = db.teams.insert_many(teams_data)
        team_marvel_id = str(teams_result.inserted_ids[0])
        team_dc_id = str(teams_result.inserted_ids[1])
        self.stdout.write(self.style.SUCCESS(f'Created {len(teams_data)} teams'))

        # Create Users (Superheroes)
        users_data = [
            # Team Marvel
            {
                "name": "Tony Stark",
                "email": "ironman@marvel.com",
                "hero_name": "Iron Man",
                "team_id": team_marvel_id,
                "team_name": "Team Marvel",
                "joined_at": datetime.now().isoformat(),
                "total_points": 0,
                "avatar": "🦾"
            },
            {
                "name": "Steve Rogers",
                "email": "cap@marvel.com",
                "hero_name": "Captain America",
                "team_id": team_marvel_id,
                "team_name": "Team Marvel",
                "joined_at": datetime.now().isoformat(),
                "total_points": 0,
                "avatar": "🛡️"
            },
            {
                "name": "Natasha Romanoff",
                "email": "blackwidow@marvel.com",
                "hero_name": "Black Widow",
                "team_id": team_marvel_id,
                "team_name": "Team Marvel",
                "joined_at": datetime.now().isoformat(),
                "total_points": 0,
                "avatar": "🕷️"
            },
            {
                "name": "Bruce Banner",
                "email": "hulk@marvel.com",
                "hero_name": "Hulk",
                "team_id": team_marvel_id,
                "team_name": "Team Marvel",
                "joined_at": datetime.now().isoformat(),
                "total_points": 0,
                "avatar": "💚"
            },
            {
                "name": "Thor Odinson",
                "email": "thor@marvel.com",
                "hero_name": "Thor",
                "team_id": team_marvel_id,
                "team_name": "Team Marvel",
                "joined_at": datetime.now().isoformat(),
                "total_points": 0,
                "avatar": "⚡"
            },
            # Team DC
            {
                "name": "Clark Kent",
                "email": "superman@dc.com",
                "hero_name": "Superman",
                "team_id": team_dc_id,
                "team_name": "Team DC",
                "joined_at": datetime.now().isoformat(),
                "total_points": 0,
                "avatar": "🦸"
            },
            {
                "name": "Bruce Wayne",
                "email": "batman@dc.com",
                "hero_name": "Batman",
                "team_id": team_dc_id,
                "team_name": "Team DC",
                "joined_at": datetime.now().isoformat(),
                "total_points": 0,
                "avatar": "🦇"
            },
            {
                "name": "Diana Prince",
                "email": "wonderwoman@dc.com",
                "hero_name": "Wonder Woman",
                "team_id": team_dc_id,
                "team_name": "Team DC",
                "joined_at": datetime.now().isoformat(),
                "total_points": 0,
                "avatar": "👸"
            },
            {
                "name": "Barry Allen",
                "email": "flash@dc.com",
                "hero_name": "The Flash",
                "team_id": team_dc_id,
                "team_name": "Team DC",
                "joined_at": datetime.now().isoformat(),
                "total_points": 0,
                "avatar": "⚡"
            },
            {
                "name": "Arthur Curry",
                "email": "aquaman@dc.com",
                "hero_name": "Aquaman",
                "team_id": team_dc_id,
                "team_name": "Team DC",
                "joined_at": datetime.now().isoformat(),
                "total_points": 0,
                "avatar": "🔱"
            }
        ]
        users_result = db.users.insert_many(users_data)
        user_ids = [str(uid) for uid in users_result.inserted_ids]
        self.stdout.write(self.style.SUCCESS(f'Created {len(users_data)} users'))

        # Update team member counts
        db.teams.update_one(
            {"_id": teams_result.inserted_ids[0]},
            {"$set": {"member_count": 5}}
        )
        db.teams.update_one(
            {"_id": teams_result.inserted_ids[1]},
            {"$set": {"member_count": 5}}
        )

        # Create Workouts
        workout_types = [
            {"name": "Running", "points_per_unit": 10, "unit": "km"},
            {"name": "Cycling", "points_per_unit": 5, "unit": "km"},
            {"name": "Swimming", "points_per_unit": 20, "unit": "km"},
            {"name": "Push-ups", "points_per_unit": 1, "unit": "reps"},
            {"name": "Pull-ups", "points_per_unit": 2, "unit": "reps"},
            {"name": "Squats", "points_per_unit": 1, "unit": "reps"},
            {"name": "Yoga", "points_per_unit": 15, "unit": "minutes"},
            {"name": "Weight Training", "points_per_unit": 10, "unit": "minutes"},
        ]
        workouts_result = db.workouts.insert_many(workout_types)
        self.stdout.write(self.style.SUCCESS(f'Created {len(workout_types)} workout types'))

        # Create Activities
        activities_data = []
        base_date = datetime.now() - timedelta(days=30)
        
        for i, user_id in enumerate(user_ids):
            user = users_data[i]
            # Each user logs 5-10 random activities
            num_activities = random.randint(5, 10)
            user_points = 0
            
            for j in range(num_activities):
                workout = random.choice(workout_types)
                days_ago = random.randint(0, 30)
                activity_date = base_date + timedelta(days=days_ago)
                
                # Random quantity based on workout type
                if workout["unit"] == "km":
                    quantity = round(random.uniform(1, 15), 2)
                elif workout["unit"] == "reps":
                    quantity = random.randint(10, 100)
                else:  # minutes
                    quantity = random.randint(15, 90)
                
                points = int(quantity * workout["points_per_unit"])
                user_points += points
                
                activity = {
                    "user_id": user_id,
                    "user_name": user["name"],
                    "hero_name": user["hero_name"],
                    "team_id": user["team_id"],
                    "team_name": user["team_name"],
                    "workout_type": workout["name"],
                    "quantity": quantity,
                    "unit": workout["unit"],
                    "points": points,
                    "date": activity_date.isoformat(),
                    "created_at": activity_date.isoformat()
                }
                activities_data.append(activity)
            
            # Update user total points
            db.users.update_one(
                {"email": user["email"]},
                {"$set": {"total_points": user_points}}
            )
        
        if activities_data:
            db.activities.insert_many(activities_data)
            self.stdout.write(self.style.SUCCESS(f'Created {len(activities_data)} activities'))

        # Create Leaderboard entries
        leaderboard_data = []
        for i, user_id in enumerate(user_ids):
            user = db.users.find_one({"_id": users_result.inserted_ids[i]})
            leaderboard_entry = {
                "user_id": user_id,
                "user_name": user["name"],
                "hero_name": user["hero_name"],
                "team_id": user["team_id"],
                "team_name": user["team_name"],
                "total_points": user["total_points"],
                "rank": 0,  # Will be calculated
                "avatar": user["avatar"],
                "last_updated": datetime.now().isoformat()
            }
            leaderboard_data.append(leaderboard_entry)
        
        # Sort by points and assign ranks
        leaderboard_data.sort(key=lambda x: x["total_points"], reverse=True)
        for rank, entry in enumerate(leaderboard_data, start=1):
            entry["rank"] = rank
        
        if leaderboard_data:
            db.leaderboard.insert_many(leaderboard_data)
            self.stdout.write(self.style.SUCCESS(f'Created {len(leaderboard_data)} leaderboard entries'))

        # Calculate and display team totals
        marvel_total = sum(entry["total_points"] for entry in leaderboard_data if entry["team_name"] == "Team Marvel")
        dc_total = sum(entry["total_points"] for entry in leaderboard_data if entry["team_name"] == "Team DC")
        
        self.stdout.write(self.style.SUCCESS('\n=== Database Population Complete ==='))
        self.stdout.write(self.style.SUCCESS(f'Team Marvel Total Points: {marvel_total}'))
        self.stdout.write(self.style.SUCCESS(f'Team DC Total Points: {dc_total}'))
        self.stdout.write(self.style.SUCCESS(f'Leading Team: {"Team Marvel" if marvel_total > dc_total else "Team DC"}'))
        
        client.close()
