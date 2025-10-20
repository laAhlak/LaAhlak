// Script to seed the database with dummy data
// Run this after setting up your Supabase project

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

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  try {
    // First, create users in Supabase Auth
    console.log('👤 Creating users in Supabase Auth...')
    
    const users = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'ahmad@example.com',
        password: 'password123',
        full_name: 'أحمد الراشد',
        phone_number: '+962791234567'
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'fatima@example.com',
        password: 'password123',
        full_name: 'فاطمة حسن',
        phone_number: '+962792345678'
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'omar@example.com',
        password: 'password123',
        full_name: 'عمر خليل',
        phone_number: '+962793456789'
      }
    ]

    // Create users in auth.users table using admin API
    for (const user of users) {
      const { error: authError } = await supabase.auth.admin.createUser({
        user_id: user.id,
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          phone_number: user.phone_number
        }
      })

      if (authError) {
        console.log(`⚠️  User ${user.email} might already exist:`, authError.message)
      } else {
        console.log(`✅ Created user: ${user.email}`)
      }
    }

    // Now insert user profiles
    console.log('👤 Creating user profiles...')
    const { error: usersError } = await supabase
      .from('users')
      .upsert([
        {
          id: '11111111-1111-1111-1111-111111111111',
          email: 'ahmad@example.com',
          full_name: 'أحمد الراشد',
          phone_number: '+962791234567'
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          email: 'fatima@example.com',
          full_name: 'فاطمة حسن',
          phone_number: '+962792345678'
        },
        {
          id: '33333333-3333-3333-3333-333333333333',
          email: 'omar@example.com',
          full_name: 'عمر خليل',
          phone_number: '+962793456789'
        }
      ])

    if (usersError) {
      console.error('❌ Error creating user profiles:', usersError)
      return
    }

    // Insert dummy beneficiaries
    console.log('👥 Creating dummy beneficiaries...')
    const { error: beneficiariesError } = await supabase
      .from('beneficiaries')
      .insert([
        // Ahmad's beneficiaries
        {
          user_id: '11111111-1111-1111-1111-111111111111',
          name: 'سارة الراشد',
          email: 'sara@example.com',
          phone_number: '+962791111111',
          country: 'Jordan',
          iban: 'JO94CBJO0010000000000000001234',
          cliq_id: 'SAR123'
        },
        {
          user_id: '11111111-1111-1111-1111-111111111111',
          name: 'محمد الراشد',
          email: 'mohammed@example.com',
          phone_number: '+962792222222',
          country: 'Jordan',
          iban: 'JO94CBJO0010000000000000001235',
          cliq_id: 'MOH456'
        },
        {
          user_id: '11111111-1111-1111-1111-111111111111',
          name: 'نورا الراشد',
          email: 'nora@example.com',
          phone_number: '+962793333333',
          country: 'Jordan',
          iban: 'JO94CBJO0010000000000000001236',
          cliq_id: 'NOR789'
        },
        // Fatima's beneficiaries
        {
          user_id: '22222222-2222-2222-2222-222222222222',
          name: 'علي حسن',
          email: 'ali@example.com',
          phone_number: '+962794444444',
          country: 'Jordan',
          iban: 'JO94CBJO0010000000000000001237',
          cliq_id: 'ALI123'
        },
        {
          user_id: '22222222-2222-2222-2222-222222222222',
          name: 'مريم حسن',
          email: 'mariam@example.com',
          phone_number: '+962795555555',
          country: 'Jordan',
          iban: 'JO94CBJO0010000000000000001238',
          cliq_id: 'MAR456'
        },
        // Omar's beneficiaries
        {
          user_id: '33333333-3333-3333-3333-333333333333',
          name: 'خالد خليل',
          email: 'khalid@example.com',
          phone_number: '+962796666666',
          country: 'Jordan',
          iban: 'JO94CBJO0010000000000000001239',
          cliq_id: 'KHA123'
        },
        {
          user_id: '33333333-3333-3333-3333-333333333333',
          name: 'لينا خليل',
          email: 'lina@example.com',
          phone_number: '+962797777777',
          country: 'Jordan',
          iban: 'JO94CBJO0010000000000000001240',
          cliq_id: 'LIN456'
        },
        {
          user_id: '33333333-3333-3333-3333-333333333333',
          name: 'يوسف خليل',
          email: 'yousef@example.com',
          phone_number: '+962798888888',
          country: 'Jordan',
          iban: 'JO94CBJO0010000000000000001241',
          cliq_id: 'YOU789'
        }
      ])

    if (beneficiariesError) {
      console.error('❌ Error creating beneficiaries:', beneficiariesError)
      return
    }

    console.log('✅ Database seeded successfully!')
    console.log('📊 Created:')
    console.log('   - 3 users')
    console.log('   - 9 beneficiaries')
    console.log('')
    console.log('🔗 You can now test the beneficiaries page at /beneficiaries')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the seeding function
seedDatabase()
