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

            

        # offer = self.get_applicable_offer(cart)
        # offer_serializer = OfferSerializer(offer) if offer else None

            
        response_data = {
                'cart': serialized_cart,
                #'offer': offer_serializer.data if offer_serializer else None,  # Check if offer_serializer is not None
                'cart_items': cart_items_serializer,
                'message': 'Cart retrieved successfully'
            }

        return Response(response_data)
        

        # else:
        #     # The user is not logged in, handle accordingly
        #     return Response({'message': 'User is not logged in'}, status=status.HTTP_401_UNAUTHORIZED)

    # def post(self, request, *args, **kwargs):
    #     # Add a new item to the cart
    #     serializer = Cart_DetailsSerializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
        

    #     cart = Cart_M.objects.get(User_ID=self.request.user)
    #     item = serializer.validated_data['Item_ID']
    #     quantity = serializer.validated_data['ItemQuantity']
    #     subtotal = item.ItemPrice * quantity
    #     # we have to make channges in model ,have to add offerid in cart_m and order m
    #     #else there are minr changes 
    #      # Check if an offer is selected 
    #     selected_offer_id = request.data.get('Offer_ID')
    #     print("Selected Offer ID:", selected_offer_id)
    #     selected_offer = None

    #     if selected_offer_id:
    #     # User has selected an offer

    #         try:
    #             selected_offer = Offer.objects.get(pk=selected_offer_id)
    #         except Offer.DoesNotExist:
    #             return Response({'message': 'Selected offer does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    #         # Check if the selected offer is applicable
    #         if selected_offer.MinimumAmount > cart.Total or selected_offer.MinimumAmount > subtotal:
    #             return Response({'message': 'Selected offer is not applicable to the cart'}, status=status.HTTP_400_BAD_REQUEST)

    #     # Apply offer
    #     if selected_offer:
    #         print("Applying Offer:", selected_offer)
    #         subtotal_with_discount = subtotal - (subtotal * (selected_offer.DiscountPercentage / 100))
    #         cart_item_data = {
    #             'Cart_ID': cart,
    #             'Item_ID': item,
    #             'ItemQuantity': quantity,
    #             'Subtotal': subtotal_with_discount,  # Use the discounted subtotal
    #             # 'Total':subtotal,
    #             'Offer_ID': selected_offer  # Assign the selected offer to the cart item
    #             }
    #     else:
    #         cart_item_data = {
    #             'Cart_ID': cart,
    #             'Item_ID': item,
    #             'ItemQuantity': quantity,
    #             'Subtotal': subtotal,
    #             }
    #     cart_item = Cart_Details.objects.create(**cart_item_data)

    #     # cart_item = Cart_Details.objects.create(Cart_ID=cart, Item_ID=item, ItemQuantity=quantity, Subtotal=subtotal_with_discount,Offer_ID=selected_offer)#Subtotal =subtotal,

        
    #     # Update total price in the cart
    #     cart.Total += subtotal
    #     cart.save()

    #     response_data = {
    #         'message': 'Item added to the cart successfully',
    #         'cart_item': Cart_DetailsSerializer(cart_item).data,
    #     }

    #     return Response(response_data, status=status.HTTP_201_CREATED)
        
#---------------------------------------------------------------------------
    # def post(self, request, *args, **kwargs):
    #     # Add a new item to the cart
    #     serializer = Cart_DetailsSerializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
        

    #     cart = Cart_M.objects.get(User_ID=self.request.user)
    #     item = serializer.validated_data['Item_ID']
    #     quantity = serializer.validated_data['ItemQuantity']
    #     subtotal = item.ItemPrice * quantity
    #     total=item.ItemPrice * quantity
    #     # we have to make channges in model ,have to add offerid in cart_m and order m
    #     #else there are minr changes 
    #      # Check if an offer is selected 
    #     selected_offer_id = request.data.get('Offer_ID')
    #     print("Selected Offer ID:", selected_offer_id)
    #     selected_offer = None

    #     if selected_offer_id:
    #     # User has selected an offer

    #         try:
    #             selected_offer = Offer.objects.get(pk=selected_offer_id)
    #         except Offer.DoesNotExist:
    #             return Response({'message': 'Selected offer does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    #         # Check if the selected offer is applicable
    #         if selected_offer.MinimumAmount > cart.Total or selected_offer.MinimumAmount > subtotal:
    #             return Response({'message': 'Selected offer is not applicable to the cart'}, status=status.HTTP_400_BAD_REQUEST)

    #     # Apply offer
    #     if selected_offer:
    #         print("Applying Offer:", selected_offer)
    #         subtotal_with_discount = total - (total * (selected_offer.DiscountPercentage / 100))
    #         cart_item_data = {
    #             'Cart_ID': cart,
    #             'Item_ID': item,
    #             'ItemQuantity': quantity,
    #             'Subtotal': subtotal
    #             # 'Total':subtotal,
                
    #             }
            
    #     else:
    #         cart_item_data = {
    #             'Cart_ID': cart,
    #             'Item_ID': item,
    #             'ItemQuantity': quantity,
    #             'Subtotal': subtotal,
    #             }
    #     cart_item = Cart_Details.objects.create(**cart_item_data)

    #     # cart_item = Cart_Details.objects.create(Cart_ID=cart, Item_ID=item, ItemQuantity=quantity, Subtotal=subtotal_with_discount,Offer_ID=selected_offer)#Subtotal =subtotal,

        
    #     # Update total price in the cart
    #     cart.Total += subtotal_with_discount
    #     cart.save()

    #     response_data = {
    #         'message': 'Item added to the cart successfully',
    #         'cart_item': Cart_DetailsSerializer(cart_item).data,
    #     }

    #     return Response(response_data, status=status.HTTP_201_CREATED)
#------------------------------------------------------------------------------------------
        

# class CartDetailView(APIView):
#     # ... existing methods ...

