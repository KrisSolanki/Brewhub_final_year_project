# Generated by Django 5.0 on 2024-01-30 18:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0007_alter_order_details_subtotal_alter_order_m_total'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order_m',
            name='Offer_ID',
        ),
        migrations.AddField(
            model_name='order_details',
            name='Offer_ID',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='order.offer'),
        ),
    ]
