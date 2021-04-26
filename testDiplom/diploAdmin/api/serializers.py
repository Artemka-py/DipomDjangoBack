from django.db import models
from rest_framework import serializers
from rest_framework import fields

from ..models import Clients, Documents, Organisations, Projects, Status, Tasks, Users, Workgroups, WorkingDeveloperList, Managers

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


class StatusSerializer(serializers.ModelSerializer):

  class Meta:
    model = Status
    fields = '__all__'


class ClientsSerializer(serializers.ModelSerializer):

  class Meta:
    model = Clients
    fields = '__all__'


class WorkgroupsSerializer(serializers.ModelSerializer):

  class Meta:
    model = Workgroups
    fields = '__all__'


class WorkingDeveloperListSerializer(serializers.ModelSerializer):

  class Meta:
    model = WorkingDeveloperList
    fields = '__all__'


class DocsSerializer(serializers.ModelSerializer):

  class Meta:
    model = Documents
    fields = '__all__'


class ManagerSerializer(serializers.ModelSerializer):

  class Meta:
    model = Managers
    fields = '__all__'
