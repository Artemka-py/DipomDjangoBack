from django.db import connection
from django.db.models import Q
from django.http.response import HttpResponse
from .models import Clients, Projects, Tasks
from django.shortcuts import render
from django.core import serializers

def index(req):
    return render(req, 'index.html', {})

def dict_fetch_all(cursor):
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

import json

from rest_framework import fields, serializers as ser
from rest_framework.renderers import JSONRenderer

class CommentSerializer(ser.Serializer):
    email = ser.EmailField()
    content = ser.CharField(max_length=200)
    created = ser.DateTimeField()

def projects(req, username):
    with connection.cursor() as cursor:
        cursor.execute(''' select project_id, project_name, project_info, start_date_plan, finish_date_plan,
        start_date_fact, finish_date_fact, status.status_name, workgroups.workgroup_name 
        from projects inner join workgroups on
        projects.project_workgroup_id = workgroups.workgroup_id
        left join working_developer_list on workgroups.workgroup_id = working_developer_list.workgroup_id
        inner join clients on projects.project_client_login = clients.client_login
        inner JOIN managers on projects.project_manager_login = managers.manager_login
        inner JOIN status on projects.project_status_id = status.status_id
        where client_login = %s or manager_login = %s or developer_login = %s  ''', [username, username, username])

        data = dict_fetch_all(cursor)
        data = JSONRenderer().render(data)

    return HttpResponse(data, content_type="application/json")


def project_check_rights(_, manager_login, project_id):
    data = Projects.objects.filter(project_id=project_id, project_manager_login=manager_login).count()

    return HttpResponse(data, content_type="application/json")


def projects_id(req, username):
    with connection.cursor() as cursor:
        cursor.execute(''' select project_id
        from projects inner join workgroups on
        projects.project_workgroup_id = workgroups.workgroup_id
        left join working_developer_list on workgroups.workgroup_id = working_developer_list.workgroup_id
        inner join clients on projects.project_client_login = clients.client_login
        inner JOIN managers on projects.project_manager_login = managers.manager_login
        inner JOIN status on projects.project_status_id = status.status_id
        where client_login = %s or manager_login = %s or developer_login = %s  ''', [username, username, username])

        data = dict_fetch_all(cursor)
        data = JSONRenderer().render(data)

    return HttpResponse(data, content_type="application/json")

def tasks(req, id):
    data = Tasks.objects.filter(pk=id)
    data = serializers.serialize('json', data, fields=('task_id', 'task_name', 'task_stage', 'task_setter_login', 'task_developer_login', 'parent', 'start_date', 'finish_date', 'start_date_fact', 'finish_date_fact', ))

    return HttpResponse(data, content_type="application/json")
    

def clients(req, org_id):
    data = Clients.objects.filter(client_organisation=org_id).all()
    data = serializers.serialize('json', data, fields=())
    
    return HttpResponse(data, content_type="application/json")
