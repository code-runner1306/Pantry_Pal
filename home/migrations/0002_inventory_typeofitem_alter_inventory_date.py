# Generated by Django 5.1 on 2025-01-03 22:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='inventory',
            name='typeofitem',
            field=models.CharField(default='Number', max_length=50),
        ),
        migrations.AlterField(
            model_name='inventory',
            name='date',
            field=models.DateField(auto_now_add=True),
        ),
    ]
