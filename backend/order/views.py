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
            cart_detail.Subtotal = cart_detail.ItemQuantity * cart_detail.Item_ID.ItemPrice
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

    # Retain the applied offer if it exists
        existing_offer = cart_obj.Offer_ID

    # Apply new offer to the entire cart or calculate total without discount
        if selected_offer:
            cart_obj.Offer_ID = selected_offer

    # Find or create the cart detail for the item
        item = serializer.validated_data['Item_ID']
        quantity = serializer.validated_data['ItemQuantity']
        subtotal = item.ItemPrice * quantity

    # Recalculate subtotal with offer discount if applied
        if cart_obj.Offer_ID:
            subtotal *= (1 - (cart_obj.Offer_ID.DiscountPercentage / 100))

    # Try to find an existing cart detail for the item
        try:
            cart_detail = Cart_Details.objects.get(Cart_ID=cart_obj, Item_ID=item)
        
        # If the cart detail already exists, update the quantity and subtotal
            cart_detail.ItemQuantity += 1
            cart_detail.Subtotal = item.ItemPrice * cart_detail.ItemQuantity
        
        # Recalculate subtotal with offer discount if applied
            if cart_obj.Offer_ID:
                cart_detail.Subtotal *= (1 - (cart_obj.Offer_ID.DiscountPercentage / 100))

            cart_detail.save()
        
        except Cart_Details.DoesNotExist:
            pass
    
    # Recalculate the total for the entire cart
        cart_details = Cart_Details.objects.filter(Cart_ID=cart_obj)
        # cart_obj.Subtotal = sum(cart_item.Subtotal for cart_item in cart_details)
        # cart_obj.Subtotal = sum(cart_item.Subtotal for cart_item in cart_details)
        cart_obj.Subtotal = sum(cart_item.Subtotal for cart_item in cart_details)
        # cart_obj.Total = cart_obj.Subtotal  # Assuming there are no additional discounts
        # cart_obj.Total = cart_obj.Subtotal  # Assuming there are no additional discounts
        cart_obj.Total = sum(cart_item.Subtotal for cart_item in cart_details)  # Assuming there are no additional discounts
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

    # # Check if an offer is selected or if the offer should be removed
    #     selected_offer_id = request.data.get('Offer_ID')
    #     selected_offer = None
    #     if selected_offer_id:
    #         try:
    #             selected_offer = Offer.objects.get(pk=selected_offer_id)
    #         except Offer.DoesNotExist:
    #             return Response({'message': 'Selected offer does not exist'}, status=status.HTTP_400_BAD_REQUEST)

    # # If an offer is already applied, remove its discount from the total
    #     if cart_obj.Offer_ID:
    #         old_offer = cart_obj.Offer_ID
    #         cart_obj.Total += cart_obj.Total * (old_offer.DiscountPercentage / 100)
    #         cart_obj.Offer_ID = None # Remove the old offer

    # # Apply new offer to the entire cart or calculate total without discount
    #     if selected_offer:
    #         cart_obj.Total -= cart_obj.Total * (selected_offer.DiscountPercentage / 100)
    #         cart_obj.Offer_ID = selected_offer
        item = serializer.validated_data['Item_ID']
        quantity = serializer.validated_data['ItemQuantity']
        
        applied_offer = cart_obj.Offer_ID
        if applied_offer:
            discount_factor = 1 - (applied_offer.DiscountPercentage / 100)
            subtotal = item.ItemPrice * quantity * discount_factor
        else:
            subtotal = item.ItemPrice * quantity

    # Find or create the cart detail for the item
        discount_factor = 1 #- (selected_offer.DiscountPercentage / 100) if selected_offer else 1
        subtotal = item.ItemPrice * quantity * discount_factor

        
    # Try to find an existing cart detail for the item
        try:
            cart_detail = Cart_Details.objects.get(Cart_ID=cart_obj, Item_ID=item)
        
        # If the cart detail already exists, update the quantity and subtotal
            if cart_detail.ItemQuantity > 1:
    # Decrease the item quantity by 1
                cart_detail.ItemQuantity -= 1
    # Update the subtotal based on the new quantity and the discount factor
                cart_detail.Subtotal = item.ItemPrice * cart_detail.ItemQuantity 
                
                cart_detail.save()
            # cart_obj.Total = item.ItemPrice * cart_detail.ItemQuantity * discount_factor 
            # cart_obj.Subtotal = item.ItemPrice * cart_detail.ItemQuantity
            # cart_detail.save()

            else:
                cart_detail.delete()

            if cart_obj.Offer_ID:
                cart_detail.Subtotal *= (1 - (cart_obj.Offer_ID.DiscountPercentage / 100))

                cart_detail.save()
        
                cart_details = Cart_Details.objects.filter(Cart_ID=cart_obj)
                cart_obj.Subtotal = sum(cart_item.Subtotal for cart_item in cart_details)
                # cart_obj.Total = item.ItemPrice * cart_detail.ItemQuantity * discount_factor # Assuming there are no additional discounts
                cart_obj.Total = cart_obj.Subtotal 
                print("discount factor",discount_factor) # Assuming there are no additional discounts
                cart_obj.save()
            else:
                cart_details = Cart_Details.objects.filter(Cart_ID=cart_obj)
                cart_obj.Subtotal = sum(cart_item.Subtotal for cart_item in cart_details)
                cart_obj.Total = sum(cart_item.Subtotal for cart_item in cart_details)  # Assuming there are no additional discounts
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
        
        cart.Subtotal -= cart_item.Subtotal
        cart.Total -= cart_item.Subtotal
        cart.save()
        # print(cart.Total)
        # print(cart_item.Subtotal)
        cart_item.delete()

        return Response({'message': 'Cart item deleted successfully'})

