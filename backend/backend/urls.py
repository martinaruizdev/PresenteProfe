from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.simplejwt.views import TokenRefreshView

# Importamos desde core.views (re-exporta todo)
from core.views import MateriaViewSet, ClaseViewSet, EncuestaViewSet, marcar_asistencia, votar, google_login

router = DefaultRouter()
router.register(r'materias', MateriaViewSet, basename='materias')
router.register(r'clases', ClaseViewSet, basename='clases')
router.register(r'encuestas', EncuestaViewSet, basename='encuestas')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/google', google_login, name='google_login'),
    path('api/auth/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/asistencias/marcar', marcar_asistencia),
    path('api/votar', votar),
]

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from api.views import MateriaViewSet, ClaseViewSet, EncuestaViewSet, marcar_asistencia, votar, google_login

router = DefaultRouter()
router.register(r'materias', MateriaViewSet, basename='materias')
router.register(r'clases', ClaseViewSet, basename='clases')
router.register(r'encuestas', EncuestaViewSet, basename='encuestas')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/google', google_login, name='google_login'), 
    path('api/auth/refresh', TokenRefreshView.as_view(),
name='token_refresh'),
    path('api/asistencias/marcar', marcar_asistencia),
    path('api/votar', votar),
]
