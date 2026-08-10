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

def print_trip_summary(destination, days, budget, travel_style, hotel_cost, food_cost, trasportation_cost, miscellanenous_cost) :
    total_estimated_cost = (hotel_cost + food_cost + trasportation_cost + miscellanenous_cost)

    print("========================")
    print("KelanaAI")
    print("========================")
    print(f"Destination : {destination}")
    print(f"Days        : {days}")
    print(f"Budget      : {budget}")
    print(f"Style       : {travel_style}")
    print(f"Hotel Cost  : {hotel_cost}")
    print(f"Food Cost   : {food_cost}")
    print(f"Transport   : {trasportation_cost}")
    print(f"Misc Cost   : {miscellanenous_cost}")
    print(f"Total Cost  : {total_estimated_cost}")

    if total_estimated_cost > budget:
        print("⚠️ Budget Exceeded")

    print()

# print_trip_summary("Japan",5,1500,"Family")
# print_trip_summary("Bali",3,800,"Backpacker")

# print_trip_summary(destination, days, budget, travel_style)

print_trip_summary("Japan", 5, 1500, "Family", 900, 300, 250, 100)
print_trip_summary("Bali", 3, 800, "Backpacker", 300, 150, 100, 75)