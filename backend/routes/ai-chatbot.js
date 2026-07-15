const express = require('express');
const router = express.Router();

// Simple AI response generator
const generateAIResponse = (message) => {
  if (!message || typeof message !== 'string') {
    return { type: 'text', data: 'Please send a valid message.' };
  }

  const q = message.toLowerCase().trim();

  // Weight Loss Diet
  if (q.includes('weight loss') || q.includes('lose weight')) {
    if (q.includes('plan') || q.includes('diet')) {
      return {
        type: 'diet_plan',
        data: {
          title: '🔥 Weight Loss Plan',
          calories: '1800-2200 cal/day',
          macros: 'Protein: 40% | Carbs: 40% | Fats: 20%',
          meals: [
            'Breakfast: Oatmeal with berries and egg whites',
            'Snack: Protein shake or Greek yogurt',
            'Lunch: Grilled chicken breast, brown rice, broccoli',
            'Snack: Apple with almond butter',
            'Dinner: Salmon fillet, sweet potato, salad'
          ],
          tips: [
            'Create a 300-500 calorie daily deficit',
            'Drink 3-4 liters of water daily',
            'Do 30-45 minutes of cardio 4-5 times per week',
            'Get 7-9 hours of sleep every night',
            'Track your food intake consistently'
          ]
        }
      };
    }
    return {
      type: 'text',
      data: '🔥 Weight Loss Tips:\n\n✅ Create a calorie deficit of 300-500 calories\n✅ Eat high-protein foods (chicken, fish, eggs)\n✅ Do cardio 4-5 times a week\n✅ Drink plenty of water\n✅ Get adequate sleep\n\nWant a detailed diet plan? Just ask!'
    };
  }

  // Muscle Gain Diet
  if (q.includes('muscle') || q.includes('gain') || q.includes('bulk')) {
    if (q.includes('plan') || q.includes('diet')) {
      return {
        type: 'diet_plan',
        data: {
          title: '💪 Muscle Gain Plan',
          calories: '2500-3200 cal/day',
          macros: 'Protein: 35% | Carbs: 45% | Fats: 20%',
          meals: [
            'Breakfast: Pancakes with honey, whole milk, 3 eggs',
            'Snack: Banana with peanut butter',
            'Lunch: Chicken breast, basmati rice, mixed veggies',
            'Snack: Protein shake with oats and banana',
            'Dinner: Beef or salmon, pasta, olive oil dressing'
          ],
          tips: [
            'Consume 1.8-2.2g protein per kg of body weight',
            'Eat in a 300-500 calorie surplus',
            'Lift heavy weights 4-5 times per week',
            'Focus on compound movements (squat, deadlift, bench)',
            'Get 7-8 hours of sleep for recovery'
          ]
        }
      };
    }
    return {
      type: 'text',
      data: '💪 Muscle Building Tips:\n\n✅ Consume 1.8-2.2g protein per kg body weight\n✅ Eat in a 300-500 calorie surplus\n✅ Lift heavy 4-5 times per week\n✅ Focus on compound movements\n✅ Rest 48 hours between muscle groups\n\nNeed a meal plan? Ask for a muscle gain plan!'
    };
  }

  // Equipment Recommendations
  if (q.includes('equipment') || q.includes('gym') || q.includes('buy')) {
    if (q.includes('home')) {
      return {
        type: 'equipment',
        data: {
          title: '🏠 Home Gym Setup (Budget-Friendly)',
          items: [
            'Adjustable dumbbells (5-25kg)',
            'Resistance bands set (5 pieces)',
            'Pull-up bar for doorway',
            'Yoga mat for comfort',
            'Foam roller for recovery',
            'Jump rope for cardio'
          ],
          cost: '₹8,000-15,000',
          benefits: 'Perfect for beginners, saves space, very versatile for all exercises'
        }
      };
    }
    if (q.includes('beginner')) {
      return {
        type: 'equipment',
        data: {
          title: '🏋️ Beginner Gym Equipment',
          items: [
            'Barbell (20kg Olympic)',
            'Dumbbells (2-20kg pairs)',
            'Adjustable bench',
            'Squat rack or power cage',
            'Treadmill or elliptical',
            'Weight plates assortment'
          ],
          cost: '₹30,000-50,000',
          benefits: 'Full-body training capability with progressive overload options'
        }
      };
    }
    if (q.includes('advanced')) {
      return {
        type: 'equipment',
        data: {
          title: '💎 Advanced Gym Setup',
          items: [
            'Complete barbell and plate set',
            'Full dumbbell rack (5-50kg)',
            'Power rack or squat cage',
            'Leg press machine',
            'Chest press machine',
            'Cable machine',
            'Rowing machine',
            'Multiple adjustable benches'
          ],
          cost: '₹1,00,000+',
          benefits: 'Complete facility targeting all muscle groups with professional equipment'
        }
      };
    }
    return {
      type: 'text',
      data: '🏋️ Equipment Help:\n\n1. **Home Gym** - Budget-friendly (₹8K-15K)\n2. **Beginner Gym** - Intermediate setup (₹30K-50K)\n3. **Advanced Gym** - Professional facility (₹100K+)\n\nJust ask for specific setup recommendations!'
    };
  }

  // Workouts
  if (q.includes('workout') || q.includes('exercise') || q.includes('training')) {
    if (q.includes('beginner')) {
      return {
        type: 'text',
        data: '🏋️ Beginner Workout (3 days/week):\n\n**Day 1: Upper Body**\n• Bench Press: 4x8\n• Barbell Rows: 4x8\n• Shoulder Press: 3x10\n\n**Day 2: Lower Body**\n• Squats: 4x8\n• Leg Press: 3x10\n• Hamstring Curls: 3x12\n\n**Day 3: Full Body**\n• Deadlifts: 3x5\n• Chest Flyes: 3x10\n• Leg Extensions: 3x12\n\nRest 48 hours between sessions!'
      };
    }
    return {
      type: 'text',
      data: '🏋️ Workout Types:\n\n1. **Beginner** - 3 days/week\n2. **Intermediate** - 4-5 days/week\n3. **Advanced** - 6 days/week (PPL split)\n4. **Home workout** - No equipment needed\n\nJust specify your level and I\'ll create a plan!'
    };
  }

  // Nutrition & Protein
  if (q.includes('protein') || q.includes('nutrition')) {
    return {
      type: 'text',
      data: '💪 Protein Guide:\n\n✅ Target: 1.6-2.2g per kg of body weight daily\n\n**Best Sources:**\n• Chicken & turkey (25g protein per 100g)\n• Fish & salmon (20-25g protein)\n• Eggs (6g per egg)\n• Greek yogurt (10g per 100g)\n• Cottage cheese (11g per 100g)\n• Protein powder (20-30g per scoop)\n• Beef (26g per 100g)\n\nTiming: Spread protein throughout the day!'
    };
  }

  // Supplements
  if (q.includes('supplement') || q.includes('creatine') || q.includes('whey')) {
    return {
      type: 'text',
      data: '⚡ Popular Supplements:\n\n1. **Whey Protein** - Best for muscle gain and recovery\n2. **Creatine** - Improves strength and power\n3. **BCAAs** - Prevent muscle breakdown\n4. **Multivitamin** - Fill nutritional gaps\n5. **Omega-3** - Joint and heart health\n\n💡 Tip: Focus on diet first, then add supplements!'
    };
  }

  // Recovery & Sleep
  if (q.includes('sleep') || q.includes('recovery') || q.includes('rest')) {
    return {
      type: 'text',
      data: '😴 Recovery is KEY:\n\n✅ Sleep 7-9 hours per night\n✅ Muscles grow during rest!\n✅ Eat enough protein\n✅ Stay hydrated (3-4 liters water)\n✅ Active recovery: light walks, stretching\n✅ Foam rolling for muscle tension\n\n💡 More recovery = Better results!'
    };
  }

  // Default response
  return {
    type: 'text',
    data: '👋 Welcome to Gym Genie AI! I can help with:\n\n✅ **Diet Plans** - Weight loss, muscle gain, maintenance\n✅ **Equipment** - Home gym, beginner, advanced setups\n✅ **Workouts** - Routines for all levels\n✅ **Supplements** - Recommendations and benefits\n✅ **Nutrition** - Protein, macros, meal timing\n✅ **Recovery** - Sleep, rest days, stretching\n\n**Ask me anything about fitness!** 💪'
  };
};

