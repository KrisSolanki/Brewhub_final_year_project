from django.urls import path,include
from .views import *
app_name='order'
urlpatterns = [

    path('cart/',CartDetailView.as_view(),name='cart-list'),
    # path('cart/',CartDetailView1.as_view(),name='cart-list'),
    path('cart/<int:cart_item_id>/',CartDetailsDeleteView.as_view(),name='cart-details-delete'),
    
    # path('create-checkout-session/', CreateCheckoutSessionView.as_view(), name='create-checkout-session'),
    # path('payment-success/', paymentSuccess, name='payment-success'),
    # path('webhook/stripe/', my_webhook_view , name='webhook-stripe'),

    path('order/', OrderCreateView.as_view(), name='order-create'),
    path('order/<int:order_id>/', OrderCreateView.as_view(), name='order-detail'),    
]