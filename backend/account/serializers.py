from rest_framework import serializers
from .models import User
#from backend.account.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name','last_name','mobile_no','password','email']