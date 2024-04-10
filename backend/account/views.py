from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed

from backend.settings import EMAIL_HOST_USER
from .serializers import *
from .models import User, Roles, Status, Address, City, State
from rest_framework.decorators import api_view # date:3/01 for otp
from .otpapi import send_otp_to_mobile # date:3/01
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.mail import send_mail
from rest_framework import status
from django.http import HttpRequest
# Create your views here.




#===================== REGISTER ====================
class RegisterView(APIView):
    def get(self,request,*args,**kwargs):
        user = self.request.query_params.get('user')
        users = User.objects.filter(User=user)
        serializer = UserSerializer(users,many=True)
        
        
        return Response(serializer.data)
        

    
    def post(self,request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        mobile_no = request.data['mobile_no']
        print("*******************************")
        print(mobile_no)
        # -------------- using 2factor --------------
        # Generate and send OTP
        # otp = send_otp_to_mobile(mobile_no)
        # user.otp = otp
        #--------------- using twilio --------------
        # otp = send_sms(mobile_no)
        # message = client.messages \
        #                 .create(
        #                     from_ = '+15169732425',
        #                     body = f"Your OTP is {otp} .",
        #                     # body = f"Hello , to reset password click this link http://127.0.0.1:8000/api/register/ ",
        #                     # to = '+91 90543 95987'
        #                     to = '+91'+mobile_no
        #
        

        self.send_welcome_email(user.email, user.first_name, user.last_name)

        # return Response(serializer.data)
        return Response({
            'status': 200,
            'message': 'Registration succesfully '
        })
    
    def send_welcome_email(self, email , first_name, last_name ):
        subject = 'Welcome to Your App!'
        message = (
            f'Dear {first_name} {last_name},\n\n'
            f'Thank you for registering with our App! We are excited to have you on board.\n'
            f'Explore our platform and let us know if you have any questions or need assistance.\n\n'
            f' Regards,\n -Shadow '
        )
        from_email = EMAIL_HOST_USER  # Update with your email
        
        send_mail(subject, message, from_email, [email])

class AddressView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = AddressSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        #serializer.save(user=request.user)
        return Response({
            'status': 200,
            'message': 'Address added succesfully '
        })
    def get(self, request, *args, **kwargs):
        user = self.request.query_params.get('user')
        # a_id = kwargs.get('pk')
        if user is not None:
            users = Address.objects.filter(User=user)
            serializer = AddressGetSerializer(users,many=True)
            return Response(serializer.data)
        address_obj = Address.objects.all()
        serializer = AddressGetSerializer(address_obj, many=True)
        return Response(serializer.data)
  
from .otpapi import *
#===================== LOGIN ====================
class LoginView(APIView): 
    def post(self,request):
        mobile_no = request.data['mobile_no']
        # mobile_no = request.data['mobile_no']
        password = request.data['password']
        

        user = User.objects.filter(mobile_no=mobile_no).first()#finding user 

        if user is None:
            raise AuthenticationFailed('User not found! ')
        
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password! \nPlease enter the correct password.')
        #-------------- using 2factor --------------
        # Generate and send OTP
        # otp = send_otp_to_mobile(mobile_no)
        # user.otp = otp
        #--------------- using twilio --------------
        otp = send_sms(mobile_no)
        message = client.messages \
                        .create(
                            from_ = '+15169732425',
                            body = f"Your OTP is {otp} .",
                            # body = f"Hello , to reset password click this link http://127.0.0.1:8000/api/register/ ",
                            # to = '+91 90543 95987'
                            to = '+91'+mobile_no
                        )
        user.otp = otp
        

        user.save()

        # django_request = HttpRequest()
        # django_request.method = request.method
        # django_request.POST = {'mobile_no': mobile_no, 'password': password}

        # token_obtain_pair_view = MyTokenObtainPairView.as_view()
        # token_response = token_obtain_pair_view(django_request)
        # print("********************************************")
        # print("Token Response Data:", token_response.data)

        # # token = token_response.data['access']
        # token = token_response.data['token']['access']

        return Response({
            'status': 200,
            'message': 'Login successful. OTP sent for verification.',
            'otp_status': 'sent',
            'otp': otp
        })
    
    def get(self,request,*args,**kwargs):
        user = self.request.query_params.get('user')
        users = User.objects.filter(User=user)
        serializer = UserSerializer(users,many=True)
        
        return Response(serializer.data)
    

class MyTokenObtainPairView(TokenObtainPairView): #date : 7/01/2024
    serializer_class = MyTokenObtainPairSerializer



#===================== SEND OTP ====================  delete this block  
#---------- date : 3/01/2024----------otp
# @api_view(['POST'])
# def send_otp(request):
#     data = request.data
    #mobile_no = request.data['mobile_no']
#     if data.get('mobile_no') is None:   #---------if mobile_no is not received 
#         return Response({
#             'status':400,
#             'message':'key mobile_no is required'
#         })
#     if data.get('password') is None:    #---------if password is not received
#         return Response({
#             'status':400,
#             'message':'key password is required'
#         })
    
#     #after creating otpapi.py
#   #  otp = send_otp_to_mobile(data.get('mobile_no'))

#     user = User.objects.create( 
#         mobile_no = data.get('mobile_no'),
#         otp = send_otp_to_mobile(data.get('mobile_no'))
#         )
#     user.set_password(data.get('set_password'))
#     user.save()

#     return Response({
#         'status' : 200 , 'messsage' : 'Otp Sent'
#     })

#--------------------------------------------------------------------
    #send otp endpoint
# @api_view(['POST'])
# def send_otp(request):
#     user = UserSerializer(data=request.data)
#     data = request.data
#     mobile_no = request.data['mobile_no']
#     if data.get('mobile_no') is None:   #---------if mobile_no is not received 
#         return Response({
#             'status':400,
#             'message':'key mobile_no is required'
#         })
#     otp = send_otp_to_mobile(mobile_no)
#     user.otp = otp
    #----------------------------------===================
# @api_view(['POST'])
# def send_otp_to_mobile_view(request):
#     serializer = MobileNumberSerializer(data=request.data)

#     if serializer.is_valid():
#         mobile_no = serializer.validated_data['mobile_no']
#         otp = send_otp_to_mobile(mobile_no)

#         if otp is not None:
#             serializer.validated_data['otp'] = otp
#             return Response({'otp': otp}, status=status.HTTP_200_OK)
#         else:
#             return Response({'error': 'Failed to send OTP'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#     else:
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    

@api_view(['POST'])
def send_otp_to_mobile_view(request):
    serializer = MobileNumberSerializer(data=request.data)

    if serializer.is_valid():
        mobile_no = serializer.validated_data['mobile_no']
        # otp = send_otp_to_mobile(mobile_no)
        otp = send_sms(mobile_no)
        message = client.messages \
                        .create(
                            from_ = '+15169732425',
                            body = f"Your OTP is {otp} .",
                            # body = f"Hello , to reset password click this link http://127.0.0.1:8000/api/register/ ",
                            # to = '+91 90543 95987'
                            to = '+91'+mobile_no
                        )
        
        # serializer.data.otp = otp  # Store the OTP in the serializer

        if otp is not None:
            return Response({'otp': otp}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Failed to send OTP'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['POST'])
# def verify_otp_view_register(request):
#     serializer = MobileNumberSerializer(data=request.data)

#     if serializer.is_valid():
#         mobile_no = serializer.validated_data['mobile_no']
#         otp = serializer.validated_data['otp']
#         entered_otp = request.data.get('otp')  
#         if entered_otp == otp:
#             return Response("verifired")
#     else:
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def verify_otp_view_register(request):
    serializer = MobileNumberSerializer(data=request.data)

    if serializer.is_valid():
        mobile_no = serializer.validated_data['mobile_no']
        # stored_otp = get_stored_otp_for_mobile(mobile_no)  # Implement this function to retrieve stored OTP
        otp = serializer.validated_data['otp']
        entered_otp = serializer.validated_data['otp']

        if entered_otp == otp:
            return Response({'message': 'OTP verified successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#===================== VERIFY OTP ====================
@api_view(['POST']) #------------------- date : 5/01/2024--------------------
def verify_otp(request):
    data = request.data

    if data.get('mobile_no') is None:   #---------if mobile_no is not received 
        return Response({
            'status':400,
            'message':'key mobile_no is required'
        })
    if data.get('otp') is None:    #---------if otp is not received
        return Response({
            'status':400,
            'message':'key otp is required'
        })
    
    try:
        user_obj = User.objects.get(mobile_no = data.get('mobile_no'))

    except Exception as e:
        return Response({
            'status' : 400,
            'message' : 'invalid mobile no '
        }) 
    if user_obj.otp == data.get('otp'):
        user_obj.is_mobile_verified = True
        user_obj.save()
        return Response({
            'status' : 200,
            'message' : 'otp matched'
        })

    return Response({
            'status' : 400,
            'message' : 'Invalid otp'
        }) 




#===================== RESEND OTP ====================
@api_view(['POST'])#-------------------------date:5/01/2024 --------------------
def resend_otp(request):
    data = request.data

    if data.get('mobile_no') is None:
        return Response({
            'status': 400,
            'message': 'key mobile_no is required'
        })

    try:
        user_obj = User.objects.get(mobile_no=data.get('mobile_no'))
    except User.DoesNotExist:
        return Response({
            'status': 400,
            'message': 'Invalid mobile no'
        })
            
    
    #--------------------------------------------------------------------------------------------
    # this block of code Checks if enough time has passed since the last OTP request
    # -------------------------------------------------------------------------------------------
    # current_time = datetime.now()
    # if user_obj.last_otp_request_time:
    #     time_difference = current_time - user_obj.last_otp_request_time
    #     if time_difference < timedelta(seconds=10):
    #         return Response({
    #             'status': 400,
    #             'message': 'Wait for 10 seconds before resending OTP'
    #         })
    #---------------------------------------------------------------------------------------------
    # need to add an extra field in our user model 
    # last_otp_request_time = models.DateTimeField(null=True, blank=True)
    #---------------------------------------------------------------------------------------------

    # send_otp_to_mobile is a function that sends OTP and returns it
    otp = send_otp_to_mobile(data.get('mobile_no'))

    # Update the existing user's OTP
    user_obj.otp = otp
    user_obj.save()

    # Send the new OTP (implement your OTP sending logic here)
    # For example, you can call your existing OTP sending function

    return Response({
        'status': 200,
        'message': 'OTP Resent'
    })



class ChangePasswordView(APIView):
    # permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "Password changed successfully"})
        
class ForgetPasswordView(APIView):
    def post(self,request):
        serializer = ForgetPasswordSerializer(data=request.data,context={'request': request})
        if serializer.is_valid():
            mobileno = serializer.validated_data['mobileno']
            try:
                user = User.objects.get(mobile_no=mobileno)
            except User.DoesNotExist:
                return Response({"message": "User not found"})
            
            if serializer.validated_data['new_password'] != serializer.validated_data['confirm_password']:
                return Response({"message": "New passwords must match"})

            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "Password (forget)changed successfully"})
        else:
            return Response(serializer.errors)
