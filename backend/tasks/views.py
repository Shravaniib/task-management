from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Task, Profile
from .serializers import TaskSerializer
from .user_serializer import UserSerializer
from tasks.models import Profile



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def get_tasks(request):

    if request.method == 'GET':
        tasks = Task.objects.filter(user=request.user)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TaskSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def task_detail(request, pk):

    try:
        task = Task.objects.get(
            id=pk,
            user=request.user
        )
    except Task.DoesNotExist:
        return Response(
            {"error": "Task not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TaskSerializer(
            task,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    elif request.method == 'DELETE':
        task.delete()
        return Response(
            {"message": "Task deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):


    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():

        user = serializer.save()

        profile = Profile.objects.get(user=user)

        profile.avatar = request.data.get("profile_picture")

        profile.save()

        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

    

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):

    profile, created = Profile.objects.get_or_create(
        user=request.user
    )

    return Response({
        "username": request.user.username,
        "email": request.user.email,
        "profile_picture":
            profile.profile_picture.url
            if profile.profile_picture
            else None,
        "avatar": profile.avatar
    })