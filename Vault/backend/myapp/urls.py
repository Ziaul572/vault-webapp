from django.urls import path

from . import views

app_name = 'myapp'

urlpatterns = [
    path('', views.home, name='home'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('accounts/', views.accounts, name='accounts'),
    path('loans/', views.loans, name='loans'),
    path('transaction/', views.transactions, name='transactions'),
    path('transfer/', views.transfer, name='transfer'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register, name='register'),
    path('profile/', views.profile, name='profile'),
    path("create-account/", views.create_account, name="create_account"),
    path("logout/", views.logout_view, name="logout"),
    path("profileEdit/", views.edit_profile, name="edit_profile"),
    path("deposit/", views.deposit, name="deposit"),
    path("withdraw/", views.withdraw, name="withdraw"),
]