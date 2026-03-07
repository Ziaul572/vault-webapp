from django.urls import path

from . import views

app_name = 'myapp'

urlpatterns = [
    path('', views.home, name='home'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('accounts/', views.accounts, name='accounts'),
    path('loans/', views.loans, name='loans'),
    path('transactions/', views.transactions, name='transactions'),
    path('transfer/', views.transfer, name='transfer'),
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
]