const smartSearchData = {
  cookTimes: [
    { label: 'Any', value: 'any' },
    { label: '< 15m', value: 'under_15' },
    { label: '< 30m', value: 'under_30' },
    { label: '< 45m', value: 'under_45' },
    { label: '< 60m', value: 'under_60' },
    { label: '> 60m', value: 'over_60' },
  ],
  dietaryPreferences: [
    { label: 'Balanced', value: 'balanced' },
    { label: 'High Protein', value: 'high-protein' },
    { label: 'Low Carb', value: 'low_carb' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Gluten-Free', value: 'gluten_free' },
    { label: 'Keto', value: 'keto' },
    { label: 'Paleo', value: 'paleo' },
  ],
  maxCalories: [
    { label: 'Any', value: 'any' },
    { label: '< 400', value: 'under_400' },
    { label: '< 600', value: 'under_600' },
    { label: '< 800', value: 'under_800' },
  ],
  difficultyLevels: [
    { label: 'Any', value: 'any' },
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
  ],
  mealType: [
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Dinner', value: 'dinner' },
    { label: 'Snacks', value: 'snacks' },
    { label: 'Dessert', value: 'dessert' },
    { label: 'Drinks', value: 'drinks' },
  ],
  specialTags: [
    { label: '5 Ingredients or Less', value: 'simple_5_ingredients' },
    { label: 'One-Pot / One-Pan', value: 'one-pot' },
    { label: 'Minimal Cleanup', value: 'minimal_cleanup' },
    { label: 'Quick', value: 'quick' },
    { label: 'Crowd Pleaser', value: 'crowd_pleaser' },
    { label: 'Meal Prep Friendly', value: 'meal_prep' },
    { label: 'Freezer-Friendly', value: 'freezer_friendly' },
    { label: 'Spicy', value: 'spicy' },
    { label: 'Kid-Friendly', value: 'kid_friendly' },
    { label: 'Budget-Friendly', value: 'budget' },
    { label: 'Lazy Night', value: 'lazy_night' },
  ],

  occasionTags: [
    { label: 'Weeknight Dinner', value: 'weeknight' },
    { label: 'Party / Sharing', value: 'party' },
    { label: 'Date Night', value: 'date_night' },
    { label: 'Office Lunchbox', value: 'lunchbox' },
    { label: 'Comfort Food', value: 'comfort_food' },
    { label: 'Light Meal', value: 'light_meal' },
  ],

  healthTags: [
    { label: 'Low Sodium', value: 'low_sodium' },
    { label: 'High Fiber', value: 'high_fiber' },
    { label: 'Iron-Rich', value: 'iron_rich' },
    { label: 'Post-Workout', value: 'post_workout' },
  ],
};

export default smartSearchData;
