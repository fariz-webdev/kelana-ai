recommended_places = [
    "Tokyo Tower", 
    "Shibuya", 
    "Mount Fuji"
]

def calculate_daily_budget(budget, days):
    return budget/days

def get_trip_category(budget):
    if budget < 1000:
        return "Backpacker"
    elif budget <= 3000:
        return "Standart"
    else:
        return "Luxury"


def get_transportation_recommendation(category):
    match category:
        case "Backpacker":
            return "Bus"
        case "Standart":
            return "Train"
        case "Luxury":
            return "Flight"
