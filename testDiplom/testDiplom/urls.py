from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from diploAdmin.views import index, projects, tasks, clients, projects_id, project_check_rights


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index),
    path('api/', include('diploAdmin.api.urls')),
    path('project-login/<str:username>/', projects),
    path('project-check-rights/<str:manager_login>/<int:project_id>/', project_check_rights),
    path('projects_id-login/<str:username>/', projects_id),
    path('tasks-login/<int:id>/', tasks),
    path('client-org/<int:org_id>/', clients),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    path('api-auth/', include('rest_framework.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


