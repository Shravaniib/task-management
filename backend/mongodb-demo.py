from tasks.mongodb import users_collection

result = users_collection.insert_one({
    "name": "Test User",
    "email": "test@example.com"
})

print("Inserted ID:", result.inserted_id)