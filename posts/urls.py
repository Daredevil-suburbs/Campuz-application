from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostListView.as_view(), name='post-list'),
    path('<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
    path('<int:post_id>/comments/', views.CommentView.as_view(), name='comments'),
    path('<int:post_id>/like/', views.LikeView.as_view(), name='like'),
]