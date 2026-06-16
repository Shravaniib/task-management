from django.urls import path
from .views import get_tasks, task_detail

urlpatterns = [
    path('', get_tasks),
    path('<int:pk>/', task_detail),
]