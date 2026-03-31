from pathlib import Path

from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from django.views.static import serve

FRONTEND_DIR = Path(settings.BASE_DIR) / "frontend"

urlpatterns = [
    # Frontend static pages (development convenience).
    path("", serve, {"path": "index.html", "document_root": str(FRONTEND_DIR)}),
    path("index.html", serve, {"path": "index.html", "document_root": str(FRONTEND_DIR)}),
    path(
        "dashboard.html",
        serve,
        {"path": "dashboard.html", "document_root": str(FRONTEND_DIR)},
    ),
    path(
        "feed.html",
        serve,
        {"path": "feed.html", "document_root": str(FRONTEND_DIR)},
    ),
    path("js/<path:path>", serve, {"document_root": str(FRONTEND_DIR / "js")}),
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/posts/', include('posts.urls')),
    path('api/academics/', include('academics.urls')),
    path('api/bot/', include('bot.urls')),
]