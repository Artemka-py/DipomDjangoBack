from django.db import models
from rest_framework import serializers
from rest_framework import fields

from ..models import Projects, Tasks

class ProjectSerializer(serializers.ModelSerializer):

  class Meta:
    model = Projects
    fields = '__all__'


class TasksSerializer(serializers.ModelSerializer):

  class Meta:
    model = Tasks
    fields = '__all__'
