from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls import url
from diploAdmin.views import index, projects, tasks, clients, projects_id, project_check_rights, workgroup_developers, project_with_orgs, developers_in_project, tasks_project, error, statstic, verify_email
from django.db import connections
from django.db.utils import OperationalError

connected = True
db_conn = connections['default']
try:
    c = db_conn.cursor()
except OperationalError:
    connected = False
else:
    connected = True

if (connected == False):
    urlpatterns = [
        path(r'*', error)
    ]
else:
    urlpatterns = [
        path('admin/', admin.site.urls),
        path('api/', include('diploAdmin.api.urls')),
        path('project-login/<str:username>/', projects),
        path('project-orgs/<int:project_id>/', project_with_orgs),
        path('project-check-rights/<str:manager_login>/<int:project_id>/', project_check_rights),
        path('projects_id-login/<str:username>/', projects_id),
        path('developers-in/<int:work_id>/', developers_in_project),
        path('tasks-login/<str:username>/', tasks),
        path('tasks-projects/<int:id>/', tasks_project),
        path('client-org/<int:org_id>/', clients),
        path('workgroup-developers/<int:project_id>/', workgroup_developers),
        path('rest-auth/', include('rest_auth.urls')),
        path('statistic/<int:id>/', statstic),
        path('api-auth/', include('rest_framework.urls')),
        path('rest-auth/registration/', include('rest_auth.registration.urls')),
        path('verify-email/<str:username>/', verify_email),
        path(r'^', index),
        path(r'tasks', index),
        path(r'projects', index),
        path(r'about', index),
        re_path(r'^project-detail/', index),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


