from django.db import connection
from django.http.response import HttpResponse
from .models import Projects
from django.shortcuts import render
from rest_framework import serializers

def index(req):
    return render(req, 'index.html', {})

def dict_fetch_all(cursor):
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

class ProjectsSerializer(serializers.Serializer):
    project_id = serializers.IntegerField()
    project_name = serializers.CharField(max_length=255)

import json

def projects(req, username):
    with connection.cursor() as cursor:
        cursor.execute(''' select project_id, project_name from projects inner join workgroups on
        projects.project_workgroup_id = workgroups.workgroup_id
        left join working_developer_list on workgroups.workgroup_id = working_developer_list.workgroup_id
        inner join clients on projects.project_client_login = clients.client_login
        inner JOIN managers on projects.project_manager_login = managers.manager_login
        where client_login = %s or manager_login = %s or developer_login = %s  ''', [username, username, username])

        data = dict_fetch_all(cursor)
        data = json.dumps(data)

    return HttpResponse(data, content_type="application/json")

    
