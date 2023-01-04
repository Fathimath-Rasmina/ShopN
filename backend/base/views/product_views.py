from django.shortcuts import render
# from django.http import JsonResponse
# from django.contrib.auth.models import User
from base.products import products 
from base.models import Product, Review
from base.serializers import ProductSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.response import Response

# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from rest_framework_simplejwt.views import TokenObtainPairView

# from .serializers import UserSerializer, UserSerializerWithToken
# from django.contrib.auth.hashers import make_password
from rest_framework import status
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger




@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')
    print('query:',query)
    if query == None:
        query =''
    
    products = Product.objects.filter(name__icontains=query)
    
    page =  request.query_params.get('page')
    paginator = Paginator(products, 2)
    
    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)
    
    if page == None:
        page = 1
    
    page = int(page)
    
    
    serializer = ProductSerializer(products, many=True)
    return Response({'products':serializer.data,'page':page, 'pages':paginator.num_pages})

@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(_id = pk)
    data = request.data
    # rating = data['rating']
    
    #1 - review already exists
    alreadyExists = product.review_set.filter(user=user).exists()
    
    if alreadyExists:
        content = {'detail':'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    
    #2 - No rating or 0
    elif data['rating'] == 0:
        content = {'detail':'Please select a rating here'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    
    #3 - create review
    else:
        review = Review.objects.create(
            user = user,
            product = product,
            name = user.first_name,
            rating = data['rating'],
            comment = data['comment'], 
        )
        
        reviews = product.review_set.all()
        product.numReviews = len(reviews)
        
        total = 0
        for i in reviews:
            total += i.rating
        product.rating = total / len(reviews)
        product.save()
        
        return Response({'Review Addded'})