// Diet plans based on goals (LEGACY - NOT USED)
const dietPlans = {
  weight_loss: {
    title: "🔥 Weight Loss Plan",
    calories: "1800-2200 cal/day",
    macros: "Protein: 40% | Carbs: 40% | Fats: 20%",
    meals: [
      "Breakfast: Oatmeal with berries, egg whites",
      "Snack: Protein shake or Greek yogurt",
      "Lunch: Grilled chicken, brown rice, broccoli",
      "Snack: Apple with almond butter",
      "Dinner: Salmon, sweet potato, salad"
    ],
    tips: [
      "Create a 300-500 calorie deficit",
      "Drink 3-4 liters of water daily",
      "Do 30-45 min cardio 4-5 times/week",
      "Get 7-9 hours of sleep",
      "Track your food intake"
    ]
  },
  muscle_gain: {
    title: "💪 Muscle Gain Plan",
    calories: "2500-3200 cal/day",
    macros: "Protein: 35% | Carbs: 45% | Fats: 20%",
    meals: [
      "Breakfast: Pancakes with honey, whole milk, eggs",
      "Snack: Banana with peanut butter",
      "Lunch: Chicken breast, rice, veggies",
      "Snack: Protein shake with oats",
      "Dinner: Beef or fish, pasta, olive oil dressing"
    ],
    tips: [
      "Consume 1.8-2.2g protein per kg body weight",
      "Eat in a 300-500 calorie surplus",
      "Lift heavy 4-5 times per week",
      "Focus on compound movements",
      "Get adequate rest between sessions"
    ]
  },
  maintenance: {
    title: "⚖️ Maintenance Plan",
    calories: "2000-2500 cal/day",
    macros: "Protein: 30% | Carbs: 45% | Fats: 25%",
    meals: [
      "Breakfast: Scrambled eggs, toast, fruit",
      "Snack: Nuts or fruit",
      "Lunch: Grilled chicken, quinoa, vegetables",
      "Snack: Yogurt or protein bar",
      "Dinner: Fish, sweet potato, green beans"
    ],
    tips: [
      "Maintain consistent calorie intake",
      "Train 3-4 times per week",
      "Focus on overall wellness",
      "Stay hydrated",
      "Balance all macronutrients"
    ]
  }
};

