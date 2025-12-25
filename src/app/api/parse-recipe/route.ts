import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // In production, this would call Claude API to parse the recipe
    // For now, return a mock parsed recipe
    const mockParsedRecipe = {
      title: 'Imported Recipe',
      description: 'This recipe was imported from ' + url,
      cuisine_type: 'american',
      meal_type: ['dinner'],
      prep_time_minutes: 20,
      cook_time_minutes: 40,
      servings: 4,
      equipment: [
        { id: crypto.randomUUID(), name: 'Large skillet', is_optional: false },
        { id: crypto.randomUUID(), name: 'Cutting board', is_optional: false },
      ],
      ingredient_sections: [
        {
          id: crypto.randomUUID(),
          title: 'Main Ingredients',
          ingredients: [
            {
              id: crypto.randomUUID(),
              ingredient_id: '',
              name: 'Sample ingredient',
              quantity: 2,
              unit: 'cup',
              is_optional: false,
            },
          ],
        },
      ],
      steps: [
        {
          id: crypto.randomUUID(),
          order: 1,
          instruction: 'This is a placeholder step. The actual recipe would be parsed from the URL.',
        },
      ],
      tags: ['imported'],
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json(mockParsedRecipe)
  } catch (error) {
    console.error('Error parsing recipe:', error)
    return NextResponse.json(
      { error: 'Failed to parse recipe' },
      { status: 500 }
    )
  }
}
