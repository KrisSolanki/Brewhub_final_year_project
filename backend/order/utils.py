# import statistics
import razorpay
from django.conf import settings
from rest_framework import status

# client = razorpay.Client(auth=(
#     settings.RAZORPAY_API_KEY,
#     settings.RAZORPAY_SECRET_KEY
# ))

def create_razorpay_order(order):
    # Initialize Razorpay client
    try:
        client = razorpay.Client(auth=(settings.RAZORPAY_API_KEY,settings.RAZORPAY_SECRET_KEY))

    # Create a Razorpay order
        razorpay_order = client.order.create({
            "amount": int(order.Total * 100), # Convert to paise
            "currency": "INR",
            "receipt": "receipt#" + str(order.OrderID),
            "payment_capture": 1,
    })
    except Exception as e:
        print(e)
    
    print("_______________________________")
    print(razorpay_order)

    # Return the Razorpay Order ID
    return razorpay_order['id']

import hmac
import hashlib
def verify_payment(razorpay_order_id,razorpay_payment_id,razorpay_signature):
    try:

        client = razorpay.Client(auth=(settings.RAZORPAY_API_KEY,settings.RAZORPAY_SECRET_KEY))
        # razorpay_payment = client.payment.verify(razorpay_payment_id, razorpay_order_id, razorpay_signature)
        # razorpay_payment = client.utility.verify({
        #     'razorpay_order_id' : razorpay_order_id,
        #     'razorpay_payment_id' : razorpay_payment_id,
        #     'razorpay_signature' : razorpay_signature,
        # })
        razorpay_payment = client.payment.fetch(razorpay_payment_id)
        if razorpay_payment['order_id'] == razorpay_order_id:
            # Compute the expected signature
            expected_signature = hmac.new(
                settings.RAZORPAY_SECRET_KEY.encode(),
                f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
                hashlib.sha256
            ).hexdigest()

            # Compare the expected signature with the received signature
            if expected_signature == razorpay_signature:
                return razorpay_payment
            else:
                raise ValueError("Invalid signature")
        else:
            raise ValueError("Order ID mismatch")

        #  # Verify payment details
        # razorpay_payment = client.payment.fetch(razorpay_payment_id)
        # if razorpay_payment['order_id'] == razorpay_order_id:
        #     calculated_signature = razorpay.utils.generate_signature(
        #         razorpay_order_id + '|' + razorpay_payment_id,
        #         settings.RAZORPAY_SECRET_KEY
        #     )
        #     if calculated_signature == razorpay_signature:
        #         return razorpay_payment
        #     else:
        #         raise ValueError("Invalid signature")
        # else:
        #     raise ValueError("Order ID mismatch")
    except Exception as e:
        raise ValueError(
            {
                "status_code": status.HTTP_400_BAD_REQUEST,
                "message":str(e)

            }
        )
    return razorpay_payment