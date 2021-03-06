from rest_framework import serializers
from rest_framework import fields

from ..models import Projects

class ProjectSerializer(serializers.ModelSerializer):

  class Meta:
    model = Projects
    fields = '__all__'