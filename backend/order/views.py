from django.shortcuts import render
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.shortcuts import get_object_or_404
# Create your views here.

class CartDetailView(APIView):
    def get_cart_for_user(self, user):
        # Using get_or_create to retrieve the user's cart or create it if it doesn't exist
        cart, created = Cart_M.objects.get_or_create(User_ID=user)
        return cart

    def get_applicable_offer(self, cart):
        # Check if there are any applicable offers for the cart
    
        offer = Offer.objects.filter(
            StartDate__lte=timezone.now(),
            Endtime__gte=timezone.now(),
            MinimumAmount__lte=cart.Total
        ).exclude(cart_details__isnull=False).first()
        return offer
    
    def get(self, request, *args, **kwargs):
        # Access the user making the request
        current_user = self.request.user

        # Check if the user is logged in
        if current_user.is_authenticated:
            # Get or create the user's cart
            cart = self.get_cart_for_user(current_user)
            # Serialize the cart data
            serialized_cart = Cart_MSerializer(cart).data


            offer = self.get_applicable_offer(cart)
            offer_serializer = OfferSerializer(offer) if offer else None

            
            response_data = {
                'cart': serialized_cart,
                'offer': offer_serializer.data if offer_serializer else None,  # Check if offer_serializer is not None
                'message': 'Cart retrieved successfully'
            }

            return Response(response_data)
        

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
        subtotal = item.ItemPrice * quantity

         # Check if an offer is selected 
        selected_offer_id = request.data.get('Offer_ID')
        print("Selected Offer ID:", selected_offer_id)
        selected_offer = None

        if selected_offer_id:
        # User has selected an offer

            try:
                selected_offer = Offer.objects.get(pk=selected_offer_id)
            except Offer.DoesNotExist:
                return Response({'message': 'Selected offer does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            # Check if the selected offer is applicable
            if selected_offer.MinimumAmount > cart.Total or selected_offer.MinimumAmount > subtotal:
                return Response({'message': 'Selected offer is not applicable to the cart'}, status=status.HTTP_400_BAD_REQUEST)

        # Apply offer
        if selected_offer:
            print("Applying Offer:", selected_offer)
            subtotal_with_discount = subtotal - (subtotal * (selected_offer.DiscountPercentage / 100))
            cart_item_data = {
                'Cart_ID': cart,
                'Item_ID': item,
                'ItemQuantity': quantity,
                'Subtotal': subtotal_with_discount,  # Use the discounted subtotal
                # 'Total':subtotal,
                'Offer_ID': selected_offer  # Assign the selected offer to the cart item
                }
        else:
            cart_item_data = {
                'Cart_ID': cart,
                'Item_ID': item,
                'ItemQuantity': quantity,
                'Subtotal': subtotal,
                }
        cart_item = Cart_Details.objects.create(**cart_item_data)

        # cart_item = Cart_Details.objects.create(Cart_ID=cart, Item_ID=item, ItemQuantity=quantity, Subtotal=subtotal_with_discount,Offer_ID=selected_offer)#Subtotal =subtotal,

        
        # Update total price in the cart
        cart.Total += subtotal
        cart.save()

        response_data = {
            'message': 'Item added to the cart successfully',
            'cart_item': Cart_DetailsSerializer(cart_item).data,
        }

        return Response(response_data, status=status.HTTP_201_CREATED)
        