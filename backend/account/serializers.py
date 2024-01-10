from rest_framework import serializers
from rest_framework_simplejwt.tokens import Token
from .models import User,Roles,Address,City,State,Status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer #date :7/01/2024
from rest_framework_simplejwt.views import TokenObtainPairView
#from backend.account.models import User

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model=State
        fields = '__all__'
    
class CitySerializer(serializers.ModelSerializer):
    State = StateSerializer()
    class Meta:
        model = City
        fields = '__all__'

class AddressSerializer(serializers.ModelSerializer):
    City = CitySerializer()
    class Meta:
        model = Address
        fields = '__all__'

class RolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = '__all__'

class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = '__all__'



class UserSerializer(serializers.ModelSerializer):
    Address = AddressSerializer(many = True)
    class Meta:
        model = User
        fields = ['id','first_name','last_name','mobile_no','password','email','Address','dob','Profile_Picture','Gender']
        extra_kwargs = { #------------  to hide passw0rd inshort hashed 
            'password' : {'write_only': True}
        }#---------------------continue-----
    
    def create(self, validated_data):#validated_data: is all the //fields are provided then this will pass
        password = validated_data.pop('password',None)
        address_data = validated_data.pop('Address', [])
        instance = self.Meta.model(**validated_data) #**validated_data = extracted data without password
        if password is not None:
            instance.set_password(password)
        instance.save()
            
     # Creating address instances
        for address_item in address_data :
            city_data = address_item.pop('City', {})
            state_data = city_data.pop('State', {})

            state_serializer = StateSerializer(data=state_data)
            state_serializer.is_valid(raise_exception=True)
            state = state_serializer.save()

            city_serializer = CitySerializer(data={**city_data, 'State': state})
            city_serializer.is_valid(raise_exception=True)
            city = city_serializer.save()

            Address.objects.create(User=instance, City=city, **address_item)

            # Set the role based on the registration URL
        registration_url = self.context['request'].get_full_path()

        if 'manager' in registration_url:
            role_name = 'Manager'
        elif 'delivery_person' in registration_url:
            role_name = 'Delivery Person'
        elif 'customer' in registration_url:
            role_name = 'Customer'
        else:
            role_name = 'Customer'  

        try:
            role = Roles.objects.get(Role_Name=role_name)
            instance.Role = role
        except Roles.DoesNotExist:
            pass  # role is not found         
        
        # Assign default status 
        # try:
        #     default_status = Status.objects.get(Status_name='Default')
        #     instance.Status = default_status
        # except Status.DoesNotExist:
        #     pass  # Handle the case where the status is not found (customize as needed)

        instance.save()
        return instance




       


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user) # super(): to ensure that any changes made in the future to the get_token method in the TokenObtainPairSerializer class will automatically be reflected in MyObtainPairSerializer without duplicating the code
    
        #Add custom claims
        token['username'] = user.get_full_name()

        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer