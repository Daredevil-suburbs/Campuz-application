from rest_framework import serializers
from .models import User
from academics.models import AcademicRecord

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'department', 
                  'enrollment_no', 'phone', 'profile_picture', 'created_at']
        read_only_fields = ['created_at']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'department', 
                  'enrollment_no', 'phone']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserDetailSerializer(serializers.ModelSerializer):
    academic_record = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'department', 
                  'enrollment_no', 'phone', 'profile_picture', 
                  'created_at', 'academic_record']
    
    def get_academic_record(self, obj):
        if hasattr(obj, 'academic_record'):
            from academics.serializers import AcademicRecordSerializer
            return AcademicRecordSerializer(obj.academic_record).data
        return None