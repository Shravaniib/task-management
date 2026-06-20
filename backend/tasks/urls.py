from django.urls import path
from .views import (
    get_tasks,
    task_detail,
    register_user,
    user_profile
)

urlpatterns = [
    path('', get_tasks),
    path('<int:pk>/', task_detail),
    path('register/', register_user),
    path('profile/', user_profile),
]