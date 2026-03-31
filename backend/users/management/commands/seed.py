from django.core.management.base import BaseCommand
from users.models import User
from posts.models import Post
from academics.models import AcademicRecord, Department
from django.utils import timezone

class Command(BaseCommand):
    help = 'Seeds the database with test data for Campuz.'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing data...')
        User.objects.all().delete()
        Post.objects.all().delete()
        AcademicRecord.objects.all().delete()
        Department.objects.all().delete()
        
        self.stdout.write('Creating Departments...')
        dept_cs = Department.objects.create(name="Computer Science", description="Department of Computer Science and Engineering")
        dept_ec = Department.objects.create(name="Electronics", description="Department of Electronics")
        
        self.stdout.write('Creating Users...')
        
        # 1. Admin
        admin = User.objects.create_superuser('admin', 'admin@campuz.com', 'admin_password')
        admin.role = 'admin'
        admin.save()

        # 2. HOD
        hod_cs = User.objects.create_user('hod_cs', 'hod@campuz.com', 'pwd_hod', role='hod', department='Computer Science')
        dept_cs.hod = hod_cs
        dept_cs.save()

        # 3. Faculty
        faculty = User.objects.create_user('dr_smith', 'faculty@campuz.com', 'pwd_faculty', role='faculty', department='Computer Science')

        # 4. Student
        student = User.objects.create_user(
            'john_doe', 'student@campuz.com', 'pwd_student', 
            role='student', department='Computer Science', enrollment_no='CS2021001'
        )

        self.stdout.write('Creating Academic Records for Student...')
        AcademicRecord.objects.create(
            user=student,
            branch='Computer Science',
            semester=6,
            enrollment_year=2021,
            subjects=[
                {'name': 'Data Structures', 'marks': 85},
                {'name': 'Operating Systems', 'marks': 78},
                {'name': 'Database Management', 'marks': 92}
            ],
            attendance={
                'Data Structures': '85%',
                'Operating Systems': '90%',
                'Database Management': '88%'
            },
            fees={
                'total': 150000,
                'paid': 150000,
                'due': 0,
                'status': 'Paid'
            }
        )

        self.stdout.write('Creating Posts...')
        Post.objects.create(
            title="Mid-term exams schedule released",
            content="The mid-term examinations will commence from the 15th of next month. Check your dashboard for details.",
            type="notice",
            author=admin
        )
        
        Post.objects.create(
            title="Guest Lecture on AI",
            content="Join us for a wonderful guest lecture on Artificial Intelligence by a distinguished professor from IIT.",
            type="event",
            author=faculty,
            likes=12
        )

        Post.objects.create(
            title="Fee payment deadline extended",
            content="The deadline for the 6th-semester fees has been extended by one week.",
            type="announcement",
            author=admin
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded database!'))
        self.stdout.write(self.style.SUCCESS('\nDemo Users Created:'))
        self.stdout.write(self.style.SUCCESS('- Admin: admin@campuz.com / admin_password'))
        self.stdout.write(self.style.SUCCESS('- HOD: hod@campuz.com / pwd_hod'))
        self.stdout.write(self.style.SUCCESS('- Faculty: faculty@campuz.com / pwd_faculty'))
        self.stdout.write(self.style.SUCCESS('- Student: student@campuz.com / pwd_student'))
