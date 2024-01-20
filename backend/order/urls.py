from django.urls import path,include
from .views import *

urlpatterns = [

    path('cart/',CartDetailView.as_view(),name='cart-list'),
    
]