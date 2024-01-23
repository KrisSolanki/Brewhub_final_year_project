from django.urls import path,include
from .views import *

urlpatterns = [

    path('cart/',CartDetailView.as_view(),name='cart-list'),
    path('cart/<int:cart_item_id>/',CartDetailsDeleteView.as_view(),name='cart-details-delete'),
    
]