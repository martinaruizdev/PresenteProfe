from rest_framework import serializers
from core.models import Encuesta, Opcion, Voto

class OpcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opcion
        fields = ['id', 'texto']

class EncuestaSerializer(serializers.ModelSerializer):
    opciones = OpcionSerializer(many=True, write_only=True)
    class Meta:
        model = Encuesta
        fields = ['id', 'clase', 'pregunta', 'estado', 'opciones']

    def create(self, validated_data):
        opciones = validated_data.pop('opciones', [])
        encuesta = Encuesta.objects.create(**validated_data)
        for op in opciones:
            Opcion.objects.create(encuesta=encuesta, **op)
        return encuesta