// Equipment recommendations
const equipment = {
  home_gym: {
    title: "🏠 Home Gym Setup (Budget-Friendly)",
    items: [
      "Adjustable dumbbells (5-25kg)",
      "Resistance bands set",
      "Pull-up bar",
      "Yoga mat",
      "Foam roller",
      "Jump rope"
    ],
    cost: "₹8,000-15,000",
    benefits: "Great for beginners, saves space, versatile"
  },
  beginner_gym: {
    title: "🏋️ Beginner Gym Equipment",
    items: [
      "Barbell (20kg Olympic)",
      "Dumbbells (2-20kg pairs)",
      "Adjustable bench",
      "Squat rack or cage",
      "Treadmill",
      "Weight plates"
    ],
    cost: "₹30,000-50,000",
    benefits: "Full-body training, progressive overload possible"
  },
  advanced_gym: {
    title: "💎 Advanced Gym Setup",
    items: [
      "Complete barbell set",
      "Full dumbbell rack",
      "Power rack or squat cage",
      "Leg press machine",
      "Chest press machine",
      "Cable machine",
      "Rowing machine",
      "Multiple benches"
    ],
    cost: "₹1,00,000+",
    benefits: "Complete workout facility, targets all muscle groups"
  }
};

// API Endpoint
router.post('/chat', (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    if (typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message must be a string'
      });
    }

    // Generate AI response
    const aiResponse = generateAIResponse(message);

    // Return formatted response
    if (aiResponse.type === 'diet_plan') {
      return res.status(200).json({
        success: true,
        senderId: 'AI',
        message: JSON.stringify({ type: 'diet_plan', data: aiResponse.data }),
        createdAt: new Date().toISOString()
      });
    }

    if (aiResponse.type === 'equipment') {
      return res.status(200).json({
        success: true,
        senderId: 'AI',
        message: JSON.stringify({ type: 'equipment', data: aiResponse.data }),
        createdAt: new Date().toISOString()
      });
    }

    // Regular text response
    return res.status(200).json({
      success: true,
      senderId: 'AI',
      message: aiResponse.data,
      createdAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message
    });
  }
});

module.exports = router;
