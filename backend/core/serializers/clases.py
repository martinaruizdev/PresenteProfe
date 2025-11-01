from rest_framework import serializers
from core.models import Clase, Materia
from .materias import MateriaSerializer

class ClaseSerializer(serializers.ModelSerializer):
    materia = MateriaSerializer(read_only=True)
    materia_id = serializers.PrimaryKeyRelatedField(queryset=Materia.objects.all(), 
    write_only=True, source='materia')
    class Meta:
        model = Clase
        fields = ['id', 'materia', 'materia_id', 'fecha', 'creada_en']