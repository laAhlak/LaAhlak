// Script to create a test user in Supabase
// Run this first before adding beneficiaries

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

async function createTestUser() {
  console.log('👤 Creating a test user...')

  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'password123',
      email_confirm: true,
      user_metadata: {
        full_name: 'أحمد الراشد',
        phone_number: '+962791234567'
      }
    })

    if (authError) {
      console.log('⚠️  Auth user might already exist:', authError.message)
    } else {
      console.log('✅ Created auth user:', authData.user.email)
    }

    // Get the user ID (either from creation or existing user)
    let userId
    if (authData && authData.user) {
      userId = authData.user.id
    } else {
      // Try to find existing user
      const { data: existingUser } = await supabase.auth.admin.listUsers()
      const testUser = existingUser.users.find(u => u.email === 'test@example.com')
      if (testUser) {
        userId = testUser.id
        console.log('✅ Found existing auth user:', testUser.email)
      } else {
        console.error('❌ Could not find or create auth user')
        return
      }
    }

    // Create user profile in our users table
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: 'test@example.com',
        full_name: 'أحمد الراشد',
        phone_number: '+962791234567'
      })

    if (profileError) {
      console.error('❌ Error creating user profile:', profileError)
      return
    }

    console.log('✅ Created user profile successfully!')
    console.log('📧 Email: test@example.com')
    console.log('🔑 Password: password123')
    console.log('👤 Name: أحمد الراشد')
    console.log('')
    console.log('🎉 You can now run: npm run seed-beneficiaries')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the function
createTestUser()