class CartOfferView(APIView):
   def put(self, request, *args, **kwargs):
    cart_obj, created = Cart_M.objects.get_or_create(User_ID=request.user)
    cart_id = cart_obj.CartID

    selected_offer_id = request.data.get('Offer_ID')
    selected_offer = None
    if selected_offer_id:
        try:
            selected_offer = Offer.objects.get(pk=selected_offer_id)
        except Offer.DoesNotExist:
            return Response({'message': 'Selected offer does not exist'}, status=status.HTTP_400_BAD_REQUEST)

    if cart_obj.Offer_ID:
        return Response({'message': 'Another offer is already applied. Remove the existing offer before applying a new one.'}, status=status.HTTP_400_BAD_REQUEST)

    if selected_offer:
        cart_obj.Total -= cart_obj.Subtotal * (selected_offer.DiscountPercentage / 100)
        cart_obj.Offer_ID = selected_offer

    if not selected_offer:
        cart_obj.Total = cart_obj.Subtotal

    cart_obj.save()

    response_data = {
        'message': 'Offer updated in the cart successfully',
        'cart': Cart_MSerializer(cart_obj).data,
    }

    return Response(response_data, status=status.HTTP_200_OK)
   
   def delete(self, request, *args, **kwargs):
        try:
            cart_obj = Cart_M.objects.get(User_ID=request.user)
        except Cart_M.DoesNotExist:
            return Response({'message': 'Cart does not exist'}, status=status.HTTP_404_NOT_FOUND)
        applied_offer = cart_obj.Offer_ID
        discount_factor = 1 - (applied_offer.DiscountPercentage / 100)
        print("discount",discount_factor)
        if cart_obj.Offer_ID:
            # dd= cart_obj.Total * discount_factor
            cart_obj.Offer_ID = None
            cart_details = Cart_Details.objects.filter(Cart_ID=cart_obj)
            # cart_obj.Subtotal = sum(cart_item.Subtotal for cart_item in cart_details) +dd
            # cart_obj.Total = cart_obj.Subtotal

            
             # Assuming there are no additional discounts
            cart_obj.save()
            cart_obj.Subtotal=sum(cart_item.Subtotal for cart_item in cart_details)
            cart_obj.Total = cart_obj.Subtotal
            cart_obj.save()
            return Response({'message': 'Offer removed from the cart successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No offer applied to the cart'}, status=status.HTTP_400_BAD_REQUEST)




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
        cart = Cart_M.objects.filter(User_ID=user)
        # cart = Cart_M.objects.filter(Cart_ID__User_ID=user)

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
            new_order.Total = subtotal
            print('****************************',new_order)


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
        # new_order.Total = cart.Total
        new_order.Total = sum(cart_item.Subtotal for cart_item in cart_items)
        # new_order.Offer_ID=cart_item.Offer_ID if cart_item.Offer_ID else None,
        # new_order.save()

        # if offer_applied:
        #     new_order.Offer_ID = offer
        new_order.save()
        payment = Payment_M.objects.create(OrderID=new_order)
        print("nnnnnnnnnnnnnnnnnnnnnnnn")
        print("new order",new_order.Total)
        
        razorpay_order_id = create_razorpay_order(new_order)
        print(razorpay_order_id)
        payment.razorpay_order_id = razorpay_order_id
        payment.save()

        # payment = Payment_M.objects.create(OrderID=new_order)

        # Clear the user's cart
        # cart_items.delete()
        # cart.delete()
        
        payment_serializer = Payment_MSerializer(payment).data
        print("zzzzzzzzzzzzzzzzzzzzzzzzzzz")
        print("Z",payment_serializer)
        return Response({
            'message': 'Order created successfully',
            # 'payment': payment_serializer.data,
            'RAZORPAY_ORDER_ID':razorpay_order_id,
            'ORDERID' : payment_serializer['OrderID']
            })
    
    

    def get(self, request, order_id=None, *args, **kwargs):
        #  user = request.user
        user_id = self.request.user
        if order_id:
            # Retrieve the specific order by ID
            order = get_object_or_404(Order_M, OrderID=order_id)
            order_serializer = Order_MSerializer(order)
            
            # Retrieve order details associated with the order
            order_details = Order_Details.objects.filter(Order_ID=order)
            order_details_serializer = Order_DetailsSerializer(order_details, many=True)
            
            response_data = {
                'order': order_serializer.data,
                'order_details': order_details_serializer.data
            }
            return Response(response_data)
        else:
            
            # Retrieve a list of all orders
            orders = Order_M.objects.filter(user_id=user_id)
            order_serializer = Order_MSerializer(orders, many=True)
            order_details_serializer = Order_DetailsSerializer(Order_Details.objects.all(), many=True) 

            response_data = {
                'orders': order_serializer.data,
                'order_details': order_details_serializer.data
            }
            return Response(response_data)


