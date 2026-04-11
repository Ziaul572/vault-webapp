from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import api_views
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

router = DefaultRouter()
router.register(r'accounts', api_views.BankAccountViewSet, basename='account')
router.register(r'transactions', api_views.TransactionViewSet, basename='transaction')
router.register(r'loans', api_views.LoanViewSet, basename='loan')

urlpatterns = [
    path('', include(router.urls)),
    path('profile/', api_views.UserProfileView.as_view(), name='profile-api'),
    path('transfer/', api_views.TransferAPIView.as_view(), name='transfer-api'),
    path('login/', api_views.LoginAPIView.as_view(), name='api-login'),
    path('logout/', api_views.LogoutAPIView.as_view(), name='api-logout'),
    path('register/', api_views.RegisterAPIView.as_view(), name='api-register'),
    path('csrf/', api_views.CSRFTokenView.as_view(), name='api-csrf'),
    
    # Documentation
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
