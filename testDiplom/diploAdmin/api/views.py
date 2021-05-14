from django.http import response
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import ClientsSerializer, DocsSerializer, ManagerSerializer, OrganisationsSerializer, ProjectSerializer, StatusSerializer, TasksSerializer, UsersSerializer, WorkgroupsSerializer, WorkingDeveloperListSerializer, DevelopersSerializer, NotesSerializer, IssuesSerializer
from ..models import Clients, Documents, Issues, Managers, Notes, Organisations, Projects, Status, Tasks, Users, Workgroups, WorkingDeveloperList, Developers

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


class DocsViewSet(viewsets.ModelViewSet):

  queryset = Documents.objects.all()
  serializer_class = DocsSerializer


class ManagersViewSet(viewsets.ModelViewSet):

  queryset = Managers.objects.all()
  serializer_class = ManagerSerializer


class DevelopersViewSet(viewsets.ModelViewSet):

  queryset = Developers.objects.all()
  serializer_class = DevelopersSerializer

class NotesViewSet(viewsets.ModelViewSet):

  queryset = Notes.objects.all()
  serializer_class = NotesSerializer

class IssuesViewSet(viewsets.ModelViewSet):

  queryset = Issues.objects.all()
  serializer_class = IssuesSerializer
