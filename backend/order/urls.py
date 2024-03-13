from django.urls import path,include
from .views import *
app_name='order'
urlpatterns = [

    path('cart/',CartDetailView.as_view(),name='cart-list'),
    
    path('cart/<int:itemid>/',CartDetailView.as_view(),name='cart-list'),
    # path('cart/',CartDetailView1.as_view(),name='cart-list'),

    # path('carts/', CartListCreateView.as_view(), name='cart-list-create'),
    # path('carts/<int:pk>/', CartRetrieveUpdateDestroyView.as_view(), name='cart-retrieve-update-destroy'),
    # path('cart-details/', CartDetailsListCreateView.as_view(), name='cart-details-list-create'),
    # path('cart-details/<int:pk>/', CartDetailsRetrieveUpdateDestroyView.as_view(), name='cart-details-retrieve-update-destroy'),


    path('cart1/<int:cart_item_id>/',CartDetailsDeleteView.as_view(),name='cart-details-delete'),
    # path('cartpatch/',CartDetailsDeleteView.as_view(), name='cart-update'),
    # path('create-checkout-session/', CreateCheckoutSessionView.as_view(), name='create-checkout-session'),
    # path('payment-success/', paymentSuccess, name='payment-success'),
    # path('webhook/stripe/', my_webhook_view , name='webhook-stripe'),

    path('order/', OrderCreateView.as_view(), name='order-create'),
    path('complete/', CompetePaymentView.as_view(), name='payment-complete'),
    path('order/<int:order_id>/', OrderCreateView.as_view(), name='order-detail'),    
]