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
from fastapi import FastAPI
from pydantic import BaseModel
from services.trip_service import (calculate_daily_budget, get_trip_category, get_transportation_recommendation)

class TripRequest(BaseModel):
    destination:  str
    days:         int
    budget:       float
    travel_style: str

app = FastAPI()

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
@app.post("/api/v1/trips")
def create_trip(request: TripRequest):
    daily_budget = calculate_daily_budget(request.budget, request.days)
    category = get_trip_category(request.budget)
    recommended_transport = get_transportation_recommendation(category)
    return {
       "destination" : request.destination,
       "budget" : request.budget,
       "daily_budget" : daily_budget,
       "category" : category,
       "travel_style" : request.travel_style,
       "recommended_transport" : recommended_transport
            }