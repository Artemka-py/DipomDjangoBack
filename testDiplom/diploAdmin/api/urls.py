from django.db import router
from django.urls import path

from rest_framework import routers
from .views import ProjectsViewSet

router = routers.SimpleRouter()
router.register('projects', ProjectsViewSet, basename='projects')

urlpatterns = [] + router.urls