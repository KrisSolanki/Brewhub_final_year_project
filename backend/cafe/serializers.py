from rest_framework import serializers
from .models import *
from account.serializers  import *

class CafeSerializer(serializers.ModelSerializer):
    cafe_managerid = UserSerializer()
    status = StatusSerializer()
    address = AddressSerializer()

    class Meta:
        model = Cafe
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class SubCategorySerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    class Meta:
        model = SubCategory
        fields = '__all__'

class MenuSerializer(serializers.ModelSerializer):
    cafe = CafeSerializer()
    status = StatusSerializer()
    category = CategorySerializer()
    # subcategory = SubCategorySerializer()

    class Meta:
        model = Menu
        fields = '__all__'

