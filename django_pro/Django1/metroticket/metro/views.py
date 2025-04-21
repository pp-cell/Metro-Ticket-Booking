from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Station, Route, Ticket, Profile
from .serializers import StationSerializer, RouteSerializer, TicketSerializer

from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework import status
from .serializers import UserSerializer
from django.http import JsonResponse
from .utils import build_station_graph, dijkstra_shortest_path
from decimal import Decimal
from django.contrib.auth.models import User
from django.core.mail import send_mail
import uuid
#from .models import PasswordResetToken
from metro.models import PasswordResetToken



class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.all()
    serializer_class = StationSerializer

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def book_ticket(self, request):
        route_id = request.data.get('route_id')
        travel_date = request.data.get('travel_date')
        route = Route.objects.get(id=route_id)
        ticket = Ticket.objects.create(user=request.user, route=route, travel_date=travel_date)
        return Response({'message': 'Ticket booked successfully!', 'ticket_id': ticket.id})

    @action(detail=True, methods=['post'])
    def process_payment(self, request, pk=None):
        ticket = self.get_object()
        try:
            payment_intent = stripe.PaymentIntent.create(
                amount=int(ticket.route.price * 100),  
                currency='usd',
                payment_method_types=['card'],
            )
            ticket.payment_status = True
            ticket.save()
            return Response({'client_secret': payment_intent.client_secret})
        except Exception as e:
            return Response({'error': str(e)}, status=400)
        

class UserRegistrationView(APIView):
    def post(self, request):
        email = request.data.get("email")  # Get email from request data
        if User.objects.filter(email=email).exists():  # Check if email already exists
            return Response({"message": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def calculate_ticket_cost(request):
    start = request.GET.get('start') # Source station ID
    end = request.GET.get('end')        # Destination station ID
    age = int(request.GET.get('age'))
    
    if not start or not end:
        return JsonResponse({"error": "Please provide start and end station IDs."}, status=400)
    
    graph = build_station_graph()
    total_cost, path = dijkstra_shortest_path(graph, int(start), int(end))
    
    if age < 6:
        discount = Decimal(0.10)  # 10% discount
    elif age > 60:
        discount = Decimal(0.15)  # 15% discount
    else:
        discount = 0  # No discount
        
    discounted_cost = round((Decimal(total_cost)) * (1 - discount))
    
    if total_cost == float('inf'):
        return JsonResponse({"error": "No path found."}, status=404)
    
    return JsonResponse({
        "total_cost": total_cost,
        "discount": discount,
        "cost_after_discount": discounted_cost,
        "path": path,
    })
    
class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def put(self, request, *args, **kwargs):
        user = request.user  # Get the logged-in user
        user_obj = User.objects.get(id=user.id)
        data = {}
        for key, value in request.data.items():  # Use .items() to iterate over key-value pairs
            if value:  # Check if the value is non-empty
                data[key] = value
        # Serialize the user data
        serializer = UserSerializer(user_obj, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()

            # Update the profile if age is provided
            if 'age' in request.data:
                profile = Profile.objects.get(user_id=user.id)
                profile.age = request.data['age']
                profile.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RequestPasswordResetView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        # Generate token
        token = str(uuid.uuid4())
        PasswordResetToken.objects.create(user=user, token=token)
        # Send email
        send_mail(
            "Password Reset Request",
            f"Use this token to reset your password:{token}",
            "noreply@example.com",
            [email],
            fail_silently=False,
        )

        return Response({"message": "Password reset token sent to email."}, status=status.HTTP_200_OK)

class PasswordResetView(APIView):
    def post(self, request):
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not token or not new_password:
            return Response({"error": "Token and new password are required."}, status=status.HTTP_400_BAD_REQUEST)

        reset_token = PasswordResetToken.objects.filter(token=token).first()
        if not reset_token:
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        # Reset password
        user = reset_token.user
        user.set_password(new_password)
        user.save(update_fields=["password"])

        # Delete the token
        reset_token.delete()

        return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)


        
           