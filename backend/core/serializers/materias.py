from rest_framework import serializers
from core.models import Materia

class MateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materia
        fields = ['id', 'nombre', 'descripcion']

    def create(self, validated_data):
        validated_data['docente'] = self.context['request'].user
        return super().create(validated_data)