from rest_framework import viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models import Encuesta, Opcion, Voto
from core.serializers import EncuestaSerializer
from core.permissions import IsDocente, IsAlumno

class EncuestaViewSet(viewsets.ModelViewSet):
    serializer_class = EncuestaSerializer
    permission_classes = [IsAuthenticated, IsDocente]

    def get_queryset(self):
        return Encuesta.objects.filter(clase__materia__docente=self.request.user)

    def perform_create(self, serializer):
        serializer.save(creada_por=self.request.user)
    
    @action(detail=True, methods=['post'])
    def abrir(self, request, pk=None):
        e = self.get_object()
        e.estado = 'ABIERTA'
        e.save(update_fields=['estado'])
        return Response({'estado': e.estado})

    @action(detail=True, methods=['post'])
    def cerrar(self, request, pk=None):
        e = self.get_object()
        e.estado = 'CERRADA'
        e.save(update_fields=['estado'])
        return Response({'estado': e.estado})

    @action(detail=True, methods=['get'])
    def resultados(self, request, pk=None):
        e = self.get_object()
        opciones = list(e.opciones.values('id', 'texto'))
        conteos = {op['id']: 0 for op in opciones}
        for v in e.votos.all():
            conteos[v.opcion_id] += 1
        return Response({'pregunta': e.pregunta, 'series': [{'opcion_id': op['id'], 'texto': op['texto'], 'votos': conteos[op['id']] } for op in opciones]})

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAlumno])
def votar(request):
    encuesta_id = int(request.data.get('encuesta_id'))
    opcion_id = int(request.data.get('opcion_id'))
    e = Encuesta.objects.get(id=encuesta_id)
    if e.estado != 'ABIERTA':
        return Response({'detail': 'Encuesta cerrada.'}, status=400)
    op = Opcion.objects.get(id=opcion_id, encuesta=e)
    voto, created = Voto.objects.get_or_create(encuesta=e, alumno=request.user, defaults={'opcion': op})
    if not created:
        voto.opcion = op
        voto.save(update_fields=['opcion'])
    return Response({'ok': True})