class CompetePaymentView(APIView):
    def post(self, request):
        serializer = Payment_MSerializer(data=request.data)
        user = self.request.user
        cart = Cart_M.objects.filter(User_ID=user)
        # print("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
        # print("Data",serializer)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            # Assuming verify_payment is a function defined elsewhere in your code
            rapy_client = verify_payment(
                razorpay_order_id=validated_data.get("razorpay_order_id"),
                razorpay_payment_id=validated_data.get("razorpay_payment_id"),
                razorpay_signature=validated_data.get("razorpay_signature")
            )
            serializer.save()
            cart.delete()

            # order_id = validated_data.get("OrderID")
            # order_instance = get_object_or_404(Order_M, OrderID=order_id)
            # order_serializer = Order_MSerializer(order_instance)
            response = {
                "status_code": status.HTTP_201_CREATED,
                "message": "transaction created",
                "PaymentData":serializer.data
                # "OrderData": order_serializer.data
            }
            return Response(response, status=status.HTTP_201_CREATED)
        else:
            response = {
                "status_code": status.HTTP_400_BAD_REQUEST,
                "message": "bad request",
                "errors": serializer.errors
            }
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
        

    def get(self, request, payment_id=None):
        if payment_id:
            # Retrieve the specific payment by ID
            payment = get_object_or_404(Payment_M, PaymentID=payment_id)
            serializer = Payment_MSerializer(payment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Retrieve all payment data
            payments = Payment_M.objects.all()
            serializer = Payment_MSerializer(payments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
       
class OfferView(APIView):
    def get(self , request , offer_id=None , *args , **kwarfs):
        if offer_id:
            offer_id=get_object_or_404(Offer,OfferID=offer_id)
            offer_serializer = OfferSerializer(offer_id)
            
            return Response(offer_serializer.data)
        else:
            offers = Offer.objects.all()
            offer_serializer = OfferSerializer(offers,many=True)
            
            return Response(offer_serializer.data)