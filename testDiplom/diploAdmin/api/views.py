from django.http import response
from rest_framework import viewsets
from rest_framework.views import APIView

from .serializers import ProjectSerializer, TasksSerializer
from ..models import Projects, Tasks

class ProjectsViewSet(viewsets.ModelViewSet):

  queryset = Projects.objects.all()
  serializer_class = ProjectSerializer


class TasksViewSet(viewsets.ModelViewSet):

  queryset = Tasks.objects.all()
  serializer_class = TasksSerializer
