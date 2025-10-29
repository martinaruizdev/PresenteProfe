from rest_framework import serializers
from core.models import Asistencia

class AsistenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asistencia
        fields = ['id', 'clase', 'alumno', 'metodo', 'timestamp']
        read_only_fields = ['alumno', 'metodo', 'timestamp']