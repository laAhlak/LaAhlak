// Simple script to add beneficiaries - no external dependencies
// Just run: node scripts/simple-seed.js

const { createClient } = require('@supabase/supabase-js')

// You need to replace these with your actual Supabase credentials
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE'
const SUPABASE_SERVICE_KEY = 'YOUR_SUPABASE_SERVICE_KEY_HERE'

// Check if credentials are provided
if (SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE' || SUPABASE_SERVICE_KEY === 'YOUR_SUPABASE_SERVICE_KEY_HERE') {
  console.log('❌ Please update the script with your Supabase credentials first!')
  console.log('📝 Edit scripts/simple-seed.js and replace:')
  console.log('   - YOUR_SUPABASE_URL_HERE with your Supabase URL')
  console.log('   - YOUR_SUPABASE_SERVICE_KEY_HERE with your service role key')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function addBeneficiaries() {
  console.log('🌱 Adding beneficiaries to existing users...')

  try {
    // First, get existing users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .limit(3)

    if (usersError) {
      console.error('❌ Error fetching users:', usersError)
      return
    }

    if (!users || users.length === 0) {
      console.error('❌ No users found. Please create users first.')
      return
    }

    console.log(`👤 Found ${users.length} users`)

    // Add beneficiaries for each user
    const beneficiaries = [
      // User 1 beneficiaries
      {
        user_id: users[0].id,
        name: 'سارة الراشد',
        email: 'sara@example.com',
        phone_number: '+962791111111',
        country: 'Jordan',
        iban: 'JO94CBJO0010000000000000001234',
        cliq_id: 'SAR123'
      },
      {
        user_id: users[0].id,
        name: 'محمد الراشد',
        email: 'mohammed@example.com',
        phone_number: '+962792222222',
        country: 'Jordan',
        iban: 'JO94CBJO0010000000000000001235',
        cliq_id: 'MOH456'
      },
      {
        user_id: users[0].id,
        name: 'نورا الراشد',
        email: 'nora@example.com',
        phone_number: '+962793333333',
        country: 'Jordan',
        iban: 'JO94CBJO0010000000000000001236',
        cliq_id: 'NOR789'
      }
    ]

    // Add more beneficiaries for other users if they exist
    if (users[1]) {
      beneficiaries.push({
        user_id: users[1].id,
        name: 'علي حسن',
        email: 'ali@example.com',
        phone_number: '+962794444444',
        country: 'Jordan',
        iban: 'JO94CBJO0010000000000000001237',
        cliq_id: 'ALI123'
      })
    }

    if (users[2]) {
      beneficiaries.push({
        user_id: users[2].id,
        name: 'خالد خليل',
        email: 'khalid@example.com',
        phone_number: '+962796666666',
        country: 'Jordan',
        iban: 'JO94CBJO0010000000000000001239',
        cliq_id: 'KHA123'
      })
    }

    console.log('👥 Adding beneficiaries...')
    const { error: beneficiariesError } = await supabase
      .from('beneficiaries')
      .insert(beneficiaries)

    if (beneficiariesError) {
      console.error('❌ Error creating beneficiaries:', beneficiariesError)
      return
    }

    console.log('✅ Beneficiaries added successfully!')
    console.log(`📊 Added ${beneficiaries.length} beneficiaries`)
    console.log('')
    console.log('🔗 You can now test the beneficiaries page at /beneficiaries')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the function
addBeneficiaries()
