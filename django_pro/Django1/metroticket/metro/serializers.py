from rest_framework import serializers
from .models import Station, Route, Ticket, Profile
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
#from .models import PasswordResetToken
from metro.models import PasswordResetToken


class StationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = '__all__'

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    age = serializers.IntegerField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'age']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Extract age from validated data
        age = validated_data.pop('age')

        # Create the user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )

        # Create the profile with age
        Profile.objects.create(user=user, age=age)

        return user

    def update(self, instance, validated_data):
        # Handle password update
        if 'password' in validated_data:
            # Hash the password before saving
            validated_data['password'] = make_password(validated_data['password'])

        # Update other fields
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.password=validated_data.get('password', instance.password)
        instance.save()

        return instance
    


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user found with this email address.")
        return value

class PasswordResetSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    new_password = serializers.CharField(write_only=True, min_length=6)

    def validate_token(self, value):
        try:
            reset_token = PasswordResetToken.objects.get(token=value)
            if not reset_token.is_valid():
                raise serializers.ValidationError("Token has expired.")
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError("Invalid token.")
        return value
