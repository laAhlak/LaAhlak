// Simple script to add beneficiaries only
// Run this after you have users in your database

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read .env.local file manually
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local')
    const envContent = fs.readFileSync(envPath, 'utf8')
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value) {
        process.env[key.trim()] = value.trim()
      }
    })
  } catch (error) {
    console.log('⚠️  Could not load .env.local file. Make sure your environment variables are set.')
  }
}

// Load environment variables
loadEnvFile()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function seedBeneficiaries() {
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
      },
      // User 2 beneficiaries (if exists)
      ...(users[1] ? [{
        user_id: users[1].id,
        name: 'علي حسن',
        email: 'ali@example.com',
        phone_number: '+962794444444',
        country: 'Jordan',
        iban: 'JO94CBJO0010000000000000001237',
        cliq_id: 'ALI123'
      }] : []),
      // User 3 beneficiaries (if exists)
      ...(users[2] ? [{
        user_id: users[2].id,
        name: 'خالد خليل',
        email: 'khalid@example.com',
        phone_number: '+962796666666',
        country: 'Jordan',
        iban: 'JO94CBJO0010000000000000001239',
        cliq_id: 'KHA123'
      }] : [])
    ]

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

// Run the seeding function
seedBeneficiaries()
