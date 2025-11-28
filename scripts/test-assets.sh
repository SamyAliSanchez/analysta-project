#!/bin/bash

# Script de prueba para endpoints de assets
# Requiere: API corriendo en http://localhost:3000

API_URL="http://localhost:3000"

echo "🧪 Testing Assets Endpoints"
echo "=========================="
echo ""

# Test 1: List all assets
echo "1️⃣ Testing GET /assets"
ALL_ASSETS=$(curl -s -X GET "$API_URL/assets")
echo "Response:"
echo "$ALL_ASSETS" | python3 -m json.tool 2>/dev/null || echo "$ALL_ASSETS"
echo ""

# Extract first asset ID if available
if command -v jq &> /dev/null; then
  FIRST_ID=$(echo "$ALL_ASSETS" | jq -r '.[0]._id // empty' 2>/dev/null)
  
  if [ ! -z "$FIRST_ID" ] && [ "$FIRST_ID" != "null" ]; then
    echo "📌 Found asset ID: $FIRST_ID"
    echo ""
    
    # Test 2: Get asset by ID
    echo "2️⃣ Testing GET /assets/:id"
    curl -s -X GET "$API_URL/assets/$FIRST_ID" | python3 -m json.tool 2>/dev/null || curl -s -X GET "$API_URL/assets/$FIRST_ID"
    echo ""
    echo ""
  fi
fi

# Test 3: Filter by category
echo "3️⃣ Testing GET /assets?category=exotic"
curl -s -X GET "$API_URL/assets?category=exotic" | python3 -m json.tool 2>/dev/null || curl -s -X GET "$API_URL/assets?category=exotic"
echo ""
echo ""

# Test 4: Search
echo "4️⃣ Testing GET /assets?search=quantum"
curl -s -X GET "$API_URL/assets?search=quantum" | python3 -m json.tool 2>/dev/null || curl -s -X GET "$API_URL/assets?search=quantum"
echo ""
echo ""

echo "✅ Tests completed!"

