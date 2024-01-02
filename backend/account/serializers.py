from rest_framework import serializers
from .models import User
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