#__________________________________________________________________________________________________

    # def post(self, request, *args, **kwargs):
    #      # Determine Cart_ID based on the user making the request
    #     print("--------------------------------------------------------------")
    #     print(f"User ID: {request.user.id}")
    #     # cart_id,created = Cart_M.objects.get_or_create(User_ID=request.user).CartID
        
    #     cart_obj, created = Cart_M.objects.get_or_create(User_ID=request.user)
    #     cart_id = cart_obj.CartID
        
    #     print(f"Cart ID: {cart_id}, Created: {created}")
    #     # Add Cart_ID to the request data
    #     request.data['Cart_ID'] = cart_id

    #     serializer = Cart_DetailsSerializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)

    #     cart = Cart_M.objects.get_or_create(User_ID=self.request.user)
    #     item = serializer.validated_data['Item_ID']
    #     quantity = serializer.validated_data['ItemQuantity']
    #     total = item.ItemPrice * quantity
    #     if cart.Offer_ID:
    #         return Response({'message': 'An offer is already applied to the cart'}, status=status.HTTP_400_BAD_REQUEST)

    #     # Check if the user already has a cart for the same cafe
    #     existing_cart = Cart_M.objects.filter(User_ID=User, Cafe_ID=item.Cafe_ID).first()
    #     if existing_cart:
    #             # Update the existing cart's total by adding the price of the selected item
    #             existing_cart.Total += total
    #             existing_cart.save()
    #             cart = existing_cart
    #     else:
    #             # Create a new cart and set its total to the price of the selected item
    #             cart = Cart_M.objects.create(User_ID=User, Cafe_ID=item.Cafe_ID, Total=total)
        
    #     # Check if an offer is selected
    #     selected_offer_id = request.data.get('Offer_ID')
    #     selected_offer = None

    #     if selected_offer_id:
    #         # User has selected an offer
    #         try:
    #             selected_offer = Offer.objects.get(pk=selected_offer_id)
    #         except Offer.DoesNotExist:
    #             return Response({'message': 'Selected offer does not exist'}, status=status.HTTP_400_BAD_REQUEST)

    #     # Apply offer to the entire cart
    #     with transaction.atomic():
    #         if selected_offer:
    #             print("Applying Offer:", selected_offer)
    #             cart.Total -= cart.Total * (selected_offer.DiscountPercentage / 100)
    #             cart.Offer_ID = selected_offer
    #             cart.save()

    #         # Add the selected item to the cart details
    #         subtotal = item.ItemPrice * quantity
    #         Cart_Details.objects.create(Cart_ID=cart, Item_ID=item, ItemQuantity=quantity, Subtotal=subtotal)

    #     response_data = {
    #         'message': 'Item added to the cart successfully',
    #         'cart': Cart_MSerializer(cart).data,
    #     }

    #     return Response(response_data, status=status.HTTP_201_CREATED)
    def post(self, request, *args, **kwargs):
    # Retrieve or create a cart based on the user making the request
        cart_obj, created = Cart_M.objects.get_or_create(User_ID=request.user)
        cart_id = cart_obj.CartID

    # Create a mutable copy of the request data
        data = request.data.copy()
        # Add the Cart_ID to the data
        print("-------------------------------")
        print(data)
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

        # if cart_obj.Offer_ID:
        #     # if cart_obj.Offer_ID:
        #     old_offer = cart_obj.Offer_ID
        #     cart_obj.Total += cart_obj.Total * (old_offer.DiscountPercentage / 100)

        #     return Response({'message': 'An offer is already applied to the cart'}, status=status.HTTP_400_BAD_REQUEST)
    # Apply offer to the entire cart
        if selected_offer:
            cart_obj.Total -= cart_obj.Total * (selected_offer.DiscountPercentage / 100)
            cart_obj.Offer_ID = selected_offer

    # Add the selected item to the cart details
        item = serializer.validated_data['Item_ID']
        quantity = serializer.validated_data['ItemQuantity']
        # subtotal = item.ItemPrice * quantity
        # Cart_Details.objects.create(Cart_ID=cart_obj, Item_ID=item, ItemQuantity=quantity, Subtotal=subtotal)
        discount_factor = 1 - (selected_offer.DiscountPercentage / 100) if selected_offer else 1
        subtotal = item.ItemPrice * quantity * discount_factor
        cmst = item.ItemPrice * quantity
        # Cart_Details.objects.create(Cart_ID=cart_obj, Item_ID=item, ItemQuantity=quantity, Subtotal=subtotal)

        # Try to find an existing cart detail for the item
        # try:
        #     cart_detail = Cart_Details.objects.get(Cart_ID=cart_obj, Item_ID=item)
        #     # If the cart detail exists, update the quantity and subtotal
        #     cart_detail.ItemQuantity += quantity
        #     cart_detail.Subtotal += subtotal * discount_factor
        #     cart_detail.save()
        # except Cart_Details.DoesNotExist:
            # If the cart detail does not exist, create a new one
            # Cart_Details.objects.create(Cart_ID=cart_obj, Item_ID=item, ItemQuantity=quantity, Subtotal=subtotal)
        # Check if a cart detail for the item already exists
        cart_details = Cart_Details.objects.filter(Cart_ID=cart_obj, Item_ID=item)
        # print(cart_details.exists())
        # print(cart_details)
        # print(item)
              
        if cart_details.exists():
        # If the cart detail exists, update the quantity and subtotal
            cart_detail = cart_details.first()
            # print(cart_details.first())
            cart_detail.ItemQuantity += quantity
            # print(cart_details.ItemQuantity)
            cart_detail.Subtotal += subtotal * discount_factor
            cart_detail.save()
        else:
        # If the cart detail does not exist, create a new one
            Cart_Details.objects.create(Cart_ID=cart_obj, Item_ID=item, ItemQuantity=quantity, Subtotal=subtotal)
            # print(Cart_Details.objects.create())


    # Update the total in the Cart_M model
        cart_obj.Total += subtotal *discount_factor
        # cart_obj.Subtotal += discount_factor
        cart_obj.Subtotal += cmst
        cart_obj.save()

        response_data = {
            'message': 'Item added to the cart successfully',
            'cart': Cart_MSerializer(cart_obj).data,
        }

        return Response(response_data, status=status.HTTP_201_CREATED)


