from django.db import connection
from django.db.models import Q
from django.http.response import HttpResponse
from .models import Tasks
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

def tasks(req, username):
    data = Tasks.objects.filter(Q(task_developer_login=username) | Q(task_setter_login=username))
    data = serializers.serialize('json', data, fields=('task_id', 'task_name', 'task_stage', 'task_setter_login', 'task_developer_login', 'parent', 'start_date', 'finish_date', 'start_date_fact', 'finish_date_fact', ))

    return HttpResponse(data, content_type="application/json")
    
