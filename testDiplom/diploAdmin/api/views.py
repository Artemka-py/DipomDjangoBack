from rest_framework import viewsets

from .serializers import ProjectSerializer
from ..models import Projects

class ProjectsViewSet(viewsets.ModelViewSet):

  # Projects.objects.filter(Q(project_client_login='test2') | Q(project_manager_login='test2'))
  queryset = Projects.objects.all()
  serializer_class = ProjectSerializer