#--------------------------OLD---------------------------------------------
    
    # def put(self, request, *args, **kwargs):
    #     # Update quantity or other details of a cart item
    #     cart_item = Cart_Details.objects.get(pk=request.data.get('Cart_Item_ID'))
    #     serializer = Cart_DetailsSerializer(cart_item, data=request.data,partial=True)
    #     serializer.is_valid(raise_exception=True)
    #     serializer.save()
    #     print(f"Updated Subtotal in Database: {cart_item.Subtotal}")

    #     # Update total price in the cart
    #     cart = cart_item.Cart_ID
    #     # cart.Total += cart_item.Subtotal - serializer.validated_data.get('Subtotal',0)
    #     # cart.Total += cart_item.Subtotal - serializer.initial_data['Subtotal']
    #     # cart.Total += cart_item.Subtotal - serializer.initial_data.get('Subtotal',0)

    #     # Calculate the updated subtotal based on the updated 'ItemQuantity' or other relevant fields
    #     updated_quantity = serializer.validated_data.get('ItemQuantity', cart_item.ItemQuantity)
    #     updated_subtotal = cart_item.Item_ID.ItemPrice * updated_quantity
    #     # print(cart.Total)
    #     # print(cart_item.Subtotal)
    #     # print(serializer.initial_data)
        
       
    #     cart_item.Subtotal = updated_subtotal
    #     cart_item.save()

    #     # tp =20000 
    #     # Update total price in the cart
    #     cart.Total += updated_subtotal - cart_item.Subtotal
    #     cart.save()
    #     print(f"Updated Quantity: {updated_quantity}")
    #     print(f"Updated Subtotal: {updated_subtotal}")
    #     print(f"Old Subtotal: {cart_item.Subtotal}")
    #     print(f"Total: {cart.Total}")

    #     updated_cart_item = Cart_Details.objects.get(pk=cart_item.pk)
    #     updated_cart_item_serializer = Cart_DetailsSerializer(updated_cart_item).data

    #     # return Response({'message': 'Cart item updated successfully'})
    #     response_data = {
    #         'message': 'Cart item updated successfully',
    #         'updated_cart_item': updated_cart_item_serializer,
    #     }
    #     return Response(response_data)

