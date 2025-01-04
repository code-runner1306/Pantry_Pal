from django.db import models

# Create your models here.
class Inventory(models.Model):
    name = models.CharField(null=False, max_length=200)
    vendor = models.CharField(null=False, max_length=200, default='None')
    date = models.DateField(auto_now_add=True)
    typeofitem = models.CharField(null=False, default='Quantity', max_length=50)
    quantity = models.PositiveSmallIntegerField(null=False)
    price = models.DecimalField(null=False, max_digits=10, decimal_places=5)
    total = models.DecimalField(null=False, max_digits=10, decimal_places=5)

    def save(self, *args, **kwargs):
        self.total = self.quantity * self.price
        super().save(*args, **kwargs)

    def __str__(self):
        return (f"{self.name}: {self.quantity}")