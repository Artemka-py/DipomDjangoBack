from django.db import models
from rest_framework import serializers
from rest_framework import fields

from ..models import Organisations, Projects, Tasks, Users

class ProjectSerializer(serializers.ModelSerializer):

  class Meta:
    model = Projects
    fields = '__all__'


class TasksSerializer(serializers.ModelSerializer):

  class Meta:
    model = Tasks
    fields = '__all__'


class UsersSerializer(serializers.ModelSerializer):

  class Meta:
    model = Users
    fields = '__all__'


class OrganisationsSerializer(serializers.ModelSerializer):

  class Meta:
    model = Organisations
    fields = '__all__'
