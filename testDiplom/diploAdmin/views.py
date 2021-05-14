from django.db import connection
from django.db.models import Q
from django.http.response import HttpResponse
from .models import Clients, Issues, Projects, Tasks, Users, Notes
from django.shortcuts import render
from django.core import serializers
from django.core.mail import send_mail
import random
from mixpanel import Mixpanel

mp = Mixpanel('087836e72b7918aa48ee6cee520596da')

def error(req):
    return render(req, 'error.html', {})

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
        cursor.execute(''' select distinct project_id, project_name, project_info, start_date_plan, finish_date_plan,
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

    mp.track(username, 'Take the projects')

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

    mp.track(username, 'Take the project detail')

    return HttpResponse(data, content_type="application/json")

def tasks(req, username):
    with connection.cursor() as cursor:
        cursor.execute('''select task_id, task_name, task_status_id, task_setter_login_id, task_developer_login, parent_id,
        start_date, finish_date, description, project_task_id, p2.project_name 
        from tasks t2 inner join projects p2 on p2.project_id = t2.project_task_id 
        where t2.task_setter_login_id = %s or t2.task_developer_login = %s''', [username, username])

        data = dict_fetch_all(cursor)
        data = JSONRenderer().render(data)
    
    mp.track(username, 'Take the tasks')

    return HttpResponse(data, content_type="application/json")
    

def clients(req, org_id):
    data = Clients.objects.filter(client_organisation=org_id).all()
    data = serializers.serialize('json', data, fields=())
    
    mp.track(org_id, 'Take the clients')

    return HttpResponse(data, content_type="application/json")

def workgroup_developers(req, project_id):
    with connection.cursor() as cursor:
        cursor.execute('''select developer_login from working_developer_list wdl 
        inner join projects p2 on p2.project_workgroup_id = wdl.workgroup_id 
        where project_id = %s''', [project_id])

        data = dict_fetch_all(cursor)
        data = JSONRenderer().render(data)
    
    mp.track(project_id, 'Take the workgroup developers')

    return HttpResponse(data, content_type="application/json")


def project_with_orgs(req, project_id):
    with connection.cursor() as cursor:
        cursor.execute('''select * from projects inner JOIN clients c on projects.project_client_login = c.client_login inner join organisations o on c.client_organisation_id = o.organisation_id inner join status s on projects.project_status_id = s.status_id where project_id = %s''', [project_id])

        data = dict_fetch_all(cursor)
        data = JSONRenderer().render(data)

    return HttpResponse(data, content_type="application/json")


def developers_in_project(req, work_id):
    with connection.cursor() as cursor:
        cursor.execute('''select * from working_developer_list where workgroup_id = %s''', [work_id])

        data = dict_fetch_all(cursor)
        data = JSONRenderer().render(data)

    return HttpResponse(data, content_type="application/json")


def tasks_project(req, id):
    data = Tasks.objects.filter(project_task_id = id)
    data = serializers.serialize('json', data, fields=('task_id', 'task_name', 'task_stage', 'task_setter_login', 'task_developer_login', 'parent', 'start_date', 'finish_date', 'start_date_fact', 'finish_date_fact', 'task_status',))

    mp.track(id, 'Take the tasks project')

    return HttpResponse(data, content_type="application/json")


def statstic(req, id):
    with connection.cursor() as cursor:
        cursor.execute(''' select count(*) as "inProgress", (select count(*) from tasks where project_task_id = %s) as "allCount" from tasks where project_task_id = %s and now() between start_date and finish_date ''', [id, id])

        data = dict_fetch_all(cursor)
        data = JSONRenderer().render(data)

    mp.track(id, 'Take the statistic')

    return HttpResponse(data, content_type="application/json")


def verify_email(req, username):
    key = random.randint(100000, 99999999)

    subject = 'Подтверждение аккаунта'
    sender_from = 'i_a.n.litkin@mpt.ru'
    message = 'Код для подтверждения:' + str(key) + '.'

    user = Users.objects.filter(username = username)
    recipients = [str(user[0].email)]
    
    mp.track(username, 'Verifying email')
    send_mail(subject, message, sender_from, recipients)
    return HttpResponse(key, content_type="application/json")

def task_comments(req,task_id):
    data = Notes.objects.filter(note_task_id = task_id)
    data = serializers.serialize('json', data)

    return HttpResponse(data, content_type="application/json")

def task_issues(req, task_id):
    data = Issues.objects.filter(issue_task = task_id)
    data = serializers.serialize('json', data)

    return HttpResponse(data, content_type="application/json")
