from django.contrib import admin
from core.models import Perfil, Materia, Clase, Asistencia, Encuesta, Voto


@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    list_display = ('user', 'rol')
    list_filter = ('rol',)
    search_fields = ('user__email', 'user__first_name', 'user__last_name')


@admin.register(Materia)
class MateriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'docente', 'descripcion')
    list_filter = ('docente',)
    search_fields = ('nombre', 'docente__email')


@admin.register(Clase)
class ClaseAdmin(admin.ModelAdmin):
    list_display = ('id', 'materia', 'fecha', 'creada_en')
    list_filter = ('materia', 'fecha')
    search_fields = ('materia__nombre',)
    date_hierarchy = 'fecha'


@admin.register(Asistencia)
class AsistenciaAdmin(admin.ModelAdmin):
    list_display = ('clase', 'alumno', 'metodo', 'timestamp')
    list_filter = ('metodo', 'timestamp', 'clase__materia')
    search_fields = ('alumno__email',)
    date_hierarchy = 'timestamp'
    readonly_fields = ('timestamp',)


@admin.register(Encuesta)
class EncuestaAdmin(admin.ModelAdmin):
    list_display = ('pregunta', 'clase', 'creada_en')
    list_filter = ('creada_en', 'clase__materia')
    search_fields = ('pregunta',)
    date_hierarchy = 'creada_en'


@admin.register(Voto)
class VotoAdmin(admin.ModelAdmin):
    list_display = ('encuesta', 'opcion', 'alumno', 'timestamp')
    list_filter = ('encuesta', 'timestamp')
    search_fields = ('alumno__email', 'encuesta__pregunta')
    date_hierarchy = 'timestamp'
    readonly_fields = ('timestamp',)