#------------------------------------------------------------------------------------
    # def put(self, request, *args, **kwargs):
    #     # Update quantity or other details of a cart item
    #     cart_item = Cart_Details.objects.get(pk=request.data.get('Cart_Item_ID'))
    #     serializer = Cart_DetailsSerializer(cart_item, data=request.data, partial=True)
    #     serializer.is_valid(raise_exception=True)
    #     serializer.save()

    #     total=0

    #     selected_offer = None
    #     # Use a transaction to ensure atomicity
    #     with transaction.atomic():
    #         # Update total price in the cart
    #         cart = cart_item.Cart_ID
    #         updated_quantity = serializer.validated_data.get('ItemQuantity', cart_item.ItemQuantity)
    #         updated_subtotal = cart_item.Item_ID.ItemPrice * updated_quantity
    #         cart_item.Subtotal = updated_subtotal
    #         cart_item.save()

    #         # Update total price in the cart
    #         # cart.Total += updated_subtotal - cart_item.Subtotal
    #         # cart.Total = updated_subtotal 
    #         # cart.Total -= cart.Total * (selected_offer.DiscountPercentage / 100)
    #         # cart.save()

    #         # Update Offer_ID in Cart_M if needed
    #         selected_offer_id = request.data.get('Offer_ID')
    #         if selected_offer_id:
    #             try:
    #                 selected_offer = Offer.objects.get(pk=selected_offer_id)
    #             except Offer.DoesNotExist:
    #                 return Response({'message': 'Selected offer does not exist'}, status=status.HTTP_400_BAD_REQUEST)

    #         # if selected_offer.MinimumAmount <= cart.Total:  # Check if the offer is applicable

    #         #     # Update Offer_ID in Cart_M
    #         #     # cart.Offer_ID= selected_offer_id
    #         #     cart.Offer_ID = selected_offer
    #         #     # cart.Total = cart_item.Subtotal
    #         #     cart.save()
    #          # Calculate total based on the subtotal and discount
    #     if selected_offer and selected_offer.MinimumAmount <= cart.Total:
    #         discount_percentage = selected_offer.DiscountPercentage
    #         total = updated_subtotal - (updated_subtotal * (discount_percentage / 100))
            
    #     else:
            
    #         total = updated_subtotal
    #         cart.Total += total

    #     cart_item.Subtotal = updated_subtotal
    #     cart_item.save()

    #     # Update total price in the cart
    #     # sm = total - cart_item.Subtotal
    #     cart.Total += total - cart_item.Subtotal

    #     cart.save()

    #     # Update Offer_ID in Cart_M if needed
    #     if selected_offer :
    #         cart.Offer_ID = selected_offer
    #         # cart.Total = total - sm
    #         cart.save()
    #     else:
    #         cart.Offer_ID = None
    #         # cart.Total = total 

    #         cart.save()
        


    #     updated_cart_item = Cart_Details.objects.get(pk=cart_item.pk)
    #     updated_cart_item_serializer = Cart_DetailsSerializer(updated_cart_item).data
    #     print(f"Cart ID: {cart_item.Cart_ID}")
    #     print(f"Updated Subtotal: {updated_subtotal}")
    #     print(f"Selected Offer ID: {selected_offer_id}")
    #     print(f"Cart ID: {cart_item.Cart_ID}")
    #     print(f"Updated Subtotal: {updated_subtotal}")
    #     print(f"Selected Offer ID: {selected_offer_id}")
    #     print(f"Updated Cart Offer ID: {cart.Offer_ID}")
    #     print(f"Updated Cart Offer ID: {cart.Offer_ID.OfferID}")
    #     print(f"Updated Cart Offer Title: {cart.Offer_ID.OfferTitle}")



    #     response_data = {
    #         'message': 'Cart item updated successfully',
    #         'updated_cart_item': updated_cart_item_serializer,
    #     }
    #     return Response(response_data)
    #------------------------------------------------------------------------------------------------------

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
        discount_factor = 1 - (selected_offer.DiscountPercentage / 100) if selected_offer else 1
        subtotal = item.ItemPrice * quantity * discount_factor

        
    # Try to find an existing cart detail for the item
        cart_detail, created = Cart_Details.objects.get_or_create(Cart_ID=cart_obj, Item_ID=item)
        if created:
        # If the cart detail was created, set the quantity and subtotal
            cart_detail.ItemQuantity = quantity
            cart_detail.Subtotal = subtotal
        else:
        # If the cart detail already exists, update the quantity and subtotal
            cart_detail.ItemQuantity += quantity
            cart_detail.Subtotal += subtotal * discount_factor

        cart_detail.save()

        # Update the total in the Cart_M model
        cart_obj.Total += subtotal
        cart_obj.save()

        response_data = {
        'message': 'Item updated in the cart successfully',
        'cart': Cart_MSerializer(cart_obj).data,
        }

        return Response(response_data, status=status.HTTP_200_OK)
    
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
            'RAZORPAY_ORDER_ID:':razorpay_order_id
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
    def post(self,request):
        transaction = Payment_MSerializer
        data=request.data
        if transaction.is_valid():
            rapy_client=verify_payment(
                razorpay_order_id= Payment_MSerializer.validated_data.get("razorpay_order_id"),
                razorpay_payment_id= Payment_MSerializer.validated_data.get("razorpay_payment_id"),
                razorpay_signature= Payment_MSerializer.validated_data.get("razorpay_signature")
            )
            transaction.save()
            response = {
                "status_code:":status.HTTP_201_CREATED,
                "message":"transaction created"
            }
            return Response(response,status=status.HTTP_201_CREATED)
        else:
            response = {
                "statuc_code:":status.HTTP_201_CREATED,
                "message:":"bad request",
                "error":transaction.error
            }
            return Response(response,status=status.HTTP_400_BAD_REQUEST)
 
