from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StationViewSet, RouteViewSet, TicketViewSet, UserRegistrationView, calculate_ticket_cost, UpdateProfileView
from .views import RequestPasswordResetView, PasswordResetView
router = DefaultRouter()
router.register(r'stations', StationViewSet)
router.register(r'routes', RouteViewSet)
router.register(r'tickets', TicketViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('calculate-ticket-cost/', calculate_ticket_cost, name='calculate-ticket-cost'),
    path('update-profile/', UpdateProfileView.as_view(), name='update-profile'),
   # path('', password_reset_root, name='password-reset-root'),  # ✅ Check if API is live
    path('request-reset/', RequestPasswordResetView.as_view(), name='request-reset'),  # ✅ Request reset email
    path('reset-password/', PasswordResetView.as_view(), name='reset-password'),#Reset password using token

]