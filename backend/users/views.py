from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.conf import settings
from .serializers import (
    RegisterSerializer, UserSerializer, MedicalRecordSerializer, MedicalDocumentSerializer,
    EstablishmentSerializer, DoctorProfileSerializer, AppointmentSerializer, MedicalNoteSerializer,
    ReportSerializer, AdminUserSerializer, WomensHealthProfileSerializer, CycleLogSerializer
)
from .models import MedicalRecord, MedicalDocument, Establishment, DoctorProfile, Appointment, MedicalNote, Report, WomensHealthProfile, CycleLog
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import anthropic

User = get_user_model()
GOOGLE_CLIENT_ID = "669016168848-gja4t0f26841vo1mjhvmhckkeuajvt0i.apps.googleusercontent.com"


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Account created successfully',
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {'error': 'Invalid username or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)
    return Response({
        'message': 'Login successful',
        'user': UserSerializer(user).data,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_profile(request):
    return Response(UserSerializer(request.user).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_health_assistant(request):
    user_message = request.data.get('message', '')
    feature = request.data.get('feature', 'general')
    language = request.data.get('language', 'EN')

    if not user_message:
        return Response(
            {'error': 'Message is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if language == 'FR':
        system_prompt = """Tu es un assistant médical professionnel pour AnasHealthcare,
        une plateforme de santé numérique au Cameroun. Tu fournis des conseils médicaux
        précis, fiables et adaptés au contexte camerounais.

        Règles importantes:
        - Toujours recommander de consulter un médecin pour les cas graves
        - Mentionner les médicaments disponibles au Cameroun
        - Adapter les conseils au climat et contexte camerounais
        - Être clair, simple et professionnel
        - Pour les urgences, toujours donner les numéros d'urgence: SAMU 15, Pompiers 18, Police 17
        - Ne jamais remplacer un avis médical professionnel
        """
    else:
        system_prompt = """You are a professional medical assistant for AnasHealthcare,
        a digital health platform in Cameroon. You provide accurate, reliable medical
        guidance adapted to the Cameroonian context.

        Important rules:
        - Always recommend consulting a doctor for serious cases
        - Mention medications available in Cameroon
        - Adapt advice to Cameroon's climate and context
        - Be clear, simple and professional
        - For emergencies, always provide emergency numbers: SAMU 15, Fire 18, Police 17
        - Never replace professional medical advice
        """

    if feature == 'emergency':
        system_prompt += "\nFocus on: Step-by-step emergency first aid instructions. Be very clear and numbered."
    elif feature == 'drugs':
        system_prompt += "\nFocus on: Drug information, dosages, uses, side effects and precautions."
    elif feature == 'education':
        system_prompt += "\nFocus on: Health education, disease prevention and healthy lifestyle tips."
    else:
        system_prompt += "\nProvide general health guidance and wellness advice."

    try:
        client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        message = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=1024,
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_message}
            ]
        )
        return Response({
            'response': message.content[0].text,
            'feature': feature
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def google_login(request):
    token = request.data.get("credential")
    if not token:
        return Response({"error": "No credential provided"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=60
        )

        email = idinfo.get("email")
        first_name = idinfo.get("given_name", "")
        last_name = idinfo.get("family_name", "")

        if not email:
            return Response({"error": "Google token missing email"}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(email=email, defaults={
            "username": email,
            "first_name": first_name,
            "last_name": last_name,
            "role": "user"
        })

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "message": "Login successful",
                "user": UserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK,
        )
    except ValueError as e:
        print(f"Google Verification Error: {e}")
        return Response({"error": f"Invalid Google token: {str(e)}"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def get_medical_record(request):
    record, created = MedicalRecord.objects.get_or_create(user=request.user)
    if request.method == "GET":
        serializer = MedicalRecordSerializer(record)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = MedicalRecordSerializer(record, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def medical_documents_list_create(request):
    if request.method == "GET":
        docs = MedicalDocument.objects.filter(user=request.user).order_by("-created_at")
        serializer = MedicalDocumentSerializer(docs, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = MedicalDocumentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def medical_document_delete(request, pk):
    try:
        doc = MedicalDocument.objects.get(pk=pk, user=request.user)
        doc.delete()
        return Response({"message": "Document deleted successfully"}, status=status.HTTP_200_OK)
    except MedicalDocument.DoesNotExist:
        return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def establishments_list_create(request):
    if request.method == "GET":
        establishments = Establishment.objects.all().order_by("name")
        serializer = EstablishmentSerializer(establishments, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        if request.user.role != "admin":
            return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
        serializer = EstablishmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST", "PUT"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def doctors_list_update(request):
    if request.method == "GET":
        me_param = request.query_params.get("me")
        if me_param == "true":
            profile, created = DoctorProfile.objects.get_or_create(user=request.user, defaults={
                "specialty": "Médecine Générale",
                "license_number": "PENDING-000",
            })
            serializer = DoctorProfileSerializer(profile)
            return Response(serializer.data)

        if request.user.role == "admin":
            profiles = DoctorProfile.objects.all()
        else:
            profiles = DoctorProfile.objects.filter(verification_status="approved")

        serializer = DoctorProfileSerializer(profiles, many=True)
        return Response(serializer.data)

    profile, created = DoctorProfile.objects.get_or_create(user=request.user, defaults={
        "specialty": "Médecine Générale",
        "license_number": "PENDING-000",
    })

    serializer = DoctorProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def doctor_verify(request, pk):
    if request.user.role != "admin":
        return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)

    try:
        profile = DoctorProfile.objects.get(pk=pk)
    except DoctorProfile.DoesNotExist:
        return Response({"error": "Doctor profile not found"}, status=status.HTTP_404_NOT_FOUND)

    status_val = request.data.get("status")
    reason = request.data.get("rejection_reason", "")

    if status_val not in ["approved", "rejected"]:
        return Response({"error": "Invalid verification status value"}, status=status.HTTP_400_BAD_REQUEST)

    profile.verification_status = status_val
    if status_val == "rejected":
        profile.rejection_reason = reason
    profile.save()

    return Response(DoctorProfileSerializer(profile).data, status=status.HTTP_200_OK)


@api_view(["GET", "POST", "PUT"])
@permission_classes([IsAuthenticated])
def appointments_list_create_update(request):
    user = request.user
    if request.method == "GET":
        if user.role == "admin":
            appointments = Appointment.objects.all().order_by("-date", "-time_slot")
        elif user.role == "doctor":
            appointments = Appointment.objects.filter(doctor=user).order_by("-date", "-time_slot")
        else:
            appointments = Appointment.objects.filter(patient=user).order_by("-date", "-time_slot")
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        data = request.data.copy()
        data["patient"] = user.id
        serializer = AppointmentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "PUT":
        appointment_id = request.data.get("id")
        try:
            appointment = Appointment.objects.get(id=appointment_id)
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)

        if user.role != "admin" and appointment.doctor != user and appointment.patient != user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def medical_notes_list_create(request):
    user = request.user
    if request.method == "GET":
        patient_id = request.query_params.get("patient_id")
        if not patient_id:
            return Response({"error": "patient_id parameter required"}, status=status.HTTP_400_BAD_REQUEST)

        if user.role != "doctor" and str(user.id) != str(patient_id) and user.role != "admin":
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        notes = MedicalNote.objects.filter(patient_id=patient_id).order_by("-created_at")
        serializer = MedicalNoteSerializer(notes, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        if user.role != "doctor":