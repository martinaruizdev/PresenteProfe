from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from core.models import Materia
from core.serializers import MateriaSerializer
from core.permissions import IsDocente

class MateriaViewSet(viewsets.ModelViewSet):
    serializer_class = MateriaSerializer
    permission_classes = [IsAuthenticated, IsDocente]

    def get_queryset(self):
        return Materia.objects.filter(docente=self.request.user)

    def perform_create(self, serializer):
        serializer.save(docente=self.request.user)
