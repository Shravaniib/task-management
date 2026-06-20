# profile_serializer.py

from rest_framework import serializers
from .models import Profile

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    avatar = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    profile_picture = models.ImageField(
        upload_to="profile_pics/",
        blank=True,
        null=True
    )