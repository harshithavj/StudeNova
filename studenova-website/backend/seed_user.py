from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.student import StudentProfile

app = create_app()

with app.app_context():
    existing_user = User.query.filter_by(email="vvce24cse0520@vvce.ac.in").first()
    if existing_user:
        existing_user.name = "Harshitha VJ"
        existing_user.set_password("Password123")
        
        # Ensure student profile exists
        profile = StudentProfile.query.filter_by(user_id=existing_user.id).first()
        if not profile:
            profile = StudentProfile(
                user_id=existing_user.id,
                department="Computer Science and Engineering",
                academic_year="3rd Year",
                participation_streak=10
            )
            db.session.add(profile)
        db.session.commit()
        print("Updated student Harshitha VJ successfully with password: Password123")
    else:
        print("Student user not found.")
