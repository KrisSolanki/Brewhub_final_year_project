from rest_framework import serializers
from .models import Offer, Cart_M, Cart_Details, Order_M, Order_Details, Complaint

class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model=Offer
        fields = '__all__'

class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = '__all__'

class Cart_DetailsSerializer(serializers.ModelSerializer):
    # Offer_ID = OfferSerializer()
    Offer_ID = serializers.PrimaryKeyRelatedField(queryset=Offer.objects.all(), allow_null=True, required=False)

    class Meta:
        model = Cart_Details
        fields = '__all__'

class Cart_MSerializer(serializers.ModelSerializer):
    Cart_D = Cart_DetailsSerializer(many=True,read_only=True)
    class Meta:
        model = Cart_M
        fields = '__all__'

class Order_MSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order_M
        fields = '__all__'

class Order_DetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order_Details
        fields = '__all__'