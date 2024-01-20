from django.shortcuts import render
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

class CartDetailView(APIView):
    def get_cart_for_user(self, user):
        # Using get_or_create to retrieve the user's cart or create it if it doesn't exist
        cart, created = Cart_M.objects.get_or_create(User_ID=user)
        return cart

    def get(self, request, *args, **kwargs):
        # Access the user making the request
        current_user = self.request.user

        # Check if the user is logged in
        if current_user.is_authenticated:
            # Get or create the user's cart
            cart = self.get_cart_for_user(current_user)

            # Serialize the cart data
            serialized_cart = Cart_MSerializer(cart).data

            return Response({'cart': serialized_cart, 'message': 'Cart retrieved successfully'})
        else:
            # The user is not logged in, handle accordingly
            return Response({'message': 'User is not logged in'}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request, *args, **kwargs):
        # Add a new item to the cart
        serializer = Cart_DetailsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = Cart_M.objects.get(User_ID=self.request.user)
        item = serializer.validated_data['Item_ID']
        quantity = serializer.validated_data['ItemQuantity']
       # size = serializer.validated_data.get('Size')  # Optional size selection
        subtotal = item.ItemPrice * quantity

        cart_item = Cart_Details.objects.create(Cart_ID=cart, Item_ID=item, ItemQuantity=quantity, Subtotal=subtotal)

        # Update total price in the cart
        cart.Total += subtotal
        cart.save()

        response_data = {
            'message': 'Item added to the cart successfully',
            'cart_item': Cart_DetailsSerializer(cart_item).data,
        }

        return Response(response_data, status=status.HTTP_201_CREATED)
        