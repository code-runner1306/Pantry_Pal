from django.shortcuts import render
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Inventory
from django.utils.dateparse import parse_date
import datetime
from django.db.models import Sum, Count

# Create your views here.
def home(request):
    return render(request, 'index.html')

def inventory(request):
    if request.method=='GET':
        date_str = request.GET.get('date')
        
        # If a date is provided, parse it and filter the inventory items
        if date_str:
            date = parse_date(date_str)
            items = Inventory.objects.filter(date=date)  # Filter by date (ignoring time part)
        else:
            items = Inventory.objects.all()  # If no date is provided, show all items
        total_val = sum(item.quantity * item.price for item in items)
        return render(request, 'inventory.html', {"inventory": items, "total_val": total_val })


@csrf_exempt
@require_http_methods(["POST"])
def add_inventory_item(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)
        item = Inventory(
            name=data['name'].capitalize(),
            vendor=data['vendor'].capitalize(),
            typeofitem = data['typeofitem'].capitalize(),
            quantity=data['quantity'],
            price=data['price']
        )
        item.save()
        return JsonResponse({'status': 'Item added successfully'})
    return JsonResponse({'error': 'Invalid request'}, status=400)

# Update an existing inventory item
@csrf_exempt
@require_http_methods(["PUT"])
def update_inventory_item(request, item_id):
    try:
        item = Inventory.objects.get(id=item_id)
    except Inventory.DoesNotExist:
        return JsonResponse({"error": "Item not found"}, status=404)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)

            # Validate required fields
            name = data.get("name")
            vendor = data.get("vendor")
            typeofitem = data.get("typeofitem")
            quantity = data.get("quantity")
            price = data.get("price")

            if not name or not isinstance(quantity, int) or quantity < 0 or not isinstance(price, (int, float)) or price < 0:
                return JsonResponse({"error": "Invalid data. Ensure 'name', 'quantity' (positive integer), and 'price' (positive number) are provided."}, status=400)

            item.name = name
            item.vendor = vendor
            item.typeofitem = typeofitem
            item.quantity = quantity
            item.price = price
            item.save()

            return JsonResponse({
                "id": item.id,
                "name": item.name,
                "quantity": item.quantity,
                "price": item.price
            })

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

# Delete an inventory item
@csrf_exempt
@require_http_methods(["DELETE"])
def delete_inventory_item(request, item_id):
    try:
        item = Inventory.objects.get(id=item_id)
    except Inventory.DoesNotExist:
        return JsonResponse({"error": "Item not found"}, status=404)

    if request.method == "DELETE":
        item.delete()
        return JsonResponse({"message": "Item deleted successfully"})
    

def stats(request):
    return render(request, 'stats.html')
    

def statistics(request):
    # Calculate the total sum of all items in the Inventory using Django's Sum aggregation
    total_sum = Inventory.objects.aggregate(total_sum=Sum('total'))['total_sum'] or 0

    # Count the total number of items in the Inventory
    total_items = Inventory.objects.count()

    # Calculate the total sum for today's items
    today_sum = Inventory.objects.filter(date=datetime.date.today()).aggregate(today_sum=Sum('total'))['today_sum'] or 0

    # Calculate vendor-specific data
    vendor_stats = Inventory.objects.values('vendor').annotate(
        total_spent=Sum('total'),  # Total spent per vendor
        total_items=Count('id')     # Total items purchased from each vendor
    )

    # Prepare the JSON response
    context = {
        'totalSpent': total_sum,
        'totalItems': total_items,
        'averagePerTrip': total_sum / total_items if total_items > 0 else 0,  # Prevent division by zero
        'vendorStats': list(vendor_stats)  # List of vendors with their stats
    }

    return JsonResponse(context)