from django.db import router
from django.urls import path
from django.urls.resolvers import URLPattern
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework import routers
from .views import ProjectsViewSet, TasksViewSet

router = routers.SimpleRouter()
router.register('projects', ProjectsViewSet, basename='projects')
router.register('tasks', TasksViewSet, basename='tasks')

urlpatterns = [] + router.urls