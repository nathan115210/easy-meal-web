import type { SmartFilterConfigType } from '@/components/smartSearchOptions/SmartFilterSection';
import smartSearchData from '@/utils/constants/smartSearch/smartSearchData';

const {
  cookTimes,
  dietaryPreferences,
  maxCalories,
  difficultyLevels,
  mealType,
  specialTags,
  occasionTags,
  healthTags,
} = smartSearchData;

export const SMART_SEARCH_FILTER_CONFIG: SmartFilterConfigType[] = [
  {
    key: 'existIngredients',
    label: 'Ingredients You Have',
    type: 'input',
    placeholder: 'Add from pantry (e.g. eggs, milk)...',
    ariaLabel: 'Enter ingredients you have',
    clearable: true,
  },
  {
    key: 'excludeIngredients',
    label: 'Exclude Ingredients',
    type: 'input',
    placeholder: 'Type to exclude (e.g. peanuts)...',
    ariaLabel: 'Enter ingredients to exclude',
    clearable: true,
    isExclude: true,
  },
  {
    key: 'cookTime',
    label: 'Cook Time',
    type: 'single',
    ariaLabel: 'Select cook time',
    items: cookTimes,
  },
  {
    key: 'dietaryPreferences',
    label: 'Dietary Preference',
    type: 'multiple',
    ariaLabel: 'Select dietary preference',
    items: dietaryPreferences,
    clearable: true,
  },
  {
    key: 'maxCalories',
    label: 'Max Calories',
    type: 'single',
    ariaLabel: 'Select max calories',
    items: maxCalories,
  },
  {
    key: 'difficultyLevel',
    label: 'Difficulty',
    type: 'single',
    ariaLabel: 'Select difficulty level',
    items: difficultyLevels,
  },
  {
    key: 'mealType',
    label: 'Meal Type',
    type: 'single',
    ariaLabel: 'Select Meal Type',
    items: mealType,
  },
  {
    key: 'specialTags',
    label: 'Special Tags',
    type: 'multiple',
    ariaLabel: 'Select Special tags',
    items: specialTags,
  },
  {
    key: 'occasionTags',
    label: 'Occasion',
    type: 'multiple',
    ariaLabel: 'Select Occasion',
    items: occasionTags,
  },
  {
    key: 'healthTags',
    label: 'Special Tags',
    type: 'multiple',
    ariaLabel: 'Select Special tags',
    items: healthTags,
  },
];
