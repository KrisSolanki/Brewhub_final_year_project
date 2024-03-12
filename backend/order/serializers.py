from rest_framework import serializers
from account.serializers import UserSerializer

from cafe.serializers import MenuSerializer
from .models import *


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model=Offer
        fields = '__all__'

    #----------------------------------------------
class CartDetailsSerializer(serializers.ModelSerializer):
    Item_ID = MenuSerializer()
    Cart_ID = serializers.PrimaryKeyRelatedField(queryset=Cart_M.objects.all(), write_only=True)

    class Meta:
        model = Cart_Details
        fields = "__all__"

class CartMSerializer(serializers.ModelSerializer):
    User_ID = UserSerializer(read_only=True)
    Offer_ID = OfferSerializer(read_only=True)
    cart_details = CartDetailsSerializer(many=True, read_only=True)

    class Meta:
        model = Cart_M
        fields = '__all__'
class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = '__all__'

class Cart_DetailsSerializer(serializers.ModelSerializer):
    # Offer_ID = OfferSerializer()
    Offer_ID = serializers.PrimaryKeyRelatedField(queryset=Offer.objects.all(), allow_null=True, required=False)
    # def create(self, validated_data):
    #     # Ensure Subtotal is set to the default value if not provided
    #     subtotal = validated_data.get('Subtotal', 0)
    #     print(f"Subtotal before setting: {subtotal}")
    #     validated_data['Subtotal'] = subtotal
    #     print(f"Subtotal after setting: {validated_data['Subtotal']}")
    #     return super().create(validated_data)
    class Meta:
        model = Cart_Details
        fields = '__all__'
        # fields = ['CartDetailsID','ItemQuantity','Subtotal','Item_ID','Offer_ID','Cart_ID']





class Cart_MSerializer(serializers.ModelSerializer):
    Cart_ID = Cart_DetailsSerializer(many=True,read_only=True)
    
    # def create(self, validated_data):
    #     # Ensure Subtotal is set to the default value if not provided
    #     subtotal = validated_data.get('Subtotal', 0)
    #     print(f"Subtotal before setting: {subtotal}")
    #     validated_data['Subtotal'] = subtotal
    #     print(f"Subtotal after setting: {validated_data['Subtotal']}")
    #     return super().create(validated_data)

    class Meta:
        model = Cart_M
        fields = '__all__'

class Order_MSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order_M
        fields = '__all__'
        extra_kwargs = {
            'User_ID': {'required': False},
        }

class Order_DetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order_Details
        fields = '__all__'

class Payment_MSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment_M
        fields = '__all__'

