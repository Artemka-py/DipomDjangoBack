from django.http import response
from rest_framework import viewsets
from rest_framework.views import APIView

from .serializers import ClientsSerializer, OrganisationsSerializer, ProjectSerializer, StatusSerializer, TasksSerializer, UsersSerializer, WorkgroupsSerializer, WorkingDeveloperListSerializer
from ..models import Clients, Organisations, Projects, Status, Tasks, Users, Workgroups, WorkingDeveloperList

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


class StatusViewSet(viewsets.ModelViewSet):

  queryset = Status.objects.all()
  serializer_class = StatusSerializer


class ClientsViewSet(viewsets.ModelViewSet):

  queryset = Clients.objects.all()
  serializer_class = ClientsSerializer


class WorkgroupsViewSet(viewsets.ModelViewSet):

  queryset = Workgroups.objects.all()
  serializer_class = WorkgroupsSerializer


class WorkingDeveloperListViewSet(viewsets.ModelViewSet):

  queryset = WorkingDeveloperList.objects.all()
  serializer_class = WorkingDeveloperListSerializer