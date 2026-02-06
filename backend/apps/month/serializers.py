from rest_framework import serializers
from .models import Month

class MonthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Month
        fields = ('__all__')
        read_only_fields = ('id', 'relation', 'month', 'year', 'created_at')
        
