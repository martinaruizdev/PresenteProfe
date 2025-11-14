from urllib.parse import quote
from django.conf import settings
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models import Clase, Asistencia
from core.serializers import ClaseSerializer, AsistenciaSerializer
from api.permissions import IsDocente, IsAlumno
from core.qr import make_qr_token, verify_qr_token, QR_TTL_SECONDS

from openpyxl import Workbook
from openpyxl.utils import get_column_letter
from django.utils.timezone import localtime
import csv


class ClaseViewSet(viewsets.ModelViewSet):
    serializer_class = ClaseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        p = getattr(user, 'perfil', None)
        qs = Clase.objects.all()
        if p and p.rol == 'DOCENTE':
            return qs.filter(materia__docente=user)
        return qs

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsDocente])
    def qr(self, request, pk=None):
        clase = self.get_object()
        token = make_qr_token(clase.id)
        url = f"{settings.FRONTEND_BASE_URL}/checkin?clase_id={clase.id}&token={quote(token)}"
        return Response({
            'token': token,
            'expires_in': QR_TTL_SECONDS,
            'checkin_url': url
        })

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated, IsDocente], url_path='asistencias/export')
    def export_asistencias(self, request, pk=None):
        clase = self.get_object()
        if clase.materia.docente != request.user:
            return Response({'detail': 'No autorizado'}, status=403)

        formato = request.query_params.get('format', 'csv').lower()
        asistencias = (
            Asistencia.objects.filter(clase=clase)
            .select_related('alumno', 'clase__materia')
            .order_by('timestamp')
        )

        if formato == 'xlsx':
            wb = Workbook()
            ws = wb.active
            ws.title = 'Asistencias'
            headers = ['ClaseID', 'Materia', 'FechaClase', 'Alumno', 'Email', 'Metodo', 'RegistradaEn']
            ws.append(headers)

            for a in asistencias:
                ws.append([
                    clase.id,
                    clase.materia.nombre,
                    localtime(clase.fecha).strftime('%Y-%m-%d %H:%M'),
                    f"{a.alumno.first_name} {a.alumno.last_name}".strip() or a.alumno.username,
                    a.alumno.email or a.alumno.username,
                    a.metodo,
                    localtime(a.timestamp).strftime('%Y-%m-%d %H:%M:%S'),
                ])

            for i, _ in enumerate(headers, start=1):
                ws.column_dimensions[get_column_letter(i)].width = 20

            resp = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            resp['Content-Disposition'] = f'attachment; filename=asistencias_clase_{clase.id}.xlsx'
            wb.save(resp)
            return resp

        # CSV por defecto
        resp = HttpResponse(content_type='text/csv; charset=utf-8')
        resp['Content-Disposition'] = f'attachment; filename=asistencias_clase_{clase.id}.csv'
        w = csv.writer(resp)
        w.writerow(['ClaseID', 'Materia', 'FechaClase', 'Alumno', 'Email', 'Metodo', 'RegistradaEn'])

        for a in asistencias:
            w.writerow([
                clase.id,
                clase.materia.nombre,
                localtime(clase.fecha).strftime('%Y-%m-%d %H:%M'),
                f"{a.alumno.first_name} {a.alumno.last_name}".strip() or a.alumno.username,
                a.alumno.email or a.alumno.username,
                a.metodo,
                localtime(a.timestamp).strftime('%Y-%m-%d %H:%M:%S'),
            ])

        return resp

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def estadisticas(self, request, pk=None):
        clase = self.get_object()
        total_alumnos = getattr(clase.materia, 'cantidad_alumnos', 0)
        presentes = Asistencia.objects.filter(clase=clase).count()
        ausentes = max(total_alumnos - presentes, 0)
        return Response({
            'clase_id': clase.id,
            'materia': clase.materia.nombre,
            'presentes': presentes,
            'ausentes': ausentes,
            'total_alumnos': total_alumnos
        })