from rest_framework import serializers
from rest_framework_simplejwt.tokens import Token
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer #date :7/01/2024
from rest_framework_simplejwt.views import TokenObtainPairView
#from backend.account.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name','last_name','mobile_no','password','email']
        extra_kwargs = { #------------  to hide passw0rd inshort hashed 
            'password' : {'write_only': True}
        }#---------------------continue-----
    
    def create(self, validated_data):#validated_data: is all the //fields are provided then this will pass
        password = validated_data.pop('password',None)
        instance = self.Meta.model(**validated_data) #**validated_data = extracted data without password
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance#-------------------End------------


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user) # super(): to ensure that any changes made in the future to the get_token method in the TokenObtainPairSerializer class will automatically be reflected in MyObtainPairSerializer without duplicating the code
    
        #Add custom claims
        token['username'] = user.get_full_name()

        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer