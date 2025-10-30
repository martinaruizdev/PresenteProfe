from rest_framework.permissions import BasePermission

class IsDocente(BasePermission):
    def has_permission(self, request, view):
        p = getattr(request.user, 'perfil', None)
        return bool(p and p.rol == 'DOCENTE')
        
class IsAlumno(BasePermission):
    def has_permission(self, request, view):
        p = getattr(request.user, 'perfil', None)
        return bool(p and p.rol == 'ALUMNO')