# Generated by Django 5.1 on 2025-01-03 22:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0002_inventory_typeofitem_alter_inventory_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inventory',
            name='typeofitem',
            field=models.CharField(default='Quantity', max_length=50),
        ),
    ]
