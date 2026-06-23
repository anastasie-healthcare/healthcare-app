from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.conf import settings
from .serializers import RegisterSerializer, UserSerializer
import anthropic

User = get_user_model()


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