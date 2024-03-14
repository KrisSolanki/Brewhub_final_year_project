from django.http import Http404
from django.shortcuts import render
from .models import Payment_M


from cafe.models import Menu
from account.models import User
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils import timezone
from django.shortcuts import get_object_or_404
# Create your views here.
from django.db.models import Sum
# from .utils import *
from .utils import *

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
        # current_user = 73
        current_user = self.request.user
        
        # Check if the user is logged in
        # if current_user.is_authenticated:
            # Get or create the user's cart
        cart = self.get_cart_for_user(current_user)
            # Serialize the cart data
        serialized_cart = Cart_MSerializer(cart).data
        cart_items = Cart_Details.objects.filter(Cart_ID=cart)
        cart_items_serializer = Cart_DetailsSerializer(cart_items, many=True).data

        
        item_ids = cart_items.values_list('Item_ID', flat=True)
        menu_items = Menu.objects.filter(ItemID__in=item_ids)
        menu_serializer = MenuSerializer(menu_items, many=True).data

        # offer = self.get_applicable_offer(cart)
        # offer_serializer = OfferSerializer(offer) if offer else None

            
        response_data = {
                'cart': serialized_cart,
                #'offer': offer_serializer.data if offer_serializer else None,  # Check if offer_serializer is not None
                'cart_items': cart_items_serializer,
                'menus': menu_serializer,
                'message': 'Cart retrieved successfully'
            }

        return Response(response_data)

    def post(self, request, *args, **kwargs):
    # Retrieve or create a cart based on the user making the request
        cart_obj, created = Cart_M.objects.get_or_create(User_ID=request.user)
        cart_id = cart_obj.CartID

    # Create a mutable copy of the request data
        data = request.data.copy()
    # Add the Cart_ID to the data
        data['Cart_ID'] = cart_id

    # Validate serializer data
        serializer = Cart_DetailsSerializer(data=data)
        serializer.is_valid(raise_exception=True)

    # Check if an offer is selected
        selected_offer_id = request.data.get('Offer_ID')
        selected_offer = None
        if selected_offer_id:
            try:
                selected_offer = Offer.objects.get(pk=selected_offer_id)
            except Offer.DoesNotExist:
                return Response({'message': 'Selected offer does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        # ** Check if an offer is being removed
        if not selected_offer_id and cart_obj.Offer_ID:
        # ** Restore the original total and subtotal values before the offer was applied
            cart_obj.Total += cart_obj.Total * (cart_obj.Offer_ID.DiscountPercentage / 100)
            cart_obj.Offer_ID = None
            for cart_detail in Cart_Details.objects.filter(Cart_ID=cart_obj):
                cart_detail.Subtotal = cart_detail.ItemQuantity * cart_detail.Item_ID.ItemPrice
                cart_detail.save()
        else:
        # ** Apply offer to the entire cart
            if selected_offer:
                cart_obj.Total -= cart_obj.Total * (selected_offer.DiscountPercentage / 100)
                cart_obj.Offer_ID = selected_offer
            # ** Update subtotal for each item to reflect the discount
                for cart_detail in Cart_Details.objects.filter(Cart_ID=cart_obj):
                    cart_detail.Subtotal = cart_detail.ItemQuantity * cart_detail.Item_ID.ItemPrice * (1 - (selected_offer.DiscountPercentage / 100))
                    cart_detail.save()

    # Add the selected item to the cart details
        item = serializer.validated_data['Item_ID']
        quantity = serializer.validated_data['ItemQuantity']
        discount_factor = 1 - (selected_offer.DiscountPercentage / 100) if selected_offer else 1
        subtotal = item.ItemPrice * quantity * discount_factor
        cmst = item.ItemPrice * quantity

        cart_details = Cart_Details.objects.filter(Cart_ID=cart_obj, Item_ID=item)

        if cart_details.exists():
        # ** If the cart detail exists, update the quantity and recalculate the subtotal based on the new quantity and discount factor
            cart_detail = cart_details.first()
            cart_detail.ItemQuantity += quantity
            cart_detail.Subtotal = cart_detail.ItemQuantity * cart_detail.Item_ID.ItemPrice * discount_factor
            cart_detail.save()
        else:
        # ** If the cart detail does not exist, create a new one
            Cart_Details.objects.create(Cart_ID=cart_obj, Item_ID=item, ItemQuantity=quantity, Subtotal=subtotal)

    # ** Update the total in the Cart_M model
        cart_obj.Total += subtotal * discount_factor
        cart_obj.Subtotal += cmst
        cart_obj.save()

        response_data = {
            'message': 'Item added to the cart successfully',
            'cart': Cart_MSerializer(cart_obj).data,
        }

        return Response(response_data, status=status.HTTP_201_CREATED)


    def put(self, request, *args, **kwargs):
    # Retrieve or create a cart based on the user making the request
        cart_obj, created = Cart_M.objects.get_or_create(User_ID=request.user)
        cart_id = cart_obj.CartID

    # Validate serializer data
        serializer = Cart_DetailsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

    # Check if an offer is selected or if the offer should be removed
        selected_offer_id = request.data.get('Offer_ID')
        selected_offer = None
        if selected_offer_id:
            try:
                selected_offer = Offer.objects.get(pk=selected_offer_id)
            except Offer.DoesNotExist:
                return Response({'message': 'Selected offer does not exist'}, status=status.HTTP_400_BAD_REQUEST)

    # If an offer is already applied, remove its discount from the total
        if cart_obj.Offer_ID:
            old_offer = cart_obj.Offer_ID
            cart_obj.Total += cart_obj.Total * (old_offer.DiscountPercentage / 100)
            cart_obj.Offer_ID = None # Remove the old offer

    # Apply new offer to the entire cart or calculate total without discount
        if selected_offer:
            cart_obj.Total -= cart_obj.Total * (selected_offer.DiscountPercentage / 100)
            cart_obj.Offer_ID = selected_offer

    # Find or create the cart detail for the item
        item = serializer.validated_data['Item_ID']
        quantity = serializer.validated_data['ItemQuantity']
        # discount_factor = 1 - (selected_offer.DiscountPercentage / 100) if selected_offer else 1
        # subtotal = item.ItemPrice * quantity * discount_factor
        subtotal = item.ItemPrice * quantity 

        
    # Try to find an existing cart detail for the item
        cart_detail = Cart_Details.objects.get(Cart_ID=cart_obj, Item_ID=item)
        
        # If the cart detail already exists, update the quantity and subtotal
        cart_detail.ItemQuantity += 1
        # cart_detail.Subtotal = item.ItemPrice * cart_detail.ItemQuantity * discount_factor
        cart_detail.Subtotal = item.ItemPrice * cart_detail.ItemQuantity 
        print("cart_detail",cart_detail.ItemQuantity)
        print("cart_detail.Subtotal",cart_detail.Subtotal)
        cart_detail.save()
        
        # cart_details = Cart_Details.objects.filter(Cart_ID=cart_obj)
        # cart_obj.Subtotal = sum(cart_item.Subtotal for cart_item in cart_details)

        # # Update the total in the Cart_M model
        # # cart_obj.Total = cart_detail.Subtotal
        # # cart_obj.Subtotal = item.ItemPrice * cart_detail.ItemQuantity
        # # cart_obj.save()

        # # Recalculate the total for the entire cart
        # cart_details = Cart_Details.objects.filter(Cart_ID=cart_obj)
        # total = sum(cart_item.Subtotal for cart_item in cart_details)
        # cart_obj.Total = total
        # cart_obj.save()
        cart_details = Cart_Details.objects.filter(Cart_ID=cart_obj)
        cart_obj.Subtotal = sum(cart_item.Subtotal for cart_item in cart_details)
            
            # Update the total for the entire cart
        cart_obj.Total = cart_obj.Subtotal  # Assuming there are no additional discounts
        cart_obj.save()

        response_data = {
        'message': 'Item updated in the cart successfully',
        'cart': Cart_MSerializer(cart_obj).data,
        }

        return Response(response_data, status=status.HTTP_200_OK)
    
    def patch(self, request, *args, **kwargs):
    # Retrieve or create a cart based on the user making the request
        cart_obj, created = Cart_M.objects.get_or_create(User_ID=request.user)
        cart_id = cart_obj.CartID

    # Validate serializer data
        serializer = Cart_DetailsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

    # Check if an offer is selected or if the offer should be removed
        selected_offer_id = request.data.get('Offer_ID')
        selected_offer = None
        if selected_offer_id:
            try:
                selected_offer = Offer.objects.get(pk=selected_offer_id)
            except Offer.DoesNotExist:
                return Response({'message': 'Selected offer does not exist'}, status=status.HTTP_400_BAD_REQUEST)

    # If an offer is already applied, remove its discount from the total
        if cart_obj.Offer_ID:
            old_offer = cart_obj.Offer_ID
            cart_obj.Total += cart_obj.Total * (old_offer.DiscountPercentage / 100)
            cart_obj.Offer_ID = None # Remove the old offer

    # Apply new offer to the entire cart or calculate total without discount
        if selected_offer:
            cart_obj.Total -= cart_obj.Total * (selected_offer.DiscountPercentage / 100)
            cart_obj.Offer_ID = selected_offer

    # Find or create the cart detail for the item
        item = serializer.validated_data['Item_ID']
        quantity = serializer.validated_data['ItemQuantity']
        discount_factor = 1 - (selected_offer.DiscountPercentage / 100) if selected_offer else 1
        subtotal = item.ItemPrice * quantity * discount_factor

        
    # Try to find an existing cart detail for the item
        try:
            cart_detail = Cart_Details.objects.get(Cart_ID=cart_obj, Item_ID=item)
        
        # If the cart detail already exists, update the quantity and subtotal
            if cart_detail.ItemQuantity > 1:
    # Decrease the item quantity by 1
                cart_detail.ItemQuantity -= 1
    # Update the subtotal based on the new quantity and the discount factor
                cart_detail.Subtotal = item.ItemPrice * cart_detail.ItemQuantity * discount_factor
                cart_detail.save()
            # cart_obj.Total = item.ItemPrice * cart_detail.ItemQuantity * discount_factor 
            # cart_obj.Subtotal = item.ItemPrice * cart_detail.ItemQuantity
            # cart_detail.save()

            else:
                cart_detail.delete()
            
            cart_details = Cart_Details.objects.filter(Cart_ID=cart_obj)
            cart_obj.Subtotal = sum(cart_item.Subtotal for cart_item in cart_details)
            cart_obj.Total = cart_obj.Subtotal  # Assuming there are no additional discounts
            cart_obj.save()
        except Cart_Details.DoesNotExist:
            pass
        
        response_data = {
        'message': 'Item updated in the cart successfully',
        'cart': Cart_MSerializer(cart_obj).data,
        }


        return Response(response_data, status=status.HTTP_200_OK)
   


class CartDetailsDeleteView(APIView):
    def delete(self, request, cart_item_id, *args, **kwargs):
        # Delete a cart item
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

        # offer_applied = cart_items.filter(Offer_ID__isnull=False).exists()
        # print(offer_applied)

        # cart = cart_items.first().Cart_ID
        # offer_applied = cart.Offer_ID is not None
        # total = int(cart_items.aggregate(sum('Subtotal'))['Subtotal__sum'])

        # total_sum = cart_items.aggregate(Sum('Subtotal'))['Subtotal__sum']
        # total = int(total_sum) if total_sum is not None else 0

        # if total is None:
        #     total = 0 # Ensure total is an integer if no items are in the cart

        # Transfer cart items to order details
        
        for cart_item in cart_items:
            subtotal = cart_item.Subtotal 
            
            # if cart_item.Offer_ID is None:

            Order_Details.objects.create(
                ItemQuantity=cart_item.ItemQuantity,
                Subtotal=subtotal,
                Item_ID=cart_item.Item_ID,
                Order_ID=new_order,
                # Offer_ID=cart_item.Offer_ID if cart_item.Offer_ID else None,
                )
            total=subtotal
            new_order.Total = total

        # if offer_applied:
        #     # Assuming the first item's offer is applied to the entire order
        #     offer = cart.Offer_ID
        #     discount_percentage = offer.DiscountPercentage
        #     total -= total * (discount_percentage / 100)

            # else:
            #         Order_Details.objects.create(
            #         ItemQuantity=cart_item.ItemQuantity,
            #         Subtotal=cart_item.Subtotal,
            #         Item_ID=cart_item.Item_ID,
            #         Order_ID=new_order,
            #         Offer_ID = cart_item.Offer_ID,               
            #     )


        # Update the total price of the order
        # new_order.Total = sum(cart_item.Subtotal for cart_item in cart_items)
        new_order.Total = total
        # new_order.Offer_ID=cart_item.Offer_ID if cart_item.Offer_ID else None,
        # new_order.save()

        # if offer_applied:
        #     new_order.Offer_ID = offer
        new_order.save()
        payment = Payment_M.objects.create(OrderID=new_order)
        razorpay_order_id = create_razorpay_order(new_order)
        print(razorpay_order_id)
        payment.razorpay_order_id = razorpay_order_id
        payment.save()

        # payment = Payment_M.objects.create(OrderID=order)

        # Clear the user's cart
        # cart_items.delete()

        return Response({
            'message': 'Order created successfully',
            'RAZORPAY_ORDER_ID':razorpay_order_id
            })
    
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
# import stripe
# from django.conf import settings
# from django.shortcuts import reverse
# stripe.api_key = settings.STRIPE_SECRET_KEY
# from django.views.decorators.csrf import csrf_exempt
# from django.http import HttpResponse
# class CreateCheckoutSessionView(APIView):
#     def post(self,*args,**kwargs):
#         host = self.request.get_host()

        
#         checkout_session = stripe.checkout.Session.create(
#             payment_method_types = ['card'],
#             line_items=[
#                 {
#                     # Provide the exact Price ID (for example, pr_1234) of the product you want to sell
#                    'price_data': {
#                        'currency': 'inr',
#                        'unit_amount' : 1000,
#                        'product_data' : {
#                            'name' : 'codepieporder',
#                         #    'images'
#                        },                       
#                    },
#                    'quantity' : 1,
#                 },
#             ],
#             mode='payment',
#             success_url="http://{}{}".format(host,reverse('order:payment-success')),
#             # cancel_url="http://{}{}".format(host,reverse('order:payment-success')),
#         )
        
#         # return redirect(checkout_session.url, code=303)
#         return Response({'checkout_session_url': checkout_session.url}, status=status.HTTP_201_CREATED)

# def paymentSuccess(request):
#     context={
#             'payment_status':'success'

#     }
#     return Response(context)

# @csrf_exempt
# def my_webhook_view(request):
#     payload = request.body
#     print(payload)
#     return HttpResponse(status=200)

class CompetePaymentView(APIView):
    def post(self, request):
        # Instantiate the serializer with the request data
        transaction = Payment_MSerializer(data=request.data)
        
        # Check if the serializer is valid
        if transaction.is_valid():
            # Assuming verify_payment is a function you've defined elsewhere
            # that verifies the payment details
            verify_payment(
                razorpay_order_id=transaction.validated_data.get("razorpay_order_id"),
                razorpay_payment_id=transaction.validated_data.get("razorpay_payment_id"),
                razorpay_signature=transaction.validated_data.get("razorpay_signature")
            )
            # Save the transaction
            transaction.save()
            response = {
                "status_code": status.HTTP_201_CREATED,
                "message": "transaction created"
            }
            return Response(response, status=status.HTTP_201_CREATED)
        else:
            response = {
                "status_code": status.HTTP_400_BAD_REQUEST,
                "message": "bad request",
                "error": transaction.errors # Corrected from transaction.error to transaction.errors
            }
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


# class CompetePaymentView(APIView):
#     def post(self,request):
#         transaction = Payment_MSerializer
#         data=request.data
#         if transaction.is_valid():
#             rapy_client=verify_payment(
#                 razorpay_order_id= Payment_MSerializer.validated_data.get("razorpay_order_id"),
#                 razorpay_payment_id= Payment_MSerializer.validated_data.get("razorpay_payment_id"),
#                 razorpay_signature= Payment_MSerializer.validated_data.get("razorpay_signature")
#             )
#             transaction.save()
#             response = {
#                 "status_code:":status.HTTP_201_CREATED,
#                 "message":"transaction created"
#             }
#             return Response(response,status=status.HTTP_201_CREATED)
#         else:
#             response = {
#                 "statuc_code:":status.HTTP_201_CREATED,
#                 "message:":"bad request",
#                 "error":transaction.error
#             }
#             return Response(response,status=status.HTTP_400_BAD_REQUEST)
 