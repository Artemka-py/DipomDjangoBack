from django.http import response
from rest_framework import viewsets
from rest_framework.views import APIView

from .serializers import OrganisationsSerializer, ProjectSerializer, TasksSerializer, UsersSerializer
from ..models import Organisations, Projects, Tasks, Users

class ProjectsViewSet(viewsets.ModelViewSet):

  queryset = Projects.objects.all()
  serializer_class = ProjectSerializer


class TasksViewSet(viewsets.ModelViewSet):

  queryset = Tasks.objects.all()
  serializer_class = TasksSerializer


class UsersViewSet(viewsets.ModelViewSet):

  queryset = Users.objects.all()
  serializer_class = UsersSerializer


class OrganizationsViewSet(viewsets.ModelViewSet):

  queryset = Organisations.objects.all()
  serializer_class = OrganisationsSerializer
