from django.http import Http404
from django.shortcuts import render

from cafe.models import Menu
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
            cart_items = Cart_Details.objects.filter(Cart_ID=cart)
            cart_items_serializer = Cart_DetailsSerializer(cart_items, many=True).data

            

            offer = self.get_applicable_offer(cart)
            offer_serializer = OfferSerializer(offer) if offer else None

            
            response_data = {
                'cart': serialized_cart,
                #'offer': offer_serializer.data if offer_serializer else None,  # Check if offer_serializer is not None
                'cart_items': cart_items_serializer,
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
    
    def put(self, request, *args, **kwargs):
        # Update quantity or other details of a cart item
        cart_item = Cart_Details.objects.get(pk=request.data.get('Cart_Item_ID'))
        serializer = Cart_DetailsSerializer(cart_item, data=request.data,partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        print(f"Updated Subtotal in Database: {cart_item.Subtotal}")

        # Update total price in the cart
        cart = cart_item.Cart_ID
        # cart.Total += cart_item.Subtotal - serializer.validated_data.get('Subtotal',0)
        # cart.Total += cart_item.Subtotal - serializer.initial_data['Subtotal']
        # cart.Total += cart_item.Subtotal - serializer.initial_data.get('Subtotal',0)

        # Calculate the updated subtotal based on the updated 'ItemQuantity' or other relevant fields
        updated_quantity = serializer.validated_data.get('ItemQuantity', cart_item.ItemQuantity)
        updated_subtotal = cart_item.Item_ID.ItemPrice * updated_quantity
        # print(cart.Total)
        # print(cart_item.Subtotal)
        # print(serializer.initial_data)
        
       
        cart_item.Subtotal = updated_subtotal
        cart_item.save()

        # tp =20000 
        # Update total price in the cart
        cart.Total += updated_subtotal - cart_item.Subtotal
        cart.save()
        print(f"Updated Quantity: {updated_quantity}")
        print(f"Updated Subtotal: {updated_subtotal}")
        print(f"Old Subtotal: {cart_item.Subtotal}")
        print(f"Total: {cart.Total}")

        updated_cart_item = Cart_Details.objects.get(pk=cart_item.pk)
        updated_cart_item_serializer = Cart_DetailsSerializer(updated_cart_item).data

        # return Response({'message': 'Cart item updated successfully'})
        response_data = {
            'message': 'Cart item updated successfully',
            'updated_cart_item': updated_cart_item_serializer,
        }
        return Response(response_data)
    
class CartDetailsDeleteView(APIView):
    def delete(self, request, cart_item_id, *args, **kwargs):
        # Delete a cart item
        # cart_item = Cart_Details.objects.get(pk=request.data.get('cart_item_id'))
        try:
            # Attempt to retrieve the Cart_Details object
            cart_item = Cart_Details.objects.get(pk=cart_item_id)
        except Cart_Details.DoesNotExist:
            # If the object doesn't exist, return a 404 response
            raise Http404("Cart item does not exist")
        # Update total price in the cart before deleting the cart item
        cart = cart_item.Cart_ID
        cart.Total -= cart_item.Subtotal
        cart.save()
        # print(cart.Total)
        # print(cart_item.Subtotal)
        cart_item.delete()

        return Response({'message': 'Cart item deleted successfully'})

class OrderCreateView(APIView):
    serializer_class = Order_MSerializer
    def post(self, request, *args, **kwargs,):
       
        user = self.request.user
        new_order_data = {'OrderDate': timezone.now()}  
        new_order_data.update(request.data)
        serializer = Order_MSerializer(data=new_order_data)
        serializer.is_valid(raise_exception=True)
        
        

        # Create a new order
        new_order = serializer.save(User_ID=user)

        # Retrieve items from the user's cart
        cart_items = Cart_Details.objects.filter(Cart_ID__User_ID=user)

        # Transfer cart items to order details
       
        for cart_item in cart_items:
            if cart_item.Offer_ID is None:

                Order_Details.objects.create(
                    ItemQuantity=cart_item.ItemQuantity,
                    Subtotal=cart_item.Subtotal,
                    Item_ID=cart_item.Item_ID,
                    Order_ID=new_order,

                )
            else:
                    Order_Details.objects.create(
                    ItemQuantity=cart_item.ItemQuantity,
                    Subtotal=cart_item.Subtotal,
                    Item_ID=cart_item.Item_ID,
                    Order_ID=new_order,
                    Offer_ID = cart_item.Offer_ID,               
                )


        # Update the total price of the order
        new_order.Total = sum(cart_item.Subtotal for cart_item in cart_items)
        new_order.save()

        # Clear the user's cart
        cart_items.delete()

        return Response({'message': 'Order created successfully'})
    
    def get(self, request, order_id=None, *args, **kwargs):
        if order_id:
            # Retrieve the specific order by ID
            order = get_object_or_404(Order_M, OrderID=order_id)
            serializer = Order_MSerializer(order)
            return Response(serializer.data)
        else:
            # Retrieve a list of all orders
            orders = Order_M.objects.all()
            serializer = Order_MSerializer(orders, many=True)
            return Response(serializer.data)

#date 6 feb
import stripe
from django.conf import settings
from django.shortcuts import reverse
stripe.api_key = settings.STRIPE_SECRET_KEY
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
class CreateCheckoutSessionView(APIView):
    def post(self,*args,**kwargs):
        host = self.request.get_host()

        
        checkout_session = stripe.checkout.Session.create(
            payment_method_types = ['card'],
            line_items=[
                {
                    # Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                   'price_data': {
                       'currency': 'inr',
                       'unit_amount' : 1000,
                       'product_data' : {
                           'name' : 'codepieporder',
                        #    'images'
                       },                       
                   },
                   'quantity' : 1,
                },
            ],
            mode='payment',
            success_url="http://{}{}".format(host,reverse('order:payment-success')),
            # cancel_url="http://{}{}".format(host,reverse('order:payment-success')),
        )
        
        # return redirect(checkout_session.url, code=303)
        return Response({'checkout_session_url': checkout_session.url}, status=status.HTTP_201_CREATED)

def paymentSuccess(request):
    context={
            'payment_status':'success'

    }
    return Response(context)

@csrf_exempt
def my_webhook_view(request):
    payload = request.body
    print(payload)
    return HttpResponse(status=200)