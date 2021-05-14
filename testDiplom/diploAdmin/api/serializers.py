from django.db import models
from rest_framework import serializers
from rest_framework import fields

from ..models import Clients, Documents, Issues, Notes, Organisations, Projects, Status, Tasks, Users, Workgroups, WorkingDeveloperList, Managers, Developers, Notes

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


class DevelopersSerializer(serializers.ModelSerializer):

  class Meta:
    model = Developers
    fields = '__all__'

class NotesSerializer(serializers.ModelSerializer):

  class Meta:
    model = Notes
    fields = '__all__'

class IssuesSerializer(serializers.ModelSerializer):

  class Meta:
    model = Issues
    fields = '__all__'
