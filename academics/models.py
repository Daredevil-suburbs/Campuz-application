from djongo import models
from users.models import User

class AcademicRecord(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='academic_record')
    branch = models.CharField(max_length=100)
    semester = models.IntegerField()
    enrollment_year = models.IntegerField()
    subjects = models.JSONField(default=list)  # List of subjects with marks
    attendance = models.JSONField(default=dict)  # Subject-wise attendance
    fees = models.JSONField(default=dict)  # Fee details
    
    class Meta:
        db_table = 'academic_records'
    
    def __str__(self):
        return f"{self.user.username} - {self.branch}"

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    hod = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='department_managed')
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'departments'
    
    def __str__(self):
        return self.name