from django.contrib import admin
from django.urls import path
from . import views
urlpatterns = [
    path("", views.home, name='home'),
    path("home", views.home, name='home'),
    path("inventory", views.inventory, name='inventory'),
    path("api/inventory/add", views.add_inventory_item, name='add_inventory_item'), #POST: Update an item
    path('api/inventory/<int:item_id>/', views.update_inventory_item, name='update_inventory_item'),  # PUT: Edit an item
    path('api/inventory/delete<int:item_id>/', views.delete_inventory_item, name='delete_inventory_item'),  # DELETE: Delete an item
    path('api/get_statistics', views.statistics, name='get_statistics'),  
    path("statistics", views.stats, name='stats'),
]

