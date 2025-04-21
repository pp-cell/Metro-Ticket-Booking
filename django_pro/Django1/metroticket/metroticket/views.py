from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from metro.serializers import UserSerializer  # Import the UserSerializer
from metro.models import Profile

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        # Authenticate the user
        user = authenticate(username=username, password=password)

        if user is None:
            return Response({"detail": "Incorrect password or username."}, status=status.HTTP_400_BAD_REQUEST)

        # If authentication is successful, generate tokens
        token_response = super().post(request, *args, **kwargs)

        # Serialize the user details
        user_serializer = UserSerializer(user)
        
        # Fetch the Profile object using the user_id
        try:
            profile = Profile.objects.get(user_id=user.id)
            age = profile.age  # Get the age from the Profile object
        except Profile.DoesNotExist:
            age = None  # Default value if profile doesn't exist

        # Add user details to the token response
        token_response.data['user'] = user_serializer.data
        token_response.data['user']['age'] = age  # Add the age property


        return token_response