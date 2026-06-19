from django.test import TestCase
from rest_framework.test import APIClient
from .models import Task


class TaskModelTest(TestCase):

    def test_task_creation(self):
        task = Task.objects.create(
            title="Test Task",
            description="Test Description",
            status="Pending"
        )

        self.assertEqual(task.title, "Test Task")
        self.assertEqual(task.status, "Pending")


class TaskAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_get_tasks(self):
        Task.objects.create(
            title="API Test",
            description="Testing API",
            status="Pending"
        )

        response = self.client.get('/api/tasks/')

        self.assertEqual(response.status_code, 200)