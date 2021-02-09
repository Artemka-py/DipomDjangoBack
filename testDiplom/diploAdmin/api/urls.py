from django.db import router
from django.urls import path

from rest_framework import routers
from .views import UsersViewSet

router = routers.SimpleRouter()
router.register('users', UsersViewSet, basename='users')

urlpatterns = [
  
] + router.urls