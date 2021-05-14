from django.db import router
from django.urls import path
from django.urls.resolvers import URLPattern
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework import routers
from .views import ClientsViewSet, DocsViewSet, ManagersViewSet, OrganizationsViewSet, ProjectsViewSet, StatusViewSet, TasksViewSet, UsersViewSet, WorkgroupsViewSet, WorkingDeveloperListViewSet, DevelopersViewSet, NotesViewSet, IssuesViewSet

router = routers.SimpleRouter()
router.register('projects', ProjectsViewSet, basename='projects')
router.register('tasks', TasksViewSet, basename='tasks')
router.register('users', UsersViewSet, basename='users')
router.register('org', OrganizationsViewSet, basename='org')
router.register('status', StatusViewSet, basename='status')
router.register('clients', ClientsViewSet, basename='clients')
router.register('workg', WorkgroupsViewSet, basename='workg')
router.register('workdl', WorkingDeveloperListViewSet, basename='workdl')
router.register('docs', DocsViewSet, basename='docs')
router.register('man', ManagersViewSet, basename='man')
router.register('dev', DevelopersViewSet, basename='developers')
router.register('notes', NotesViewSet, basename='notes')
router.register('issues', IssuesViewSet, basename='issues')

urlpatterns = [] + router.urls