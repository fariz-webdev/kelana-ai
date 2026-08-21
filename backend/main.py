# test variable
# destination = input("Destination : ")
# days = int(input("Days : "))
# budget = float(input("Budget : "))
# travel_style = input("Travel Style : ")

# coba tampilkan
# print(f"Destination : {destination}")
# print(f"Days        : {days}")
# print(f"Budget      : {budget}")
# print(f"Style       : {travel_style}")

# def print_trip_summary(destination, days, budget, travel_style, hotel_cost, food_cost, trasportation_cost, miscellanenous_cost) :
#     total_estimated_cost = (hotel_cost + food_cost + trasportation_cost + miscellanenous_cost)

#     print("========================")
#     print("KelanaAI")
#     print("========================")
#     print(f"Destination : {destination}")
#     print(f"Days        : {days}")
#     print(f"Budget      : {budget}")
#     print(f"Style       : {travel_style}")
#     print(f"Hotel Cost  : {hotel_cost}")
#     print(f"Food Cost   : {food_cost}")
#     print(f"Transport   : {trasportation_cost}")
#     print(f"Misc Cost   : {miscellanenous_cost}")
#     print(f"Total Cost  : {total_estimated_cost}")

#     if total_estimated_cost > budget:
#         print("⚠️ Budget Exceeded")

#     print()

# print_trip_summary("Japan",5,1500,"Family")
# print_trip_summary("Bali",3,800,"Backpacker")

# print_trip_summary(destination, days, budget, travel_style)

# print_trip_summary("Japan", 5, 1500, "Family", 900, 300, 250, 100)
# print_trip_summary("Bali", 3, 800, "Backpacker", 300, 150, 100, 75)


#session 2
# from services.trip_service import calculate_daily_budget, get_transportation_recommendation, get_trip_category, recommended_places
# destination = input("Destination : ")
# days = int(input("Days : "))
# budget = float(input("Budget : "))


# def print_trip_summary(destination, days, budget) :

#     daily = calculate_daily_budget(budget, days)
#     category = get_trip_category(budget)
#     transport = get_transportation_recommendation(category)

#     print()
#     print("=======================")
#     print("KelanaAI")
#     print("=======================")
#     print(f"Destination : {destination}")
#     print(f"Days        : {days}")
#     print(f"Budget      : {budget}")
#     print(f"Category    : {category}")
#     print(f"Daily Budget: {daily} USD/day")


#     print()
#     print("Recommended Places")
#     for place in recommended_places:
#         print(f" - {place}")

#     print()
#     print(f"Transport   : {transport}")
#     print()
#     print("Destinations : ")
#     for destination3 in destinations:
#         print(f" - {destination3}")


# destinations = []

# for i in range(2):
#     destination2 = input("Input Destination : ")
#     destinations.append(destination2)





# print_trip_summary(destination, days, budget)

# session 3
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from services.trip_service import (calculate_daily_budget, get_trip_category, get_transportation_recommendation)
from models.trip import Trip
from database import SessionLocal, init_db
from services.bedrock_service import get_ai_recommendation

class TripRequest(BaseModel):
    destination:  str
    days:         int
    budget:       float
    travel_style: str

app = FastAPI()

init_db()

# a Get endpoint
@app.get("/")
def home():
  return {"message" : "Welcome to KelanaAI"}

# a Get health endpoint
@app.get("/health")
def check_health():
    return {"status" : "OK"}

# a Get categories endpoint
@app.get("/api/v1/trip-categories")
def categories():
    return ["Backpacker", "Standard", "Luxury"]

# POST endpoint - receives JSON, returns JSON
# @app.post("/api/v1/trips")
# def create_trip(request: TripRequest):
#     daily_budget = calculate_daily_budget(request.budget, request.days)
#     category = get_trip_category(request.budget)
#     recommended_transport = get_transportation_recommendation(category)
#     return {
#        "destination" : request.destination,
#        "budget" : request.budget,
#        "daily_budget" : daily_budget,
#        "category" : category,
#        "travel_style" : request.travel_style,
#        "recommended_transport" : recommended_transport
#             }

@app.post("/api/v1/trips")
def create_trip(request: TripRequest):
    daily_budget = calculate_daily_budget(request.budget, request.days)
    category = get_trip_category(request.budget)
    recommended_transport = get_transportation_recommendation(category)

    ai_recommendation = get_ai_recommendation(
        destination=request.destination,
        days=request.days,
        budget=request.budget,
        travel_style=request.travel_style,
        daily_budget=daily_budget,
        recommended_transport=recommended_transport,
    )

    # create a Trip ORM object
    trip = Trip(
        destination         = request.destination,
        days                = request.days,
        budget              = request.budget,
        category            = category,
        daily_budget        = daily_budget,
        ai_recommendation   = ai_recommendation,
    )


    # save to PostgreSQL
    db = SessionLocal()
    db.add(trip)
    db.commit()
    db.refresh(trip)
    db.close()
    return trip


@app.get("/api/v1/trips")
def list_trips():
    db = SessionLocal()
    trips = db.query(Trip).all()
    db.close()
    return trips

@app.get("/api/v1/trips/{trip_id}")
def get_trip(trip_id: int):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    db.close()
    # handling not found
    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")
    return trip


@app.put("/api/v1/trips/{id}")
def update_budget(id: int, new_budget: float):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == id).first()

    if trip is None:
        db.close()
        raise HTTPException(status_code=404, detail=f"Trip with id {id} not found")

    trip.budget = new_budget
    trip.daily_budget = calculate_daily_budget(new_budget, trip.days)
    trip.category = get_trip_category(new_budget)

    db.commit()
    db.refresh(trip)
    db.close()
    return trip


@app.delete("/api/v1/trips/{id}")
def remove_trip(id: int):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == id).first()

    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip with id {id} not found")

    db.delete(trip)
    db.commit()
    db.close()
    return {"message": "Trip deleted successfully"}

