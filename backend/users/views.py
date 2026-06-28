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
            return Response({"error": "Only doctors can write medical notes"}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        data["doctor"] = user.id
        serializer = MedicalNoteSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST", "PUT"])
@permission_classes([IsAuthenticated])
def reports_list_create_update(request):
    user = request.user
    if request.method == "GET":
        if user.role != "admin":
            return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
        reports = Report.objects.all().order_by("-created_at")
        serializer = ReportSerializer(reports, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        data = request.data.copy()
        data["reported_by"] = user.id
        serializer = ReportSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "PUT":
        if user.role != "admin":
            return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
        report_id = request.data.get("id")
        try:
            report = Report.objects.get(id=report_id)
        except Report.DoesNotExist:
            return Response({"error": "Report not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ReportSerializer(report, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_analytics(request):
    if request.user.role != "admin":
        return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)

    active_users = User.objects.filter(is_active=True).count()
    patients_count = User.objects.filter(role="user").count()
    doctors_count = User.objects.filter(role="doctor").count()
    pending_doctors = DoctorProfile.objects.filter(verification_status="pending").count()
    appointments_count = Appointment.objects.count()
    completed_appointments = Appointment.objects.filter(status="completed").count()
    establishments_count = Establishment.objects.count()
    reports_count = Report.objects.filter(status="pending").count()

    specialties_searched = [
        {"name": "Médecine Générale", "count": 142},
        {"name": "Pédiatrie", "count": 98},
        {"name": "Cardiologie", "count": 76},
        {"name": "Gynécologie", "count": 54},
        {"name": "Dermatologie", "count": 41}
    ]
    ai_usage_stats = [
        {"month": "Jan", "queries": 150},
        {"month": "Feb", "queries": 180},
        {"month": "Mar", "queries": 220},
        {"month": "Apr", "queries": 270},
        {"month": "May", "queries": 340},
        {"month": "Jun", "queries": 450}
    ]
    emergency_consults = [
        {"name": "Crise cardiaque", "count": 87},
        {"name": "AVC", "count": 64},
        {"name": "Étouffement", "count": 55},
        {"name": "Brûlure", "count": 48}
    ]

    return Response({
        "metrics": {
            "active_users": active_users,
            "patients": patients_count,
            "doctors": doctors_count,
            "pending_doctors": pending_doctors,
            "appointments": appointments_count,
            "completed_appointments": completed_appointments,
            "establishments": establishments_count,
            "pending_reports": reports_count
        },
        "specialties_searched": specialties_searched,
        "ai_usage_stats": ai_usage_stats,
        "emergency_consults": emergency_consults
    })


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def admin_users_list_update(request):
    if request.user.role != "admin":
        return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        users = User.objects.all().order_by("-date_joined")
        serializer = AdminUserSerializer(users, many=True)
        return Response(serializer.data)

    elif request.method == "PUT":
        user_id = request.data.get("id")
        try:
            u = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AdminUserSerializer(u, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def ai_symptom_triage(request):
    free_text = request.data.get("free_text", "").lower()
    selected_symptoms = request.data.get("selected_symptoms", [])

    symptoms_found = set(selected_symptoms)

    keywords_map = {
        "fever": ["fièvre", "fever", "température", "chaud", "temperature"],
        "chills": ["frisson", "chills", "froid", "grelotte"],
        "headache": ["tête", "headache", "migraine", "crâne"],
        "fatigue": ["fatigue", "fatigué", "courbature", "épuisé", "corps"],
        "abdominal_pain": ["ventre", "estomac", "abdominal", "abdomen", "stomach", "crampe"],
        "nausea_vomiting": ["vomir", "nausée", "nausea", "vomissement", "mal au cœur", "haut-le-cœur"],
        "chest_pain": ["poitrine", "thorax", "chest", "cœur", "coeur", "heart", "oppression"],
        "breathing_difficulty": ["respirer", "souffle", "breath", "étouffe", "dyspnée"],
        "cough": ["toux", "tousser", "cough", "bronche"],
        "arm_pain": ["bras", "épaule", "mâchoire", "irradie", "left arm"],
        "diarrhea": ["diarrhée", "diarrhea", "selle"],
        "stiff_neck": ["cou", "nuque", "neck", "raideur"],
        "light_sound_sensitivity": ["lumière", "light", "bruit", "sound", "photorhobie", "phonophobie"]
    }

    for symptom_id, keywords in keywords_map.items():
        if any(kw in free_text for kw in keywords):
            symptoms_found.add(symptom_id)

    DISEASE_DB = [
        {
            "id": "malaria",
            "name": {"EN": "Malaria Suspected", "FR": "Paludisme Suspecté"},
            "specialty": "General Medicine",
            "symptoms": ["fever", "chills", "headache", "fatigue"],
            "desc": {
                "EN": "A common tropical disease transmitted by mosquitoes. Symptoms include cyclical high fevers, chills, headache, and severe fatigue.",
                "FR": "Une maladie tropicale courante transmise par les moustiques. Les symptômes incluent des fièvres cycliques élevées, des frissons, des maux de tête et une fatigue intense."
            }
        },
        {
            "id": "appendicitis",
            "name": {"EN": "Acute Appendicitis Suspected", "FR": "Appendicite Aiguë Suspectée"},
            "specialty": "General Surgery",
            "symptoms": ["abdominal_pain", "nausea_vomiting", "fever"],
            "desc": {
                "EN": "Inflammation of the appendix, often starting around the navel and migrating to the lower right abdomen. Requires quick surgical evaluation.",
                "FR": "Inflammation de l'appendice, commençant souvent autour du nombril et migrant vers le bas droit de l'abdomen. Nécessite une évaluation chirurgicale rapide."
            }
        },
        {
            "id": "cardiac",
            "name": {"EN": "Angina / Coronary Syndrome Suspected", "FR": "Angine de poitrine / Syndrome Coronarien Suspecté"},
            "specialty": "Cardiology",
            "symptoms": ["chest_pain", "breathing_difficulty", "arm_pain", "nausea_vomiting"],
            "desc": {
                "EN": "Heart muscle distress due to restricted blood flow. Characterized by tight chest pain, left-arm pain, and shortness of breath.",
                "FR": "Détresse du muscle cardiaque due à un flux sanguin restreint. Caractérisée par une douleur thoracique serrante, une douleur au bras gauche et un essoufflement."
            }
        },
        {
            "id": "migraine",
            "name": {"EN": "Migraine Suspected", "FR": "Migraine Suspectée"},
            "specialty": "Neurology",
            "symptoms": ["headache", "nausea_vomiting", "light_sound_sensitivity"],
            "desc": {
                "EN": "A neurological condition causing moderate to severe throbbing headaches, often accompanied by nausea and high sensitivity to light or sound.",
                "FR": "Une affection neurologique provoquant des maux de tête pulsatiles modérés à sévères, souvent accompagnés de nausées et d'une grande sensibilité à la lumière ou au bruit."
            }
        },
        {
            "id": "bronchitis",
            "name": {"EN": "Bronchitis / Pneumonia Suspected", "FR": "Bronchite / Pneumonie Suspectée"},
            "specialty": "Pulmonology",
            "symptoms": ["cough", "breathing_difficulty", "fever", "chest_pain"],
            "desc": {
                "EN": "Inflammation of the respiratory tract or lungs. Symptoms include persistent cough, difficulty breathing, fever, and chest discomfort.",
                "FR": "Inflammation des voies respiratoires ou des poumons. Les symptômes comprennent une toux persistante, des difficultés respiratoires, de la fièvre et un inconfort thoracique."
            }
        },
        {
            "id": "gastro",
            "name": {"EN": "Gastroenteritis Suspected", "FR": "Gastro-entérite Suspectée"},
            "specialty": "Gastroenterology",
            "symptoms": ["abdominal_pain", "nausea_vomiting", "diarrhea", "fever"],
            "desc": {
                "EN": "Infection or inflammation of the digestive tract, commonly causing stomach cramps, vomiting, watery diarrhea, and mild fever.",
                "FR": "Infection ou inflammation du tube digestif, provoquant généralement des crampes d'estomac, des vomissements, une diarrhée aqueuse et une légère fièvre."
            }
        }
    ]

    hypotheses = []
    for disease in DISEASE_DB:
        matching = [s for s in disease["symptoms"] if s in symptoms_found]
        missing = [s for s in disease["symptoms"] if s not in symptoms_found]

        if len(matching) > 0:
            score = int((len(matching) / len(disease["symptoms"])) * 100)
            hypotheses.append({
                "id": disease["id"],
                "name": disease["name"],
                "specialty": disease["specialty"],
                "desc": disease["desc"],
                "confidence_score": score,
                "matching_symptoms": matching,
                "missing_symptoms": missing
            })

    hypotheses = sorted(hypotheses, key=lambda x: x["confidence_score"], reverse=True)

    recommended_specialty = "General Medicine"
    if len(hypotheses) > 0:
        recommended_specialty = hypotheses[0]["specialty"]

    matching_doctors = User.objects.filter(role="doctor", doctor_profile__specialty__icontains=recommended_specialty)
    matching_establishments = Establishment.objects.filter(doctors__specialty__icontains=recommended_specialty).distinct()

    doctors_serialized = UserSerializer(matching_doctors, many=True).data
    for doc in doctors_serialized:
        try:
            profile = DoctorProfile.objects.get(user_id=doc["id"])
            doc["specialty"] = profile.specialty
            doc["consultation_fee"] = float(profile.consultation_fee)
            if profile.establishment:
                doc["establishment_name"] = profile.establishment.name
        except DoctorProfile.DoesNotExist:
            doc["specialty"] = recommended_specialty

    establishments_serialized = EstablishmentSerializer(matching_establishments, many=True).data

    care_summary = {
        "EN": "Some of your symptoms deserve the attention of a healthcare professional. We recommend consulting a generalist or specialist soon for an appropriate evaluation.",
        "FR": "Certains de vos symptômes méritent l'avis d'un professionnel de santé. Nous vous recommandons de consulter rapidement afin d'obtenir une évaluation adaptée."
    }

    return Response({
        "symptoms_analyzed": list(symptoms_found),
        "hypotheses": hypotheses,
        "recommended_specialty": recommended_specialty,
        "care_summary": care_summary,
        "matching_doctors": doctors_serialized,
        "matching_establishments": establishments_serialized,
        "disclaimer": {
            "EN": "Only a qualified doctor can confirm a medical condition. This tool is for informational guidance only.",
            "FR": "Seul un professionnel de santé qualifié peut confirmer une maladie. Cet outil est fourni à des fins d'information et d'orientation uniquement."
        }
    })


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def womens_health_profile_view(request):
    profile, created = WomensHealthProfile.objects.get_or_create(user=request.user)
    if request.method == "GET":
        serializer = WomensHealthProfileSerializer(profile)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = WomensHealthProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def cycle_logs_list_create(request):
    if request.method == "GET":
        logs = CycleLog.objects.filter(user=request.user).order_by("-date")
        serializer = CycleLogSerializer(logs, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        data = request.data.copy()
        data["user"] = request.user.id
        serializer = CycleLogSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)