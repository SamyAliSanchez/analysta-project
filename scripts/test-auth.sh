#!/bin/bash

# Script de prueba para endpoints de autenticación
# Requiere: API corriendo en http://localhost:3000

API_URL="http://localhost:3000"

echo "🧪 Testing Auth Endpoints"
echo "========================="
echo ""

# Test 1: Register
echo "1️⃣ Testing POST /auth/register"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "displayName": "Test User"
  }')

echo "Response: $REGISTER_RESPONSE"
echo ""

# Extract token from response (requires jq, or we can parse manually)
if command -v jq &> /dev/null; then
  ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.accessToken // empty')
  if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" = "null" ]; then
    echo "❌ Register failed or no token received"
    echo ""
  else
    echo "✅ Register successful! Token received"
    echo "Token: ${ACCESS_TOKEN:0:50}..."
    echo ""
    
    # Test 2: Login
    echo "2️⃣ Testing POST /auth/login"
    LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "test@example.com",
        "password": "test123"
      }')
    
    echo "Response: $LOGIN_RESPONSE"
    echo ""
    
    # Test 3: Try register again (should fail)
    echo "3️⃣ Testing duplicate register (should fail)"
    DUPLICATE_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "test@example.com",
        "password": "test123",
        "displayName": "Test User"
      }')
    
    echo "Response: $DUPLICATE_RESPONSE"
    echo ""
    
    # Test 4: Try login with wrong password
    echo "4️⃣ Testing login with wrong password (should fail)"
    WRONG_PASSWORD_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "test@example.com",
        "password": "wrongpassword"
      }')
    
    echo "Response: $WRONG_PASSWORD_RESPONSE"
    echo ""
  fi
else
  echo "⚠️  jq not installed. Install it for better output parsing."
  echo "   On macOS: brew install jq"
fi

echo "✅ Tests completed!"

