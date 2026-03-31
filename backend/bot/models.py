from djongo import models
from users.models import User
from django.utils import timezone

class ChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_messages')
    message = models.TextField()
    response = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'chat_messages'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.user.username}: {self.message[:50]}"

class FAQ(models.Model):
    question = models.TextField()
    answer = models.TextField()
    category = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'faqs'
    
    def __str__(self):
        return self.question[:50]